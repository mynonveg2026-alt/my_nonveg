const db = require("../models");

const Product = db.Product;
const Category = db.Category;
const Vendor = db.Vendor;

const HttpStatus = require("../enums/httpStatusCode.enum");

const ResponseMessages = require("../enums/responseMessages.enum");

const productController = {};

// CREATE CATEGORY
productController.createCategory = async (req, res) => {
  try {
    const category = await Category.create({
      name: req.body.name,
      image: req.file ? req.file.filename : null,
    });

    return res.success(
      HttpStatus.CREATED,
      true,
      ResponseMessages.SAVE,
      category,
    );
  } catch (error) {
    return res.error(HttpStatus.INTERNAL_SERVER_ERROR, false, error.message);
  }
};

// GET CATEGORIES
productController.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["id", "DESC"]],
    });

    return res.success(
      HttpStatus.OK,
      true,
      ResponseMessages.DATA_RETRIEVED_SUCCESSFULLY,
      categories,
    );
  } catch (error) {
    return res.error(HttpStatus.INTERNAL_SERVER_ERROR, false, error.message);
  }
};

// CREATE PRODUCT
productController.createProduct = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    const product = await Product.create({
      vendor_id: vendor.id,

      category_id: req.body.category_id,

      name: req.body.name,

      description: req.body.description,

      price: req.body.price,

      stock: req.body.stock,

      food_type: req.body.food_type,

      image: req.file ? req.file.filename : null,
    });

    return res.success(
      HttpStatus.CREATED,
      true,
      ResponseMessages.SAVE,
      product,
    );
  } catch (error) {
    console.log(error);

    return res.error(HttpStatus.INTERNAL_SERVER_ERROR, false, error.message);
  }
};

// GET ALL PRODUCTS
productController.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
        },
        {
          model: Vendor,
        },
      ],

      order: [["id", "DESC"]],
    });

    return res.success(
      HttpStatus.OK,
      true,
      ResponseMessages.DATA_RETRIEVED_SUCCESSFULLY,
      products,
    );
  } catch (error) {
    return res.error(HttpStatus.INTERNAL_SERVER_ERROR, false, error.message);
  }
};

// SINGLE PRODUCT
productController.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
        },
        {
          model: Vendor,
        },
      ],
    });

    if (!product) {
      return res.error(HttpStatus.NOT_FOUND, false, "Product not found");
    }

    return res.success(
      HttpStatus.OK,
      true,
      ResponseMessages.DATA_RETRIEVED_SUCCESSFULLY,
      product,
    );
  } catch (error) {
    return res.error(HttpStatus.INTERNAL_SERVER_ERROR, false, error.message);
  }
};

// UPDATE PRODUCT
productController.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.error(HttpStatus.NOT_FOUND, false, "Product not found");
    }

    await product.update({
      category_id: req.body.category_id,

      name: req.body.name,

      description: req.body.description,

      price: req.body.price,

      stock: req.body.stock,

      food_type: req.body.food_type,

      image: req.file ? req.file.filename : product.image,
    });

    return res.success(HttpStatus.OK, true, ResponseMessages.UPDATE, product);
  } catch (error) {
    return res.error(HttpStatus.INTERNAL_SERVER_ERROR, false, error.message);
  }
};

// DELETE PRODUCT
productController.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.error(HttpStatus.NOT_FOUND, false, "Product not found");
    }

    await product.destroy();

    return res.success(HttpStatus.OK, true, "Product Deleted Successfully");
  } catch (error) {
    return res.error(HttpStatus.INTERNAL_SERVER_ERROR, false, error.message);
  }
};

module.exports = productController;
