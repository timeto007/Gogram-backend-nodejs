const express = require("express");
const app = express();
const port = 3333;
const mongoose = require("mongoose");
const { MONGOURL } = require("./keys");
const router = require("./routers/routers");
mongoose.set("strictQuery", false);

const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gogram API",
      version: "1.0.0",
      description: "A simple Express Library API",
    },
    servers: [
      {
        url: "http://localhost:3333",
      },
    ],
  },
  apis: ["routers.js", "./Controllers/*.js"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

mongoose.connect(MONGOURL);
app.use(express.json());
app.use(router);
//////
const multer = require("multer");
//storage
const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: Storage,
}).single("testImage");

/////
mongoose.connection.on("connected", () => {
  console.log("connected to mongo");
});

mongoose.connection.on("error", (err) => {
  console.log("error while connecting", err);
});
app.get("/", (req, res) => {
  res.send("Horld!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
