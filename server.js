const http = require("http");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");
const models = require("./models");
const { uploadMedia, getMedia, deleteMedia } = require("./controller/Media");

const app = express();

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 5000;

// MIDDLEWARES
app.use(
  cors({
    origin: "*",
  })
);
app.use(
  fileUpload({
    limits: { fileSize: 30 * 1024 * 1024 },
  })
);
app.use("/public", express.static(path.join(process.env.PWD, "public")));
console.log(path.join(process.env.PWD, "public"));
// app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use("/api", routes);

try {
  models.sequelize.authenticate().then(() => {
    console.log("Connection has been established successfully.");
  });
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.post("/media/upload/:type", uploadMedia);
app.get("/media/get/:type", getMedia);
app.delete("/media/delete/:id", deleteMedia);


models.sequelize.sync({ force: false }).then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 REST API running on http://localhost:${PORT}`);
  });
});
