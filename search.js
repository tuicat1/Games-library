// search.js
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search");
  const searchButton = document.getElementById("search-button");
  const searchSuggestions = document.getElementById("search-suggestions");

  searchInput.addEventListener("input", handleInput);
  searchButton.addEventListener("click", handleSearch);

  async function handleInput() {
    const inputValue = searchInput.value.trim();

    if (inputValue === "") {
      clearSuggestions();
      return;
    }

    const suggestions = await fetchSuggestions(inputValue);
    displaySuggestions(suggestions);
  }

  async function fetchSuggestions(query) {
    try {
      const resp = await fetch(
        `https://cors-proxy.austen-edge.workers.dev/corsproxy/?apiurl=https://api.igdb.com/v4/games`,
        {
          method: "POST",
          headers: {
            "x-api-key": "x3x8c7heF6FMCpuNxAon",
          },
          body: `fields name,cover.url; limit 5; search "${query}";`,
        }
      );

      if (resp.status !== 200) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }

      const data = await resp.json();
      return data.map((game) => ({
        name: game.name,
        coverUrl: game.cover?.url, // Access cover URL from the API response
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  function displaySuggestions(suggestions) {
    clearSuggestions();

    if (suggestions.length > 0) {
      const dropdownBox = document.createElement("div");
      dropdownBox.className = "search-suggestions-box";

      suggestions.forEach((suggestion) => {
        const suggestionItem = document.createElement("div");
        suggestionItem.className = "suggestion-item";

        // Create a container for cover image
        const coverContainer = document.createElement("div");
        coverContainer.className = "cover-container";
        const coverImage = document.createElement("img");
        coverImage.src = `https://cors-proxy.austen-edge.workers.dev/corsproxy/?apiurl=https:${suggestion.coverUrl.replace(
          "/t_thumb/",
          "/t_cover_small/"
        )}`;
        coverContainer.appendChild(coverImage);

        // Create a container for text
        const textContainer = document.createElement("div");
        textContainer.className = "text-container";
        textContainer.textContent = suggestion.name;

        // Append cover image and text to the suggestion item
        suggestionItem.appendChild(coverContainer);
        suggestionItem.appendChild(textContainer);

        suggestionItem.addEventListener("click", () => {
          searchInput.value = suggestion.name;
          clearSuggestions();
          handleSearch();
        });

        dropdownBox.appendChild(suggestionItem);
      });

      searchSuggestions.appendChild(dropdownBox);
    }
  }

  function clearSuggestions() {
    searchSuggestions.innerHTML = "";
  }

  function handleSearch() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== "") {
      // Redirect to the respective game-description.html page with the selected game name
      window.location.href = `game-description.html?gameName=${encodeURIComponent(
        searchTerm
      )}`;
    }
  }
});
