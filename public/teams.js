// teams.js - Handle team listings and player loading
import { renderPlayerList } from './players.js'

const sanitizeClassName = (name) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
}

const createTeamListings = (leagueTeams, API_KEY, API_URL, SEASON) => {
  const main = document.querySelector("main")
  main.innerHTML = ""

  leagueTeams.forEach((team) => {
    const teamClassName = sanitizeClassName(team.team.name)

    // Create team card
    const teamCard = document.createElement("div")
    teamCard.className = `team-card ${teamClassName}`

    const teamName = document.createElement("h2")
    teamName.textContent = team.team.name

    const logo = document.createElement("img")
    logo.src = team.team.logo
    logo.alt = `${team.team.name} Logo`

    const venue = document.createElement("p")
    venue.className = "venue"
    venue.textContent = `Stadium: ${team.venue.name}, ${team.venue.city}`

    const loadPlayersBtn = document.createElement("button")
    loadPlayersBtn.className = "load-players-btn"
    loadPlayersBtn.textContent = "LOAD PLAYERS"

    teamCard.appendChild(teamName)
    teamCard.appendChild(logo)
    teamCard.appendChild(venue)
    teamCard.appendChild(loadPlayersBtn)

    // Create the hidden section for players
    const section = document.createElement("section")
    section.className = teamClassName

    // Click handler for the button
    loadPlayersBtn.addEventListener("click", async () => {
      const isActive = section.classList.contains("active")

      // Remove active class from all sections
      document.querySelectorAll("section").forEach((sec) => {
        sec.classList.remove("active")
      })

      // If this section wasn't active, make it active and load players
      if (!isActive) {
        section.classList.add("active")

        // Load players if not already loaded
        if (section.children.length === 0) {
          await loadPlayers(team.team.id, teamClassName, API_KEY, API_URL, SEASON)
        }
      }
    })

    main.appendChild(teamCard)
    main.appendChild(section)
  })
}

const loadPlayers = async (teamId, teamClassName, API_KEY, API_URL, SEASON) => {
  const section = document.querySelector(`section.${teamClassName}`)
  
  section.innerHTML = '<div class="loading">Loading Players</div>'

  try {
    const response = await fetch(
      `${API_URL}/players?team=${teamId}&season=${SEASON}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": API_KEY,
          "x-rapidapi-host": "v3.football.api-sports.io",
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()
    console.log("Players data:", data)

    if (data.response && data.response.length > 0) {
      renderPlayerList(data.response, teamClassName)
    } else {
      section.innerHTML = '<p style="color: red; text-align: center;">No players found</p>'
    }
  } catch (error) {
    console.error("Error fetching players:", error)
    section.innerHTML = `<p style="color: red; text-align: center;">Error: ${error.message}</p>`
  }
}

export { createTeamListings }