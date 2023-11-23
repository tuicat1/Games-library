document.addEventListener("DOMContentLoaded", function () {
    fetchUpcomingGames(); // Fetch and display upcoming games
  });
  
  async function fetchUpcomingGames() {
    try {
      const currentDate = Math.floor(Date.now() / 1000);
      const resp = await fetch(
        "https://cors-proxy.austen-edge.workers.dev/corsproxy/?apiurl=https://api.igdb.com/v4/games",
        {
          method: "POST",
          headers: {
            "x-api-key": "x3x8c7heF6FMCpuNxAon",
          },
          body: "fields cover.url,name,total_rating; where release_dates.date > " + currentDate + "; sort date asc; limit 20;",
        }
      );
  
      if (resp.status !== 200) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }
  
      const data = await resp.json();
      const upcomingGamesDiv = document.getElementById("upcoming-games-div");
  
      data?.forEach((game) => {
        const gameCard = createGameCard(game);
        if (gameCard) {
          upcomingGamesDiv.appendChild(gameCard);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }