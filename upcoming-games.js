// upcoming-games.js

// Function to fetch and display upcoming games
async function fetchUpcomingGames() {
    try {
        currentDate = Math.floor(Date.now() / 1000);
        const resp = await fetch(
          "https://cors-proxy.austen-edge.workers.dev/corsproxy/?apiurl=https://api.igdb.com/v4/games",
          {
            method: "POST",
            headers: {
              "x-api-key": "x3x8c7heF6FMCpuNxAon",
            },
            body: "fields cover.url,name,total_rating; where release_dates.date > " + currentDate + "; sort date asc; limit 20;",
    
            // body: "fields where game.platforms = 48 & release_dates.date > currentDate; sort date asc;"
          }
        );
        
        if (resp.status !== 200) {
          throw new Error(`HTTP error! status: ${resp.status}`);
        }

        const upcomingGamesContainer = document.getElementById("upcoming-games-container");

        data?.forEach((game) => {
          // Your logic to create game cards (similar to what you did in index.js)
          // ...
    
          // Append the created game card to the upcoming-games-container
          upcomingGamesContainer.appendChild(gameCard);
        });

        
    } catch (error) {
        console.error(error);
      }
    }
    
  // Call the function to fetch and display upcoming games when the page loads
  fetchUpcomingGames();
  