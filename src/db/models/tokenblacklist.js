const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class tokenBlacklist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  tokenBlacklist.init({
    token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tokenBlacklist',
  });
  return tokenBlacklist;
};
