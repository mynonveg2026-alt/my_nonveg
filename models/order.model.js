module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("orders", {
    user_id: {
      type: DataTypes.INTEGER,
    },

    vendor_id: {
      type: DataTypes.INTEGER,
    },

    total_amount: {
      type: DataTypes.FLOAT,
    },

    address: {
      type: DataTypes.TEXT,
    },

    payment_method: {
      type: DataTypes.ENUM("cod", "online"),
      defaultValue: "cod",
    },

    payment_status: {
      type: DataTypes.ENUM("pending", "paid"),
      defaultValue: "pending",
    },
    transaction_id: {
      type: DataTypes.STRING,
    },

    payment_status: {
      type: DataTypes.ENUM("pending", "paid", "failed"),
      defaultValue: "paid",
    },

    order_status: {
      type: DataTypes.ENUM(
        "placed",
        "accepted",
        "processing",
        "delivered",
        "cancelled",
      ),
      defaultValue: "placed",
    },
  });

  return Order;
};
