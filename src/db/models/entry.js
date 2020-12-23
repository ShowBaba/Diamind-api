const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Entry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // One entry belongs to one user as user with foreignkey userId
      Entry.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId',
      });
    }
  }
  Entry.init({
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: sequelize.fn('NOW')
    }
  }, {
    sequelize,
    modelName: 'Entry',
  });
  return Entry;
};
