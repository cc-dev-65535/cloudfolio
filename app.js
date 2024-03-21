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

const client = new DynamoDBClient({
    region: "us-west-2",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    // accessKeyId,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // secretAccessKey,
});
const docClient = DynamoDBDocumentClient.from(client);

async function updateImageAlbum(key, name) {
    const command = new UpdateCommand({
        TableName: "Photos",
        Key: {
            key: key,
        },
        UpdateExpression: "set album = :name",
        ExpressionAttributeValues: {
            ":name": name,
        },
    });

    const response = await docClient.send(command);
    console.log(response);
    return response;
}

async function getAlbums() {
    const command = new QueryCommand({
        KeyConditionExpression: "userkey = :mykey",
        ExpressionAttributeValues: {
            ":mykey": "1",
        },
        TableName: "Albums",
    });

    const response = await docClient.send(command);
    console.log(response);
    return response.Items[0].albums;
}

async function addAlbum(name) {
    const queryResponse = await getAlbums();
    console.log(queryResponse);

    queryResponse.push(name);

    const command = new UpdateCommand({
        TableName: "Albums",
        Key: {
            userkey: "1",
        },
        UpdateExpression: "set albums = :list",
        ExpressionAttributeValues: {
            ":list": queryResponse,
        },
    });

    const response = await docClient.send(command);
    console.log(response);
    return response;
}

async function deletePhoto(key) {
    console.log(key);
    const command = new DeleteCommand({
        TableName: "Photos",
        Key: {
            key: key,
        },
    });

    const response = await docClient.send(command);
    console.log(response);
    return response;
}

async function getPhotos(album) {
    // console.log(album);
    const command = new ScanCommand({
        TableName: "Photos",
        ExpressionAttributeValues: {
            ":album": album,
        },
        FilterExpression: "album = :album",
    });

    const { Items: items } = await docClient.send(command);
    return items;
}

async function addPhoto(path) {
    // console.log(path);
    const command = new PutCommand({
        TableName: "Photos",
        Item: {
            key: `${Math.floor(Math.random() * 10000)}`,
            path: `/${path.replace("public/", "")}`,
            album: "all",
        },
    });

    const response = await docClient.send(command);
    // console.log(response);
    return response;
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/");
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

app.patch("/api/image/:key/:name", async (req, res) => {
    console.log(req.params);
    await updateImageAlbum(req.params["key"], req.params["name"]);
    res.sendStatus(200);
});
app.get("/api/user/album", async (req, res) => {
    const albumNames = await getAlbums();
    res.status(200).json({ albums: albumNames });
});
app.patch("/api/user/album/*", async (req, res) => {
    await addAlbum(req.params["0"]);
    res.sendStatus(200);
});
app.delete("/api/image/*", async (req, res) => {
    await deletePhoto(req.params["0"]);
    res.sendStatus(200);
});
app.get("/api/album/*", async (req, res) => {
    // console.log(req.params);
    const photoUrls = await getPhotos(req.params["0"]);
    res.status(200).json({ photos: photoUrls });
});
app.get("/api/image", async (req, res) => {
    const photoUrls = await getPhotos("all");
    res.status(200).json({ photos: photoUrls });
});
app.post("/api/image", upload.single("image"), async (req, res) => {
    await addPhoto(req.file.path);
    res.sendStatus(200);
});
app.get("*", (req, res) => {
    res.sendFile("index.html", { root: path.join(path.resolve(), "public") });
});

app.use(express.static("public"));

export default app;
