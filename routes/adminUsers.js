var express = require("express");
const User = require("../models/users");
const Category = require("../models/category");
const bcrypt = require("bcrypt");
const fs = require("fs");

const router = require("express").Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const validateRegisterInput = require("../validation/register");
const validateCategoryInput = require("../validation/category");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/Images");
//   },
//   filename: function (req, file, cb) {
//     cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
//   if (allowedFileTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };
// let upload = multer({ storage, fileFilter });

// router.route("/createcategory").post(upload.single("photo"), (req, res) => {
//   // console.log("filename", req.file.filename);
//   const { errors, isValid } = validateCategoryInput(req.body);
//   if (!isValid) {
//     return res.status(400).json(errors);
//   }
//   Category.findOne({ name: req.body.name })
//     .then((category) => {
//       if (category) {
//         const path = "public/images/" + req.file.filename;
//         fs.unlinkSync(path);
//         console.log("path", path);
//         return res.status(400).json("Category already exists");
//       } else {
//         const newCategory = new Category({
//           name: req.body.name,
//           photo: req.file.filename,
//           description: req.body.description,
//           status: req.body.status,
//         });
//         newCategory
//           .save()
//           .then((user) => res.status(200).json("Category Created Successfully"))
//           .catch((err) => {
//             console.log(err);
//           });
//       }
//     })
//     .catch((e) => {
//       const path = "public/images/" + req.file.filename;
//       console.log("path", path);
//     });
// });

router.post("/create", (req, res) => {
  //validation
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) return res.status(400).json("email already exists");
    else {
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.status(200).json("User Created Successfully"))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

router.get("/viewall", (req, res) => {
  User.find({}, { password: 0, __v: 0 })
    .then((user) => {
      // console.log("user", user);

      res.json(user);
    })
    .catch((err) => {
      res.status(400).json("Error" + err);
    });
});
router.get("/viewsingle/:id", (req, res) => {
  User.findById(req.params.id, { password: 0, __v: 0 })
    .then((user) => {
      // console.log("user", user);

      res.json(user);
    })
    .catch((err) => {
      res.status(400).json("Error" + err);
    });
});
router.put("/edit/:id", (req, res) => {
  // console.log("id", req.params.id);
  User.findByIdAndUpdate(req.params.id, {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
  })
    .then((data) => res.json({ message: "updated successfully" }))
    .catch((err) =>
      res.status(400).json({ message: "Failed to update", error: err?.message })
    );
});

router.delete("/delete/:id", (req, res) => {
  // console.log("id", req.body);
  User.findByIdAndRemove(req.params.id, req.body)
    .then((deleteduser) => {
      console.log("deleteduser", deleteduser);
      res.status(200).json("Deleted Successful");
    })
    .catch((err) => {
      res.status(404).json("user not found", err.message);
      console.log("err", err);
    });
});
module.exports = router;
