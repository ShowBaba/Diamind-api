module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Entries', 'date', {
      type: Sequelize.DATEONLY,
      defaultValue: Sequelize.NOW,
    }),
  ]),

  down: async (queryInterface) => Promise.all([
    queryInterface.removeColumn('Entries', 'date')
  ])

};
