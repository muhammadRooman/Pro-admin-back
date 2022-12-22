const User = require("../models/users");
const Category = require("../models/category");
const bcrypt = require("bcrypt");
const fs = require("fs");
const router = require("express").Router();
const path = require("path");
const validateCategoryInput = require("../validation/category");
const upload = require("../config/image");

router.route("/create").post(upload.single("photo"), (req, res) => {
  // console.log("filename", req.file.filename);
  const { errors, isValid } = validateCategoryInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Category.findOne({ name: req.body.name })
    .then((category) => {
      if (category) {
        const path = "public/images/" + req.file.filename;
        fs.unlinkSync(path);
        // console.log("path", path);
        return res.status(400).json("Category already exists");
      } else {
        const newCategory = new Category({
          name: req.body.name,
          photo: req.file.filename,
          description: req.body.description,
          status: req.body.status,
        });
        newCategory
          .save()
          .then((user) => res.status(200).json("Category Created Successfully"))
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((e) => {
      const path = "public/images/" + req.file.filename;
      console.log("path", path);
    });
});

router.get("/viewall", (req, res) => {
  Category.find({}, { __v: 0 })
    .then((categories) => {
      console.log("categories", categories);
      res?.json(categories);
    })
    .catch((e) => {
      res.status(400).json("Error" + e);
    });
});

router.delete("/delete/:id", (req, res) => {
  // console.log("id", req.body);
  Category.findByIdAndRemove(req.params.id, req.body)
    .then((deletedcategory) => {
      console.log("deleteduser", deletedcategory);
      res.status(200).json("Deleted Successful");
    })
    .catch((err) => {
      res.status(404).json("user not found", err.message);
      console.log("err", err);
    });
});

router.get("/viewsingle/:id", (req, res) => {
  Category.findById(req.params.id, { __v: 0 })
    .then((category) => {
      // console.log("user", user);

      res.json(category);
    })
    .catch((err) => {
      res.status(400).json("Error" + err);
    });
});
router.put("/edit/:id", upload.single("photo"), (req, res) => {
  // console.log("id", req.params.id);
  Category.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    description: req.body.description,
    status: req.body.status,
    photo: req?.file?.filename,
  })
    .then((data) => {
      if (data) {
        res.json({ message: "updated successfully" });
      } else {
        const path = "public/images/" + req.file.filename;
        fs.unlinkSync(path);
      }
    })
    .catch((err) =>
      res.status(400).json({ message: "Failed to update", error: err?.message })
    );
});

module.exports = router;
