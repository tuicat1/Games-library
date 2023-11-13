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
            body: `fields name; limit 5; search "${query}";`,
          }
        );
  
        if (resp.status !== 200) {
          throw new Error(`HTTP error! status: ${resp.status}`);
        }
  
        const data = await resp.json();
        return data.map((game) => game.name);
      } catch (error) {
        console.error(error);
        return [];
      }
    }
  
    function displaySuggestions(suggestions) {
      clearSuggestions();
      suggestions.forEach((suggestion) => {
        const suggestionItem = document.createElement("li");
        suggestionItem.textContent = suggestion;
        suggestionItem.addEventListener("click", () => {
          searchInput.value = suggestion;
          clearSuggestions();
          handleSearch();
        });
        searchSuggestions.appendChild(suggestionItem);
      });
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
  