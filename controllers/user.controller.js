const db = require("../models");

const Cart = db.Cart;
const Product = db.Product;
const Order = db.Order;
const OrderItem = db.OrderItem;
const Vendor = db.Vendor;

const HttpStatus = require("../enums/httpStatusCode.enum");

const ResponseMessages = require("../enums/responseMessages.enum");

const userController = {};

// ADD TO CART
userController.addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.error(HttpStatus.NOT_FOUND, false, "Product not found");
    }

    const existingCart = await Cart.findOne({
      where: {
        user_id: req.user.id,
        product_id,
      },
    });

    if (existingCart) {
      existingCart.quantity += Number(quantity);

      await existingCart.save();

      return res.success(HttpStatus.OK, true, "Cart Updated", existingCart);
    }

    const cart = await Cart.create({
      user_id: req.user.id,

      product_id,

      quantity,
    });

    return res.success(HttpStatus.CREATED, true, ResponseMessages.SAVE, cart);
  } catch (error) {
    return res.error(HttpStatus.INTERNAL_SERVER_ERROR, false, error.message);
  }
};

// GET CART
userController.getCart = async (req, res) => {
  try {
    const cart = await Cart.findAll({
      where: {
        user_id: req.user.id,
      },

      include: [
        {
          model: Product,
        },
      ],
    });

    return res.success(
      HttpStatus.OK,
      true,
      ResponseMessages.DATA_RETRIEVED_SUCCESSFULLY,
      cart,
    );
  } catch (error) {
    return res.error(HttpStatus.INTERNAL_SERVER_ERROR, false, error.message);
  }
};

// UPDATE CART
userController.updateCart = async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.id);

    if (!cart) {
      return res.error(HttpStatus.NOT_FOUND, false, "Cart not found");
    }

    cart.quantity = req.body.quantity;

    await cart.save();

    return res.success(HttpStatus.OK, true, ResponseMessages.UPDATE, cart);
  } catch (error) {
    return res.error(HttpStatus.INTERNAL_SERVER_ERROR, false, error.message);
  }
};

// REMOVE CART ITEM
userController.removeCart = async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.id);

    if (!cart) {
      return res.error(HttpStatus.NOT_FOUND, false, "Cart not found");
    }

    await cart.destroy();

    return res.success(HttpStatus.OK, true, "Cart Item Removed");
  } catch (error) {
    return res.error(HttpStatus.INTERNAL_SERVER_ERROR, false, error.message);
  }
};

// PLACE ORDER
userController.placeOrder = async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: {
        user_id: req.user.id,
      },

      include: [
        {
          model: Product,
          as: "product",
        },
      ],
    });

    if (cartItems.length === 0) {
      return res.error(HttpStatus.BAD_REQUEST, false, "Cart is empty");
    }

    let total = 0;

    cartItems.forEach((item) => {
      total += item.quantity * item.product.price;
    });

    const vendor_id = cartItems[0].product.vendor_id;

    const order = await Order.create({
      user_id: req.user.id,

      vendor_id,

      total_amount: total,

      address: req.body.address,

      payment_method: req.body.payment_method,

      payment_status: "paid",

      transaction_id: req.body.transaction_id,
    });

    for (const item of cartItems) {
      await OrderItem.create({
        order_id: order.id,

        product_id: item.product_id,

        quantity: item.quantity,

        price: item.product.price,
      });
    }

    // clear cart
    await Cart.destroy({
      where: {
        user_id: req.user.id,
      },
    });

    return res.success(
      HttpStatus.CREATED,
      true,
      "Order Placed Successfully",
      order,
    );
  } catch (error) {
    console.log(error);

    return res.error(HttpStatus.INTERNAL_SERVER_ERROR, false, error.message);
  }
};

// MY ORDERS
userController.myOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: {
        user_id: req.user.id,
      },

      include: [
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

    return res.success(
      HttpStatus.OK,
      true,
      ResponseMessages.DATA_RETRIEVED_SUCCESSFULLY,
      orders,
    );
  } catch (error) {
    return res.error(HttpStatus.INTERNAL_SERVER_ERROR, false, error.message);
  }
};

module.exports = userController;
