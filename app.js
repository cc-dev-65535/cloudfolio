import express from "express";
import path from "path";
import multer from "multer";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    PutCommand,
    ScanCommand,
    DeleteCommand,
    QueryCommand,
    UpdateCommand,
    DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { copyFile } from "node:fs/promises";
import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
    userPoolId: "us-west-2_jERIkWzhR",
    tokenUse: "access",
    clientId: "5qatetkqk6qpcimn3q2h5ah58u",
});

const copyFiles = async (items) => {
    for (const item of items) {
        const pathFrom = `${item.path.replace("uploads/", "/data/")}`;
        const pathTo = `${path.resolve()}/public/${item.path}`;
        console.log(pathFrom);
        console.log(pathTo);
        console.log(path.resolve());
        await copyFile(pathFrom, pathTo);
    }
};

const validateJwt = async function (req, res, next) {
    try {
        const payload = await verifier.verify(req.headers.authorization);
        console.log("Token is valid. Payload:", payload);
        res.locals.payload = payload;
    } catch {
        console.log("Token not valid!");
        res.sendStatus(400);
        return;
    }

    next();
};

const client = new DynamoDBClient({
    region: "us-west-2",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const docClient = DynamoDBDocumentClient.from(client);

// TODO: figure out how to do sorting on dynamodb instead of here
const sortByDate = (items) => {
    return items.toSorted(({ date: firstDate }, { date: secondDate }) => {
        return firstDate < secondDate ? 1 : -1;
    });
};

// TODO: figure out how to do filtering on dynamodb instead of here
const filterPhotos = (items, album) => {
    return items.filter((item) => item.album === album);
};

async function deletePhoto(key, username) {
    // const command = new DeleteCommand({
    //     TableName: "Photos",
    //     Key: {
    //         key: key,
    //     },
    // });
    const queryCommand = new QueryCommand({
        KeyConditionExpression: "username = :mykey",
        ExpressionAttributeValues: {
            ":mykey": username,
        },
        TableName: "Users",
    });

    const queryResponse = await docClient.send(queryCommand);
    const photos = queryResponse.Items[0].photos;

    const itemIndex = photos.findIndex((item) => item.key === key);
    photos.splice(itemIndex, 1);

    const command = new UpdateCommand({
        TableName: "Users",
        Key: {
            username: username,
        },
        UpdateExpression: "set photos = :list",
        ExpressionAttributeValues: {
            ":list": photos,
        },
    });

    const response = await docClient.send(command);
    return response;
}

async function updateImageAlbum(key, name, username) {
    const queryResponse = await getExistingPhotos(username);

    // const command = new UpdateCommand({
    //     TableName: "Photos",
    //     Key: {
    //         key: key,
    //     },
    //     UpdateExpression: "set album = :name",
    //     ExpressionAttributeValues: {
    //         ":name": name,
    //     },
    // });
    const itemIndex = queryResponse.findIndex((item) => item.key === key);
    const itemToChange = queryResponse.find((item) => item.key === key);
    itemToChange.album = name;
    queryResponse[itemIndex] = itemToChange;

    console.log(queryResponse);

    const command = new UpdateCommand({
        TableName: "Users",
        Key: {
            username: username,
        },
        UpdateExpression: "set photos = :list",
        ExpressionAttributeValues: {
            ":list": queryResponse,
        },
    });

    const response = await docClient.send(command);
    return response;
}

async function getAlbums(username) {
    // const command = new QueryCommand({
    //     KeyConditionExpression: "userkey = :mykey",
    //     ExpressionAttributeValues: {
    //         ":mykey": "1",
    //     },
    //     TableName: "Albums",
    // });

    const command = new QueryCommand({
        KeyConditionExpression: "username = :mykey",
        ExpressionAttributeValues: {
            ":mykey": username,
        },
        TableName: "Users",
    });

    const response = await docClient.send(command);
    return response.Items[0].albums;
}

async function addAlbum(name, username) {
    const queryResponse = await getAlbums(username);

    queryResponse.push(name);

    // const command = new UpdateCommand({
    //     TableName: "Albums",
    //     Key: {
    //         userkey: "1",
    //     },
    //     UpdateExpression: "set albums = :list",
    //     ExpressionAttributeValues: {
    //         ":list": queryResponse,
    //     },
    // });

    const command = new UpdateCommand({
        TableName: "Users",
        Key: {
            username: username,
        },
        UpdateExpression: "set albums = :list",
        ExpressionAttributeValues: {
            ":list": queryResponse,
        },
    });

    const response = await docClient.send(command);
    return response;
}

async function createUser(username) {
    const queryCommand = new QueryCommand({
        KeyConditionExpression: "username = :mykey",
        ExpressionAttributeValues: {
            ":mykey": username,
        },
        TableName: "Users",
    });

    const queryResponse = await docClient.send(queryCommand);
    if (queryResponse.Count) {
        return;
    }

    const putCommand = new PutCommand({
        TableName: "Users",
        Item: {
            username: username,
            photos: [],
            albums: ["all"],
        },
    });

    const response = await docClient.send(putCommand);
    console.log(response);
    return response;
}

async function getPhotos(album, username) {
    const command = new QueryCommand({
        KeyConditionExpression: "username = :usernamekey",
        ExpressionAttributeValues: {
            ":usernamekey": username,
        },
        TableName: "Users",
    });

    const response = await docClient.send(command);
    const filteredPhotos = filterPhotos(response.Items[0].photos, album);
    const sortedItems = sortByDate(filteredPhotos);

    await copyFiles(sortedItems);
    return sortedItems;
}

async function getExistingPhotos(username) {
    const command = new QueryCommand({
        KeyConditionExpression: "username = :usernamekey",
        ExpressionAttributeValues: {
            ":usernamekey": username,
        },
        TableName: "Users",
    });

    const response = await docClient.send(command);
    return response.Items[0].photos;
}

async function addPhoto(path, username) {
    // const command = new PutCommand({
    //     TableName: "Photos",
    //     Item: {
    //         key: `${Math.floor(Math.random() * 1000000)}`,
    //         path: `/${path.replace("public/", "")}`,
    //         album: "all",
    //         date: new Date().toISOString(),
    //     },
    // });
    const queryResponse = await getExistingPhotos(username);

    queryResponse.push({
        key: `${Math.floor(Math.random() * 10000000)}`,
        // path: `/${path.replace("public/", "")}`,
        path: `${path.replace("/data/", "uploads/")}`,
        album: "all",
        date: new Date().toISOString(),
    });

    const command = new UpdateCommand({
        TableName: "Users",
        Key: {
            username: username,
        },
        UpdateExpression: "set photos = :list",
        ExpressionAttributeValues: {
            ":list": queryResponse,
        },
    });

    const response = await docClient.send(command);
    return response;
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "/data");
    },
    filename: function (req, file, cb) {
        const filename = file.originalname;
        cb(null, filename);
    },
});

const app = express();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.static(path.join(path.resolve(), "public")));

app.patch("/api/image/:key/:name", validateJwt, async (req, res) => {
    await updateImageAlbum(
        req.params["key"],
        req.params["name"],
        res.locals.payload.username
    );
    res.sendStatus(200);
});
app.get("/api/user/album", validateJwt, async (req, res) => {
    await createUser(res.locals.payload.username);
    const albumNames = await getAlbums(res.locals.payload.username);
    res.status(200).json({ albums: albumNames });
});
app.patch("/api/user/album/*", validateJwt, async (req, res) => {
    await addAlbum(req.params["0"], res.locals.payload.username);
    res.sendStatus(200);
});
app.delete("/api/image/*", validateJwt, async (req, res) => {
    await deletePhoto(req.params["0"], res.locals.payload.username);
    res.sendStatus(200);
});
app.get("/api/album/*", validateJwt, async (req, res) => {
    // console.log(res.locals.payload.username);
    await createUser(res.locals.payload.username);
    const photoUrls = await getPhotos(
        req.params["0"],
        res.locals.payload.username
    );
    res.status(200).json({ photos: photoUrls });
});
app.get("/api/image", validateJwt, async (req, res) => {
    // console.log(res.locals.payload.username);
    await createUser(res.locals.payload.username);
    const photoUrls = await getPhotos("all", res.locals.payload.username);
    res.status(200).json({ photos: photoUrls });
});
app.post(
    "/api/image",
    validateJwt,
    upload.single("image"),
    async (req, res) => {
        // console.log(res.locals.payload.username);
        await addPhoto(req.file.path, res.locals.payload.username);
        res.sendStatus(200);
    }
);
app.get("*", (req, res) => {
    res.sendFile("index.html", { root: path.join(path.resolve(), "public") });
});

app.use(express.static("public"));

export default app;
