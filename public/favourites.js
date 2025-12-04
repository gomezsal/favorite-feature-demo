// favourites.js
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
        console.error('Failed to fetch collection:', err)
        return favourites
    }
}

// Shared toggle functionality for adding/removing players from collection
const toggleFavorite = async (playerId, playerData) => {
    try {
        // Find all hearts for this player
        let hearts = document.querySelectorAll(`.favorite[data-player-id="${playerId}"] .heart`)

        // Add loading spinner animation to hearts
        hearts.forEach(heart => heart.classList.add('loading'))

        // Send player data (id and complete player info)
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
            document.querySelector(`#favourites-container .player-card-${playerId}`)?.remove()
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
        hearts.forEach(heart => heart.classList.remove('loading'))
        throw err
    }
}

const isFavourite = (playerId) => {
    return favourites.players.some(item => item.player.id === playerId)
}

export { toggleFavorite, getFavourites, isFavourite, favourites }