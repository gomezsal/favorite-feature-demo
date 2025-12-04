// Main JavaScript file for Football API app
import { createTeamListings } from './teams.js'
import { getFavourites, toggleFavorite } from './favourites.js'
import { renderFavouritesSection } from './favouritesView.js'

const API_KEY = "31606b7e376d0096a6231cf7c818f1e4"
const API_URL = "https://v3.football.api-sports.io"
const SEASON = "2023"

// Handle favorite button clicks globally
document.addEventListener('click', async (e) => {
  const favoriteBtn = e.target.closest('.favorite')
  if (favoriteBtn) {
    const playerId = favoriteBtn.dataset.playerId
    const playerData = JSON.parse(favoriteBtn.dataset.playerData)
    await toggleFavorite(playerId, playerData)
  }
})

// Fetch favourites from our API on load
const favourites = await getFavourites()
console.log('Favourites', favourites)

// Navigation handling
const navButtons = document.querySelectorAll('.nav-btn')
navButtons.forEach(button => {
  button.addEventListener('click', async () => {
    const section = button.dataset.section
    
    // Update active button
    navButtons.forEach(btn => btn.classList.remove('active'))
    button.classList.add('active')
    
    // Show/hide sections
    if (section === 'home') {
      document.querySelector('.controls').style.display = 'flex'
      document.querySelector('main').style.display = 'block'
      document.querySelectorAll('section.favourites-view').forEach(el => el.remove())
    } else if (section === 'favourites') {
      document.querySelector('.controls').style.display = 'none'
      document.querySelector('main').style.display = 'none'
      const updatedFavourites = await getFavourites()
      renderFavouritesSection(updatedFavourites)
    }
  })
})

// Fetching league teams
const fetchTeams = async (leagueId) => {
  const loading = document.getElementById("loading")
  const main = document.querySelector("main")
  
  loading.style.display = "block"
  main.innerHTML = ""

  try {
    const response = await fetch(`${API_URL}/teams?league=${leagueId}&season=${SEASON}`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": "v3.football.api-sports.io",
      },
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()
    console.log("Teams data:", data)

    if (data.response && data.response.length > 0) {
      createTeamListings(data.response, API_KEY, API_URL, SEASON)
    } else {
      main.innerHTML = '<div class="error">No teams were found</div>'
    }
  } catch (error) {
    console.error("Error fetching teams:", error)
    main.innerHTML = `<div class="error">Error loading teams: ${error.message}</div>`
  } finally {
    loading.style.display = "none"
  }
}

// Event Listener for loading teams
document.getElementById("loadTeamsBtn").addEventListener("click", () => {
  const leagueSelect = document.getElementById("leagueSelect")
  const leagueId = leagueSelect.value

  if (!leagueId) {
    alert("Please select a league")
    return
  }

  fetchTeams(leagueId)
})

// Export for use in other modules
export { API_KEY, API_URL, SEASON }