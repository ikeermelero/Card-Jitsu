import User from './User.js'
import Card from './Card.js'
import Game from './Game.js'
import Round from './Round.js'

// Game → User (jugadores)
Game.belongsTo(User, { as: 'player1', foreignKey: 'player1_id' })
Game.belongsTo(User, { as: 'player2', foreignKey: 'player2_id' })
Game.belongsTo(User, { as: 'winner', foreignKey: 'winner_id' })

// Round → Game
Round.belongsTo(Game, { foreignKey: 'game_id' })
Game.hasMany(Round, { foreignKey: 'game_id' })

// Round → User (ganador de ronda)
Round.belongsTo(User, { as: 'roundWinner', foreignKey: 'winner_user_id' })

export { User, Card, Game, Round }