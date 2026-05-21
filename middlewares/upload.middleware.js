const multer = require("multer");

const path = require("path");

const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads/";

    // vendor logo
    if (file.fieldname === "logo") {
      uploadPath += "vendors";
    }

    // product image
    else if (file.fieldname === "image") {
      uploadPath += "products";
    }

    // create folder if not exists
    fs.mkdirSync(uploadPath, {
      recursive: true,
    });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
});

module.exports = upload;
