// index.js

function initializeGauge(value, containerId, max = 100, dialStartAngle = -90, dialEndAngle = -90.001) {
  try {
    console.log("Container ID:", containerId);
    var Gauge = window.Gauge;
    var gaugeContainer = document.getElementById(containerId);
    console.log("Gauge Container:", gaugeContainer);
    var gauge = Gauge(gaugeContainer, {
      max: max,
      dialStartAngle: dialStartAngle,
      dialEndAngle: dialEndAngle,
      value: value,
      showValue: true,
      label: function (value) {
        return Math.round((value * 100) / max);
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

function createGameCard(game) {
  if (game.name && game.cover && game.cover.url) {
    const gameCard = document.createElement("div");
    gameCard.classList.add("game-card");

    const gameLink = document.createElement("a");
    gameLink.href = `game-description.html?gameName=${encodeURIComponent(game.name)}`;
    gameCard.appendChild(gameLink);

    const coverImageURL = game.cover.url;

    const totalRating = game.total_rating || 0;

    const gaugeContainer = document.createElement("div");
    gaugeContainer.classList.add("small-gauge-container");

    const containerId = `gauge-${game.name}`;
    gaugeContainer.id = containerId;
    gameCard.appendChild(gaugeContainer);

    setTimeout(() => {
      initializeGauge(totalRating, containerId);
    }, 10);

    const bigCoverImageUrl = String(coverImageURL).replaceAll(
      "/t_thumb/",
      "/t_cover_big_2x/"
    );

    const coverImg = document.createElement("img");
    coverImg.src = `https://cors-proxy.austen-edge.workers.dev/corsproxy/?apiurl=https:${bigCoverImageUrl}`;
    gameLink.appendChild(coverImg);

    const gameName = document.createElement("h3");
    gameName.textContent = game.name;
    gameLink.appendChild(gameName);

    // Create buttons div
    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("index-buttons");

    // Create Want button
    const wantButton = createStatusButton("Want");
    buttonsDiv.appendChild(wantButton);

    // Create Playing button
    const playingButton = createStatusButton("Playing");
    buttonsDiv.appendChild(playingButton);

    // Create Played button
    const playedButton = createStatusButton("Played");
    buttonsDiv.appendChild(playedButton);

    // Append buttons div to the game card
    gameCard.appendChild(buttonsDiv);

    return gameCard;
  }
}

function createStatusButton(status) {
  const button = document.createElement("button");
  button.classList.add("index-status-button");
  button.id = `${status.toLowerCase()}-button`;

  switch (status) {
    case "Want":
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="30" height="30"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-11h2v4h-2zm0 5h2v2h-2z"/></svg>`;
      break;
    case "Playing":
      button.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="gamepad" class="svg-inline--fa fa-gamepad fa-2xl" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" color="inherit"><path fill="currentColor" d="M192 64C86 64 0 150 0 256S86 448 192 448H448c106 0 192-86 192-192s-86-192-192-192H192zM496 248c-22.1 0-40-17.9-40-40s17.9-40 40-40s40 17.9 40 40s-17.9 40-40 40zm-24 56c0 22.1-17.9 40-40 40s-40-17.9-40-40s17.9-40 40-40s40 17.9 40 40zM168 200c0-13.3 10.7-24 24-24s24 10.7 24 24v32h32c13.3 0 24 10.7 24 24s-10.7 24-24 24H216v32c0 13.3-10.7 24-24 24s-24-10.7-24-24V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h32V200z"></path></svg>`;
      break;
    case "Played":
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="30" height="30"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>`;
      break;
    default:
      break;
  }

  button.addEventListener("click", function () {
    const currentColor = button.style.backgroundColor;

    if (currentColor === "green") {
      button.style.removeProperty("background-color");
    } else {
      button.style.backgroundColor = "green";
    }
  });

  return button;
}

async function fetchFeaturedGames() {
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
      }
    );

    if (resp.status !== 200) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }

    const data = await resp.json();
    const featuredGamesDiv = document.getElementById("featured-games-div");

    data?.forEach((game) => {
      const gameCard = createGameCard(game);
      if (gameCard) {
        featuredGamesDiv.appendChild(gameCard);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

fetchFeaturedGames();
