const router = require("express").Router();

const vendorController = require("../controllers/vendor.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const upload = require("../middlewares/upload.middleware");

// CREATE PROFILE
router.post(
  "/create-profile",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["vendor"]),
  upload.single("logo"),
  vendorController.createVendorProfile,
);

// GET PROFILE
router.get(
  "/profile",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["vendor"]),
  vendorController.getVendorProfile,
);

// UPDATE PROFILE
router.put(
  "/update-profile",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["vendor"]),
  upload.single("logo"),
  vendorController.updateVendorProfile,
);

// DASHBOARD
router.get(
  "/dashboard",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["vendor"]),
  vendorController.dashboard,
);

// MY PRODUCTS
router.get(
  "/my-products",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["vendor"]),
  vendorController.myProducts,
);

// GET MY PRODUCT BY ID
router.get(
  "/my-products/:id",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["vendor"]),
  vendorController.getMyProductById,
);

// GET VENDOR ORDERS
router.get(
  "/orders",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["vendor"]),
  vendorController.getVendorOrders,
);

// UPDATE ORDER STATUS
router.put(
  "/order-status/:id",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["vendor"]),
  vendorController.updateOrderStatus,
);

// ORDER DETAILS
router.get(
  "/order/:id",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["vendor"]),
  vendorController.orderDetails,
);

module.exports = router;
