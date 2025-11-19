const { DataTypes } = require('sequelize')

const currentYear = new Date().getFullYear()

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
      min: { args: 1991, msg: 'year must be at least 1991' },
      max: { args: currentYear, msg: `year must be at most ${currentYear}`}
    }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year')
  },
}