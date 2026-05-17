import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  username: { type: DataTypes.STRING(30), allowNull: false, unique: true },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  password_hash: { type: DataTypes.TEXT, allowNull: false },
  elo: { type: DataTypes.INTEGER, defaultValue: 1000 },
  wins: { type: DataTypes.INTEGER, defaultValue: 0 },
  losses: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'users',
  timestamps: false,
})

export default User