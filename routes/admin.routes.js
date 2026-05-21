const router = require("express").Router();

const adminController = require("../controllers/admin.controller");

const authMiddleware = require("../middlewares/auth.middleware");

// DASHBOARD
router.get(
  "/dashboard",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["admin"]),
  adminController.dashboard,
);

// ALL USERS
router.get(
  "/users",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["admin"]),
  adminController.getAllUsers,
);

// ALL VENDORS
router.get(
  "/vendors",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["admin"]),
  adminController.getAllVendors,
);

// APPROVE / REJECT VENDOR
router.put(
  "/vendor-status/:id",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["admin"]),
  adminController.updateVendorStatus,
);

module.exports = router;
