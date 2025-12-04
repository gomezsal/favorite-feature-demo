// players.js - Render player cards
import { isFavourite } from './favourites.js'

const renderPlayerList = (players, teamName) => {
  const section = document.querySelector(`section.${teamName}`)
  section.innerHTML = ""

  players.forEach((data) => {
    const { player, statistics } = data

    // Extract stats from the first statistics object
    const stats = statistics[0] || {}
    const goals = stats.goals?.total || 0
    const shots = stats.shots?.total || 0
    const passes = stats.passes?.total || 0
    const attempts = stats.dribbles?.attempts || 0
    const tackles = stats.tackles?.total || 0
    const fouls = stats.fouls?.committed || 0

    // Create player data object for favorites
    const playerData = {
      id: player.id,
      name: player.name,
      photo: player.photo,
      birth: player.birth,
      nationality: player.nationality,
      weight: player.weight,
      height: player.height,
      position: stats.games?.position || "Unknown",
      stats: {
        goals,
        shots,
        passes,
        attempts,
        tackles,
        fouls
      }
    }

    const heartIcon = isFavourite(player.id) ? 'heart-fill.svg' : 'heart-outline.svg'

    const card = document.createElement("div")
    card.className = "player-card"
    card.setAttribute('data-player-id', player.id)

    card.innerHTML = `
      <button class="favorite" data-player-id="${player.id}" data-player-data='${JSON.stringify(playerData)}'>
        <img src="${heartIcon}" class="heart" alt="Favorite" />
      </button>
      <img src="${player.photo}" alt="${player.name}">
      <h4>${player.name}</h4>
      <p>${player.birth.date} | ${player.nationality}</p>
      <p>${player.weight} | ${player.height}</p>
      <p>Position: ${stats.games?.position || "Unknown"}</p>

      <div class="stats">
        <div class="stat"><span class="label">GOL</span><span class="value">${goals}</span></div>
        <div class="stat"><span class="label">SHO</span><span class="value">${shots}</span></div>
        <div class="stat"><span class="label">PAS</span><span class="value">${passes}</span></div>
        <div class="stat"><span class="label">DRI</span><span class="value">${attempts}</span></div>
        <div class="stat"><span class="label">TAC</span><span class="value">${tackles}</span></div>
        <div class="stat"><span class="label">FOL</span><span class="value">${fouls}</span></div>
      </div>
    `

    section.appendChild(card)
  })
}

export { renderPlayerList }