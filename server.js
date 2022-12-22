var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var adminUserRouter = require("./routes/adminUsers");
var adminCategoryRouter = require("./routes/adminCategory");
const connectDB = require("./config/db");
var app = express();
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, "../admin panel/build")));
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../admin panel/build/index.html"));
// });
connectDB();
// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
console.log(path.join(__dirname, "./public/images"));
app.use("/", express.static(path.join(__dirname, "./public/images")));
app.use("/", indexRouter);
app.use("/admin/users", adminUserRouter);
app.use("/admin/category", adminCategoryRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });
const port = process.env.PORT;
app.listen(port, () => [console.log(`server running at ${port}`)]);

module.exports = app;
