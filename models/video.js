'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      video.belongsTo(models.User, { foreignKey: "userId" });
      video.belongsToMany(models.User, { through: models.videolike, foreignKey: "videoId" });
      video.hasMany(models.comment, {
        foreignKey: "videoId",
      });
      video.belongsToMany(models.User, { through: models.view, foreignKey: "videoId" });
    }  
  }
  video.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'video',
  });
  return video;
};