import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Round = sequelize.define('Round', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  game_id: { type: DataTypes.UUID, allowNull: false },
  round_number: { type: DataTypes.INTEGER, allowNull: false },
  winner_user_id: { type: DataTypes.UUID },
}, {
  tableName: 'rounds',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})

export default Round