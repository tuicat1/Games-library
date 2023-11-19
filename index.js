// index.js

function initializeGauge(value, containerId) {
    try {
      var Gauge = window.Gauge;
      var gauge = Gauge(document.getElementById(containerId), {
        max: 100,
        dialStartAngle: -90,
        dialEndAngle: -90.001,
        value: value,
        showValue: true,
        label: function (value) {
          return Math.round((value * 100) / 100);
        },
        color: function (value) {
          if (value < 20) {
            return "#ef4655"; // red
          } else if (value < 40) {
            return "#f7aa38"; // orange
          } else if (value < 60) {
            return "#fffa50"; // yellow
          } else {
            return "#5ee432"; // green
          }
        },
      });
    
      if (!gauge) {
        console.error(`Gauge not initialized for container with ID: ${containerId}`);
      } else {
        gauge.setValue(value);
      }
    } catch (error) {
      console.error(`Error initializing gauge: ${error}`);
    }
  }
  
  async function fetchFeaturedGames() {
    try {
      const resp = await fetch(
        "https://cors-proxy.austen-edge.workers.dev/corsproxy/?apiurl=https://api.igdb.com/v4/games",
        {
          method: "POST",
          headers: {
            "x-api-key": "x3x8c7heF6FMCpuNxAon",
          },
          body: "fields cover.url,name,total_rating; limit 20;",
        }
      );
  
      if (resp.status !== 200) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }
  
      const data = await resp.json();
      const featuredGamesDiv = document.getElementById("featured-games-div");
  
      data?.forEach((game) => {
        if (game.name && game.cover && game.cover.url) {
          const gameCard = document.createElement("div");
          gameCard.classList.add("game-card");
  
          const gameLink = document.createElement("a");
          gameLink.href = `game-description.html?gameName=${encodeURIComponent(
            game.name
          )}`;
          gameCard.appendChild(gameLink);
  
          const coverImageURL = game.cover.url;
          const name = game.name;
  
          const totalRating = game.total_rating || 0;
  
          const gaugeContainer = document.createElement("div");
          gaugeContainer.classList.add("gauge-container");
          gameLink.appendChild(gaugeContainer);
  
          initializeGauge(totalRating, `gauge-${name}`); // Pass the container id
  
          const bigCoverImageUrl = String(coverImageURL).replaceAll(
            "/t_thumb/",
            "/t_cover_big_2x/"
          );
  
          const coverImg = document.createElement("img");
          coverImg.src = `https://cors-proxy.austen-edge.workers.dev/corsproxy/?apiurl=https:${bigCoverImageUrl}`;
          gameLink.appendChild(coverImg);
  
          const gameName = document.createElement("h3");
          gameName.textContent = name;
          gameLink.appendChild(gameName);
  
          featuredGamesDiv.appendChild(gameCard);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
  
  fetchFeaturedGames();
  