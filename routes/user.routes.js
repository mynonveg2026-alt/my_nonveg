const router = require("express").Router();

const userController = require("../controllers/user.controller");

const authMiddleware = require("../middlewares/auth.middleware");

// ADD TO CART
router.post(
  "/add-cart",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["user"]),
  userController.addToCart,
);

// GET CART
router.get(
  "/cart",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["user"]),
  userController.getCart,
);

// UPDATE CART
router.put(
  "/update-cart/:id",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["user"]),
  userController.updateCart,
);

// REMOVE CART
router.delete(
  "/remove-cart/:id",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["user"]),
  userController.removeCart,
);

// PLACE ORDER
router.post(
  "/place-order",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["user"]),
  userController.placeOrder,
);

// MY ORDERS
router.get(
  "/my-orders",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["user"]),
  userController.myOrders,
);

module.exports = router;
