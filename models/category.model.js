module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("categories", {
    name: {
      type: DataTypes.STRING,
    },

    image: {
      type: DataTypes.STRING,
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  });

  return Category;
};
