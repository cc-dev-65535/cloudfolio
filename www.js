// import app from "./app.js";
// import http from "http";

// const port = process.env.PORT || "3200";
// app.set("port", port);

// const server = http.createServer(app);
// server.listen(port);

import app from "./app.js";
import http from "http";

const port = process.env.PORT || "3200";
app.set("port", port);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

server.on('error', (error) => {
  console.error('Error starting server:', error);
});
