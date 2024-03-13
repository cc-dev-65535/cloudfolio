import express from "express";
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
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

app.post("/api/image", upload.single("image"), (req, res) => {
    res.sendStatus(200);
});
app.get("*", (req, res) => {
    res.sendFile("index.html", { root: path.join(path.resolve(), "public") });
});

export default app;
