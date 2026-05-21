module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    name: {
      type: DataTypes.STRING,
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
    },

    phone: {
      type: DataTypes.STRING,
    },

    password: {
      type: DataTypes.STRING,
    },

    role: {
      type: DataTypes.ENUM("admin", "vendor", "user"),
      defaultValue: "user",
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  });

  return User;
};
