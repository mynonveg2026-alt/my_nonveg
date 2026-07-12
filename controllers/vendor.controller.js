const db = require("../models");

const Vendor = db.Vendor;
const Product = db.Product;
const User = db.User;
const Order = db.Order;
const OrderItem = db.OrderItem;

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
          as: "user",
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

// GET MY PRODUCT BY ID
vendorController.getMyProductById = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    if (!vendor) {
      return res.error(HttpStatus.NOT_FOUND, false, "Vendor profile not found");
    }

    const product = await Product.findOne({
      where: {
        id: req.params.id,
        vendor_id: vendor.id,
      },
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

// GET VENDOR ORDERS
vendorController.getVendorOrders = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    if (!vendor) {
      return res.error(404, false, "Vendor profile not found");
    }

    const orders = await Order.findAll({
      where: {
        vendor_id: vendor.id,
      },

      include: [
        {
          model: User,
          as: "user",

          attributes: ["id", "name", "email", "phone"],
        },

        {
          model: OrderItem,
          as: "orderItems",

          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],

      order: [["id", "DESC"]],
    });

    return res.success(200, true, "Vendor Orders Retrieved", orders);
  } catch (error) {
    console.log(error);

    return res.error(500, false, error.message);
  }
};

// UPDATE ORDER STATUS
vendorController.updateOrderStatus = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    if (!vendor) {
      return res.error(404, false, "Vendor profile not found");
    }

    const order = await Order.findOne({
      where: {
        id: req.params.id,
        vendor_id: vendor.id,
      },
    });

    if (!order) {
      return res.error(404, false, "Order not found");
    }

    order.order_status = req.body.order_status;

    await order.save();

    return res.success(200, true, "Order Status Updated", order);
  } catch (error) {
    console.log(error);

    return res.error(500, false, error.message);
  }
};

// SINGLE ORDER DETAILS
vendorController.orderDetails = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    if (!vendor) {
      return res.error(404, false, "Vendor profile not found");
    }

    const order = await Order.findOne({
      where: {
        id: req.params.id,
        vendor_id: vendor.id,
      },

      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"],
        },

        {
          model: OrderItem,
          as: "orderItems",

          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.error(404, false, "Order not found");
    }

    return res.success(200, true, "Order Details Retrieved", order);
  } catch (error) {
    return res.error(500, false, error.message);
  }
};

module.exports = vendorController;
