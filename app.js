import express from "express";
import path from "path";

const app = express();

app.use(express.json());
app.use(express.static(path.join(path.resolve(), "public")));

app.get("*", (req, res) => {
    res.sendFile("index.html", { root: path.join(path.resolve(), "public") });
});

export default app;
