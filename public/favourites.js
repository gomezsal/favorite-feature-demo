// favourites.js - Manage favorite players
let favourites = {
    name: 'favourites',
    players: []
}

// Fetch the latest favourites from the API
const getFavourites = async () => {
    try {
        const response = await fetch('/data')
        const items = await response.json()
        favourites = {
            name: 'favourites',
            players: items.map(item => ({
                player: item.data
            }))
        }
        return favourites
    } catch (err) {
        console.error('Failed to fetch favourites:', err)
        return favourites
    }
}

// Toggle functionality for adding/removing players from favourites
const toggleFavorite = async (playerId, playerData) => {
    try {
        // Find all hearts for this player
        let hearts = document.querySelectorAll(`.favorite[data-player-id="${playerId}"] .heart`)

        // Add loading animation to hearts
        hearts.forEach(heart => heart.classList.add('loading'))

        // Send player data to API
        const response = await fetch('/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: playerId,
                data: playerData
            })
        })
        const result = await response.json()

        // Update favourites state based on action
        if (result.action === 'added') {
            favourites.players.push({
                player: playerData
            })
        } else {
            favourites.players = favourites.players.filter(
                item => item.player.id !== playerId
            )
            // Remove from favourites section if it exists
            document.querySelector(`section.favourites .player-card[data-player-id="${playerId}"]`)?.remove()
        }
        
        // Update UI based on action for all hearts 
        hearts.forEach(heart => {
            heart.src = result.action === 'added' ? 'heart-fill.svg' : 'heart-outline.svg'
            heart.classList.remove('loading')
        })

        return result

    } catch (err) {
        console.error('Failed to toggle favorite:', err)
        // Remove loading state on error
        let hearts = document.querySelectorAll(`.favorite[data-player-id="${playerId}"] .heart`)
        hearts.forEach(heart => heart.classList.remove('loading'))
        throw err
    }
}

const isFavourite = (playerId) => {
    return favourites.players.some(item => item.player.id === playerId)
}

export { toggleFavorite, getFavourites, isFavourite, favourites }