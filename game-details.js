// game-details.js

document.addEventListener("DOMContentLoaded", function () {
  const ratingContainer = document.querySelector(".rating");

  ratingContainer.addEventListener("click", function (event) {
    const clickedStar = event.target.closest(".rating-star");

    if (clickedStar) {
      const ratingValue = clickedStar.getAttribute("data-star");

      ratingContainer.querySelectorAll(".rating-star").forEach((star) => {
        const starValue = star.getAttribute("data-star");
        star.classList.toggle("clicked", starValue <= ratingValue);
      });

      console.log("Rated:", ratingValue);
    }
  });

  // Add a hover effect to stars
  ratingContainer.addEventListener("mouseover", function (event) {
    const hoveredStar = event.target.closest(".rating-star");

    if (hoveredStar) {
      const ratingValue = hoveredStar.getAttribute("data-star");

      ratingContainer.querySelectorAll(".rating-star").forEach((star) => {
        const starValue = star.getAttribute("data-star");
        star.classList.toggle("hovered", starValue <= ratingValue);
      });
    }
  });

  // Remove the hover effect when the mouse leaves the rating container
  ratingContainer.addEventListener("mouseout", function () {
    ratingContainer.querySelectorAll(".rating-star").forEach((star) => {
      star.classList.remove("hovered");
    });
  });

  fetchGameDetails();
});

async function fetchGameDetails() {
  try {
    const gameName = new URLSearchParams(window.location.search).get(
      "gameName"
    );

    const resp = await fetch(
      `https://cors-proxy.austen-edge.workers.dev/corsproxy/?apiurl=https://api.igdb.com/v4/games`,
      {
        method: "POST",
        headers: {
          "x-api-key": "x3x8c7heF6FMCpuNxAon",
        },
        body: `fields name,screenshots.url,total_rating,total_rating_count,first_release_date,cover.url,involved_companies.developer,involved_companies.company.name,videos,platforms.name,genres.name,summary; limit 1; where name="${gameName}";`,
      }
    );

    if (resp.status !== 200) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }

    const data = await resp.json();
    const gameDetails = data[0];

    updateUi(gameDetails);
  } catch (error) {
    console.error(error);
    // Display an error message to the user if needed
  }
}

function updateUi(gameDetails) {
  const parallaxContainer = document.querySelector(".parallax-background");
  // Choose a random screenshot URL
  const screenshots = gameDetails.screenshots || [];
  const randomIndex = Math.floor(Math.random() * screenshots.length);
  const randomImageUrl = screenshots[randomIndex]?.url || "";

  // Set the random image as the parallax background
  const imageUrl = `https://cors-proxy.austen-edge.workers.dev/corsproxy/?apiurl=https:${randomImageUrl.replace(
    "/t_thumb/",
    "/t_screenshot_big/"
  )}`;
  parallaxContainer.style.backgroundImage = `url('${imageUrl}')`;

  const gameCoverImage = document.querySelector(".cover_big");
  gameCoverImage.src = `https://cors-proxy.austen-edge.workers.dev/corsproxy/?apiurl=https:${
    gameDetails.cover?.url?.replace("/t_thumb/", "/t_cover_big_2x/") || ""
  }`;
  gameCoverImage.alt = `Game Cover: ${gameDetails.name || "Unknown"}`;

  const bannerTitle = document.querySelector(".banner-title");
  bannerTitle.textContent = gameDetails.name || "Unknown";

  const description = document.getElementById("description");
  description.textContent = gameDetails.summary || "Description not available";

  const averageRating = gameDetails.total_rating || 0;
  initializeGauge(averageRating);

  document.getElementById("genre").textContent =
    gameDetails.genres?.map((genre) => genre.name).join(", ") ||
    "Genre not available";
  document.getElementById("platforms").textContent =
    gameDetails.platforms?.map((platform) => platform.name).join(", ") ||
    "Platforms not available";

  document.querySelector(".banner-subheading").textContent =
    formatDate(gameDetails.first_release_date) || "Release Date not available";

  document.querySelector(".company-name").textContent =
    findDeveloper(gameDetails.involved_companies) || "Developer not available";

  const carouselImages = screenshots.map(
    (screenshot) =>
      `https://cors-proxy.austen-edge.workers.dev/corsproxy/?apiurl=https:${screenshot.url.replace(
        "/t_thumb/",
        "/t_720p/"
      )}`
  );
  createSlides(carouselImages);
  loop();
}

function formatDate(unixTimestamp) {
  if (unixTimestamp) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(unixTimestamp * 1000).toLocaleDateString("en-NZ", options);
  }
  return "Release Date not available";
}

function findDeveloper(companyList) {
  const developerCompanies = companyList
    ?.filter((company) => company?.developer === true)
    ?.map((company) => company?.company?.name || "Developer not available");

  return developerCompanies && developerCompanies.length > 0
    ? developerCompanies.join(", ")
    : "Developer not available";
}

function initializeGauge(value) {
  var Gauge = window.Gauge;
  var gauge1 = Gauge(document.getElementById("gauge1"), {
    max: 100,
    dialStartAngle: -90,
    dialEndAngle: -90.001,
    value: value,
    showValue: true,
    label: (value) => Math.round((value * 100) / 100),
    color: (value) => {
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
  gauge1.setValue(value);
}

function createSlides(imageUrls) {
  const container = document.getElementById("slider-container");
  const menu = document.getElementById("menu");

  imageUrls.forEach((imageUrl, index) => {
    // Create radio input
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "slides";
    input.id = `slide-dot-${index + 1}`;
    index === 0 && (input.checked = true); // Check the first radio input

    // Create label for the radio input
    const label = document.createElement("label");
    label.htmlFor = `slide-dot-${index + 1}`;

    // Create slide
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.style.backgroundImage = `url(${imageUrl})`;
    slide.style.flexDirection = "row"; // Set the flex direction to row

    // Append elements to the container and menu
    container.appendChild(input);
    container.appendChild(slide);
    menu.appendChild(label);
  });
}

function loop() {
  gauge1.setValueAnimated(gauge1.config.value, 1); // Assuming value is defined somewhere
  window.setTimeout(loop, 4000);
}
