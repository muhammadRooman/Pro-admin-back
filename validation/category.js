const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateCategoryInput(data) {
  let errors = {};
  //   data = data1.body;
  //   dataphoto = data1.file.filename;
  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  //   dataphoto = !isEmpty(dataphoto) ? dataphoto : "";
  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }
  //   if (dataphoto) {
  //   } else {
  //     errors.photo = "Photo field is required";
  //   }
  //   if (Validator.isEmpty(dataphoto)) {
  //     errors.photo = "Photo field is required";
  //   }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
