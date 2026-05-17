import {Game, Round} from '../models/index.js'

export const gameService = {
  create: (player1_id, player2_id) =>
    Game.create({ player1_id, player2_id }),

  finish: (gameId, winnerId) =>
    Game.update(
      { winner_id: winnerId, status: 'finished', finished_at: new Date() },
      { where: { id: gameId } }
    ),

  saveRound: (game_id, round_number, winner_user_id) =>
    Round.create({ game_id, round_number, winner_user_id }),

  getHistory: (userId) =>
    Game.findAll({
      where: { status: 'finished' },
      order: [['started_at', 'DESC']],
      limit: 20,
    }),
}