import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Card = sequelize.define('Card', {
  id: { type: DataTypes.STRING(10), primaryKey: true },
  name: { type: DataTypes.STRING(50), allowNull: false },
  element: { type: DataTypes.STRING(10), allowNull: false },
  power: { type: DataTypes.INTEGER, allowNull: false },
  color: { type: DataTypes.STRING(20), allowNull: false },
  image_url: { type: DataTypes.TEXT },
}, {
  tableName: 'cards',
  timestamps: false,
})

export default Card