// favouritesView.js - Render the favourites section
const renderFavouritesSection = (favourites) => {
  // Remove any existing favourites sections
  document.querySelectorAll('section.favourites-view').forEach(el => el.remove())
  
  // Create new favourites section
  const section = document.createElement('section')
  section.className = 'favourites-view active'
  
  if (favourites.players.length === 0) {
    section.innerHTML = '<div class="empty-favourites"><h2>No favourite players yet</h2><p>Add players to your favourites by clicking the heart icon on any player card.</p></div>'
  } else {
    const heading = document.createElement('h2')
    heading.textContent = 'Your Favourite Players'
    section.appendChild(heading)
    
    favourites.players.forEach(item => {
      const player = item.player
      
      const card = document.createElement('div')
      card.className = 'player-card'
      card.setAttribute('data-player-id', player.id)
      
      card.innerHTML = `
        <button class="favorite" data-player-id="${player.id}" data-player-data='${JSON.stringify(player)}'>
          <img src="heart-fill.svg" class="heart" alt="Favorite" />
        </button>
        <img src="${player.photo}" alt="${player.name}">
        <h4>${player.name}</h4>
        <p>${player.birth?.date || 'N/A'} | ${player.nationality || 'N/A'}</p>
        <p>${player.weight || 'N/A'} | ${player.height || 'N/A'}</p>
        <p>Position: ${player.position || 'Unknown'}</p>

        <div class="stats">
          <div class="stat"><span class="label">GOL</span><span class="value">${player.stats?.goals || 0}</span></div>
          <div class="stat"><span class="label">SHO</span><span class="value">${player.stats?.shots || 0}</span></div>
          <div class="stat"><span class="label">PAS</span><span class="value">${player.stats?.passes || 0}</span></div>
          <div class="stat"><span class="label">DRI</span><span class="value">${player.stats?.attempts || 0}</span></div>
          <div class="stat"><span class="label">TAC</span><span class="value">${player.stats?.tackles || 0}</span></div>
          <div class="stat"><span class="label">FOL</span><span class="value">${player.stats?.fouls || 0}</span></div>
        </div>
      `
      
      section.appendChild(card)
    })
  }
  
  document.body.appendChild(section)
}

export { renderFavouritesSection }