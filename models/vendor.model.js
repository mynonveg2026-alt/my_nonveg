module.exports = (sequelize, DataTypes) => {
  const Vendor = sequelize.define("vendors", {
    user_id: {
      type: DataTypes.INTEGER,
    },

    business_name: {
      type: DataTypes.STRING,
    },

    business_email: {
      type: DataTypes.STRING,
    },

    business_phone: {
      type: DataTypes.STRING,
    },

    address: {
      type: DataTypes.TEXT,
    },

    logo: {
      type: DataTypes.STRING,
    },

    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
  });

  return Vendor;
};
