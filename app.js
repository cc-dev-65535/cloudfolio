import express from "express";
import path from "path";
import multer from "multer";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    PutCommand,
    ScanCommand,
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

async function getPhotos() {
    const command = new ScanCommand({
        TableName: "Photos",
    });

    const { Items: items } = await docClient.send(command);
    return items;
}

async function addPhoto(path) {
    console.log(path);
    const command = new PutCommand({
        TableName: "Photos",
        Item: {
            path: `/${path.replace("public/", "")}`,
            album: 'all',
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

app.delete("/api/image/*", async (req, res) => {
    console.log(req.params);
    // const photoUrls = await getPhotos();
    // res.status(200).json({ photos: photoUrls });
});
app.get("/api/album/*", async (req, res) => {
    console.log(req.params);
    const photoUrls = await getPhotos();
    res.status(200).json({ photos: photoUrls });
});
app.get("/api/image", async (req, res) => {
    const photoUrls = await getPhotos();
    res.status(200).json({ photos: photoUrls });
});
app.post("/api/image", upload.single("image"), async (req, res) => {
    await addPhoto(req.file.path);
    res.sendStatus(200);
});
app.get("*", (req, res) => {
    res.sendFile("index.html", { root: path.join(path.resolve(), "public") });
});

export default app;
