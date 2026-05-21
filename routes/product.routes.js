const router = require("express").Router();

const productController = require("../controllers/product.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const upload = require("../middlewares/upload.middleware");

// CATEGORY
router.post(
  "/category",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["admin"]),
  upload.single("image"),
  productController.createCategory,
);

router.get("/categories", productController.getCategories);

// PRODUCT
router.post(
  "/create",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["admin", "vendor"]),
  upload.single("image"),
  productController.createProduct,
);

router.get("/all", productController.getProducts);

router.get("/single/:id", productController.getSingleProduct);

router.put(
  "/update/:id",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["admin", "vendor"]),
  upload.single("image"),
  productController.updateProduct,
);

router.delete(
  "/delete/:id",
  authMiddleware.checkUserAuth,
  authMiddleware.checkRole(["admin"]),
  productController.deleteProduct,
);

module.exports = router;
