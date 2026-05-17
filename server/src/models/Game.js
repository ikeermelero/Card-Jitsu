import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Game = sequelize.define('Game', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  player1_id: { type: DataTypes.UUID, allowNull: false },
  player2_id: { type: DataTypes.UUID, allowNull: false },
  winner_id: { type: DataTypes.UUID },
  status: { type: DataTypes.STRING(20), defaultValue: 'playing' },
  started_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  finished_at: { type: DataTypes.DATE },
}, {
  tableName: 'games',
  timestamps: false,
})

export default Game