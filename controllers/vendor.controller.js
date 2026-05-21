const db = require("../models");

const Vendor = db.Vendor;
const Product = db.Product;
const User = db.User;

const HttpStatus = require("../enums/httpStatusCode.enum");

const ResponseMessages = require("../enums/responseMessages.enum");

const vendorController = {};

// CREATE VENDOR PROFILE
vendorController.createVendorProfile = async (req, res) => {
  try {
    // check existing vendor
    const existingVendor = await Vendor.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    if (existingVendor) {
      return res.error(
        HttpStatus.BAD_REQUEST,
        false,
        "Vendor profile already exists",
      );
    }

    const vendor = await Vendor.create({
      user_id: req.user.id,

      business_name: req.body.business_name,

      business_email: req.body.business_email,

      business_phone: req.body.business_phone,

      address: req.body.address,

      logo: req.file ? req.file.filename : null,
    });

    return res.success(HttpStatus.CREATED, true, ResponseMessages.SAVE, vendor);
  } catch (error) {
    console.log(error);

    return res.error(HttpStatus.INTERNAL_SERVER_ERROR, false, error.message);
  }
};

// GET VENDOR PROFILE
vendorController.getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      where: {
        user_id: req.user.id,
      },

      include: [
        {
          model: User,
          attributes: {
            exclude: ["password"],
          },
        },
      ],
    });

    if (!vendor) {
      return res.error(HttpStatus.NOT_FOUND, false, "Vendor profile not found");
    }

    return res.success(
      HttpStatus.OK,
      true,
      ResponseMessages.DATA_RETRIEVED_SUCCESSFULLY,
      vendor,
    );
  } catch (error) {
    return res.error(HttpStatus.INTERNAL_SERVER_ERROR, false, error.message);
  }
};

// UPDATE VENDOR PROFILE
vendorController.updateVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    if (!vendor) {
      return res.error(HttpStatus.NOT_FOUND, false, "Vendor profile not found");
    }

    await vendor.update({
      business_name: req.body.business_name,

      business_email: req.body.business_email,

      business_phone: req.body.business_phone,

      address: req.body.address,

      logo: req.file ? req.file.filename : vendor.logo,
    });

    return res.success(HttpStatus.OK, true, ResponseMessages.UPDATE, vendor);
  } catch (error) {
    return res.error(HttpStatus.INTERNAL_SERVER_ERROR, false, error.message);
  }
};

// VENDOR DASHBOARD
vendorController.dashboard = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    if (!vendor) {
      return res.error(HttpStatus.NOT_FOUND, false, "Vendor profile not found");
    }

    const totalProducts = await Product.count({
      where: {
        vendor_id: vendor.id,
      },
    });

    return res.success(HttpStatus.OK, true, "Dashboard Retrieved", {
      totalProducts,
    });
  } catch (error) {
    return res.error(HttpStatus.INTERNAL_SERVER_ERROR, false, error.message);
  }
};

// VENDOR OWN PRODUCTS
vendorController.myProducts = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    if (!vendor) {
      return res.error(HttpStatus.NOT_FOUND, false, "Vendor profile not found");
    }

    const products = await Product.findAll({
      where: {
        vendor_id: vendor.id,
      },

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

module.exports = vendorController;
