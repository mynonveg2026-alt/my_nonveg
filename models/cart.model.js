module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("carts", {
    user_id: {
      type: DataTypes.INTEGER,
    },

    product_id: {
      type: DataTypes.INTEGER,
    },

    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  });

  return Cart;
};
