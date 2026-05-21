const router = require("express").Router();

const authController = require("../controllers/auth.controller");

const authMiddleware = require("../middlewares/auth.middleware");

// register
router.post("/register", authController.register);

// login
router.post("/login", authController.login);

// get user profile
router.get("/profile", authMiddleware.checkUserAuth, authController.getProfile);

module.exports = router;
