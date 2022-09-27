const express = require("express");
const bodyparser = require("body-parser");
const mongooes = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const imageStorage = multer.diskStorage({
  destination: "Images",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {},
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
});

const app = express();

app.use(cors());
app.post(
  "/uploadImage",
  imageUpload.single("image"),
  (req, res) => {
    res.status(200).json({ filePath: req.file.filename });
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

app.get(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use('/images',express.static(__dirname + '/Images'));

mongooes
  .connect("mongodb://localhost:27017/Contact_db", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database Connected...");
  })
  .catch((err) => {
    console.log("not Connected", err);
  });

app.get("/", (req, res) => {
  res.send("Hello....");
});

app.get("/user", (req, res) => {
  res.send("Hi from user");
});

require("./src/Routes/ContactRoutes.js")(app);
require("./src/Routes/TeamsRoutes.js")(app);
require("./src/Routes/ProjectRoutes.js")(app);
require("./src/Routes/ServicesRoutes.js")(app);
require("./src/Routes/CountRoutes.js")(app);
app.listen(5000, () => {
  console.log("Server Started....");
});
