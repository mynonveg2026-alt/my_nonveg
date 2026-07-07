const sequelize = require("../config/db");

const { DataTypes } = require("sequelize");

const db = {};

// INIT MODELS
db.User = require("./user.model")(sequelize, DataTypes);

db.Vendor = require("./vendor.model")(sequelize, DataTypes);

db.Category = require("./category.model")(sequelize, DataTypes);

db.Product = require("./product.model")(sequelize, DataTypes);

db.Cart = require("./cart.model")(sequelize, DataTypes);

db.Order = require("./order.model")(sequelize, DataTypes);

db.OrderItem = require("./orderItem.model")(sequelize, DataTypes);

/* =========================
   USER -> VENDOR
========================= */

db.User.hasOne(db.Vendor, {
  foreignKey: "user_id",
  as: "vendor",
});

db.Vendor.belongsTo(db.User, {
  foreignKey: "user_id",
  as: "user",
});

/* =========================
   CATEGORY -> PRODUCT
========================= */

db.Category.hasMany(db.Product, {
  foreignKey: "category_id",
  as: "products",
});

db.Product.belongsTo(db.Category, {
  foreignKey: "category_id",
  as: "category",
});

/* =========================
   VENDOR -> PRODUCT
========================= */

db.Vendor.hasMany(db.Product, {
  foreignKey: "vendor_id",
  as: "products",
});

db.Product.belongsTo(db.Vendor, {
  foreignKey: "vendor_id",
  as: "vendor",
});

/* =========================
   USER -> CART
========================= */

db.User.hasMany(db.Cart, {
  foreignKey: "user_id",
  as: "carts",
});

db.Cart.belongsTo(db.User, {
  foreignKey: "user_id",
  as: "user",
});

/* =========================
   PRODUCT -> CART
========================= */

db.Product.hasMany(db.Cart, {
  foreignKey: "product_id",
  as: "carts",
});

db.Cart.belongsTo(db.Product, {
  foreignKey: "product_id",
  as: "product",
});

/* =========================
   USER -> ORDER
========================= */

db.User.hasMany(db.Order, {
  foreignKey: "user_id",
  as: "orders",
});

db.Order.belongsTo(db.User, {
  foreignKey: "user_id",
  as: "user",
});

/* =========================
   ORDER -> ORDER ITEMS
========================= */

db.Order.hasMany(db.OrderItem, {
  foreignKey: "order_id",
  as: "orderItems",
});

db.OrderItem.belongsTo(db.Order, {
  foreignKey: "order_id",
  as: "order",
});

/* =========================
   PRODUCT -> ORDER ITEM
========================= */

db.Product.hasMany(db.OrderItem, {
  foreignKey: "product_id",
  as: "orderItems",
});

db.OrderItem.belongsTo(db.Product, {
  foreignKey: "product_id",
  as: "product",
});

// EXPORT
db.sequelize = sequelize;

module.exports = db;
