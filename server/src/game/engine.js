const ADVANTAGE = {
  fire: 'snow',
  snow: 'water',
  water: 'fire',
}

export function resolveRound(cardA, cardB) {
  if (cardA.element === cardB.element) {
    if (cardA.power > cardB.power) return { winner: 'A', reason: 'higher_power' }
    if (cardB.power > cardA.power) return { winner: 'B', reason: 'higher_power' }
    return { winner: 'tie', reason: 'tie' }
  }

  if (ADVANTAGE[cardA.element] === cardB.element) {
    return { winner: 'A', reason: 'element_advantage' }
  }
  return { winner: 'B', reason: 'element_advantage' }
}

export function checkVictory(wonCards) {
  const elements = new Set(wonCards.map(c => c.element))
  const colors = new Set(wonCards.map(c => c.color))
  return (
    elements.has('fire') &&
    elements.has('water') &&
    elements.has('snow') &&
    colors.size >= 3
  )
}