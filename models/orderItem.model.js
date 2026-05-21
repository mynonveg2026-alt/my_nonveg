module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define("order_items", {
    order_id: {
      type: DataTypes.INTEGER,
    },

    product_id: {
      type: DataTypes.INTEGER,
    },

    quantity: {
      type: DataTypes.INTEGER,
    },

    price: {
      type: DataTypes.FLOAT,
    },
  });

  return OrderItem;
};
