const express = require("express");
const bodyParser = require("body-parser");
const dbConnect = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 6000;
const cookieParser = require("cookie-parser");
const morgon = require("morgan");
const cors = require("cors");
const path = require("path");
app.use(
  "/public/uploads/",
  express.static(path.join(__dirname, "public/uploads"))
);
const { initAdmin } = require("./controller/admin/init");
initAdmin();
//DataBase Connection
dbConnect();
app.use(morgon("dev"));
const allowedOrigins = ["https://dress-website-new.vercel.app"]; 

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//Home Router
app.get("/", (req, res) => {
  res.send("Test app");
});
const arr = [];
app.post("/", (req, res) => {
  arr.push(req.body);
  res.send(arr);
});
//Routes
require("./routes/")(app);
//Error Handler
app.use(notFound);
app.use(errorHandler);

//Create Server
app.listen(PORT, () => {
  console.log(`Server is running at post ${PORT}`);
});
