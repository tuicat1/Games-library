// game-details.js

async function fetchGameDetails() {
    try {
        // Extract the game name from the URL parameters
        const params = new URLSearchParams(window.location.search);
        const gameName = params.get("gameName");

        // Use the game name to fetch details
        const resp = await fetch(
            `https://cors-proxy.austen-edge.workers.dev/corsproxy/?apiurl=https://api.igdb.com/v4/games`,
            {
                method: "POST",
                headers: {
                    "x-api-key": "x3x8c7heF6FMCpuNxAon",
                },
                body: `fields name,first_release_date,cover.url,involved_companies,videos,platforms.name,genres.name,summary; limit 1; where name="${gameName}";`,
            }
        );

        if (resp.status !== 200) {
            throw new Error(`HTTP error! status: ${resp.status}`);
        }

        const data = await resp.json();
        const coverImageURL = data[0]?.cover?.url;
        const screenshotBigUrl =
            coverImageURL?.replace("/t_thumb/", "/t_screenshot_big/") || "";
        const bigCoverImageUrl =
            coverImageURL?.replace("/t_thumb/", "/t_cover_big/") || "";

        // Update placeholders with actual data
        const parallaxContainer = document.querySelector(
            ".parallax-background"
        );
        const imageUrl = `https://cors-proxy.austen-edge.workers.dev/corsproxy/?apiurl=https:${screenshotBigUrl}`;
        parallaxContainer.style.backgroundImage = `url('${imageUrl}')`;

        const gamecoverImage = document.querySelector(".cover_big");
        gamecoverImage.src = `https://cors-proxy.austen-edge.workers.dev/corsproxy/?apiurl=https:${bigCoverImageUrl}`;
        gamecoverImage.alt = `Game Cover: ${data[0]?.name || "Unknown"}`;

        const bannerTitle = document.querySelector(".banner-title");
        bannerTitle.textContent = data[0]?.name || "Unknown";

        const description = document.getElementById("description");
        description.textContent = data[0]?.summary || "Description not available";

        document.getElementById("genre").textContent =
            data[0]?.genres?.map((genre) => genre.name).join(", ") ||
            "Genre not available";
        document.getElementById("platforms").textContent =
            data[0]?.platforms?.map((platform) => platform.name).join(", ") ||
            "Platforms not available";

        // Uncomment and modify the following lines when you have actual data to display
        document.querySelector(".banner-subheading").textContent =
            formatDate(data[0]?.first_release_date) ||
            "Release Date not available";

        document.querySelector(".company-name").textContent =
            findDeveloper(data[0]?.involved_companies) ||
            "Developer not available";
    } catch (error) {
        console.error(error);
        // Display an error message to the user if needed
    }
}

function formatDate(unixTimestamp) {
    if (unixTimestamp) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(unixTimestamp * 1000).toLocaleDateString(
            "en-US",
            options
        );
    }
    return "Release Date not available";
}

function findDeveloper(companyList) {
    for (let i = 0; i < companyList.length; i++) {
        if (companyList[i]?.developer === true) {
            return companyList[i]?.company?.name || "Developer not available";
        }
    }
    return "Developer not available";
}

fetchGameDetails();
