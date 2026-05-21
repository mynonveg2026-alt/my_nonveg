module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("products", {
    vendor_id: {
      type: DataTypes.INTEGER,
    },

    category_id: {
      type: DataTypes.INTEGER,
    },

    name: {
      type: DataTypes.STRING,
    },

    description: {
      type: DataTypes.TEXT,
    },

    price: {
      type: DataTypes.FLOAT,
    },

    stock: {
      type: DataTypes.INTEGER,
    },

    image: {
      type: DataTypes.STRING,
    },

    food_type: {
      type: DataTypes.ENUM("veg", "nonveg"),
      defaultValue: "nonveg",
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  });

  return Product;
};
