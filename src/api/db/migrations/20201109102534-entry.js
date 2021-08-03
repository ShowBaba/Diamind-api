module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn('Entries', 'date', {
      type: Sequelize.DATEONLY,
      defaultValue: Sequelize.DATEONLY,
    }),
  ]),

  down: (queryInterface) => Promise.all([queryInterface.changeColumn('Entries', 'date')]),
};
