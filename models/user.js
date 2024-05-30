'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.video, { through: models.videolike, foreignKey: "userId" });
      User.hasMany(models.comment, {
        foreignKey: "userId",
      });
      User.hasMany(models.subscription, {
        foreignKey: "subscribeTo",
      });
      User.belongsToMany(models.video, { through: models.view, foreignKey: "userId" });
    }
  }
  User.init({
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 6,
      },
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue:
        "https://res.cloudinary.com/tylerdurden/image/upload/v1602657481/random/pngfind.com-default-image-png-6764065_krremh.png",
    },
    cover: {
      type: DataTypes.STRING,
      defaultValue:
        "https://res.cloudinary.com/tylerdurden/image/upload/v1617334073/random/Rectangle_2_mbyujf.png",
    },
    channelDescription: {
      type: DataTypes.STRING,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};