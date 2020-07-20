const express = require("express");
const app = express();
const path = require("path");

// Use to parse the body of objects
app.use(express.json());

app.use("/api/v1/users", require("./api/v1/users"));
app.use("/api/v1/memory-cards", require("./api/v1/memory-cards"));
app.use("/api/v1/queue", require("./api/v1/queue"));

app.use(express.static("client/build"));
app.get("*", (req, res) => {
   res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || 7777;

app.listen(port, () =>
   console.log(`Server running at http://localhost:${port}`)
);
