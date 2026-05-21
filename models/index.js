const sequelize = require("../config/db");

const { DataTypes } = require("sequelize");

const db = {};

// initialize models
db.User = require("./user.model")(sequelize, DataTypes);
db.Vendor = require("./vendor.model")(sequelize, DataTypes);
db.Category = require("./category.model")(sequelize, DataTypes);
db.Product = require("./product.model")(sequelize, DataTypes);
db.Cart = require("./cart.model")(sequelize, DataTypes);
db.Order = require("./order.model")(sequelize, DataTypes);
db.OrderItem = require("./orderItem.model")(sequelize, DataTypes);

// define associations
db.User.hasOne(db.Vendor, { foreignKey: "user_id" });
db.Vendor.belongsTo(db.User, { foreignKey: "user_id" });
// CATEGORY -> PRODUCT
db.Category.hasMany(db.Product, { foreignKey: "category_id" });
db.Product.belongsTo(db.Category, { foreignKey: "category_id" });
// VENDOR -> PRODUCT
db.Vendor.hasMany(db.Product, { foreignKey: "vendor_id" });
db.Product.belongsTo(db.Vendor, { foreignKey: "vendor_id" });
// USER -> CART
db.User.hasMany(db.Cart, { foreignKey: "user_id" });
db.Cart.belongsTo(db.User, { foreignKey: "user_id" });
// PRODUCT -> CART
db.Product.hasMany(db.Cart, { foreignKey: "product_id", as: "carts" });
db.Cart.belongsTo(db.Product, { foreignKey: "product_id", as: "product" });
// USER -> ORDER
db.User.hasMany(db.Order, { foreignKey: "user_id" });
db.Order.belongsTo(db.User, { foreignKey: "user_id" });
// ORDER -> ORDER ITEMS
db.Order.hasMany(db.OrderItem, { foreignKey: "order_id" });
db.OrderItem.belongsTo(db.Order, { foreignKey: "order_id" });
// PRODUCT -> ORDER ITEM
db.Product.hasMany(db.OrderItem, { foreignKey: "product_id" });
db.OrderItem.belongsTo(db.Product, { foreignKey: "product_id" });

// export sequelize
db.sequelize = sequelize;

module.exports = db;
