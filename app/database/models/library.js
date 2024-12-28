'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Library extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Library.init({
    name: DataTypes.STRING,
    author: DataTypes.STRING,
    date: DataTypes.STRING,
    inLibrary: DataTypes.STRING,
    reader: DataTypes.STRING,
    returnDate: DataTypes.STRING,
    cover: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Library',
  });
  return Library;
};