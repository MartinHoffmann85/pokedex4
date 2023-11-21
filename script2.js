function loadingAnimation() {
    const searchButton = document.getElementById('search-buttonID');  
    if (!isLoading) {  // Check if the animation is already running before starting it
      searchButton.classList.add('loading');
      searchButton.innerHTML = '<span class="icon">&#8635;</span>Searching Pokemon...';
      isLoading = true;
    }
  }
  
  function stopLoadingAnimation() {
    const searchButton = document.getElementById('search-buttonID');    
    searchButton.classList.remove('loading');    
    searchButton.innerHTML = '<span class="icon">&#128269;</span>Search';    
    isLoading = false;
  }
  
  function loadingAnimationMorePokemon() {
    const searchButton = document.getElementById('morePokemonsID');
    const searchButton2 = document.getElementById('morePokemons2ID');
    if (!isLoading) {  // Check if the animation is already running before starting it
      searchButton.classList.add('loading');
      searchButton2.classList.add('loading');
      searchButton.innerHTML = '<span class="icon">&#8635;</span>Loading Pokemon...';
      searchButton2.innerHTML = '<span class="icon">&#8635;</span>Loading Pokemon...';
      isLoading = true;
    }
  }
  
  function stopLoadingAnimationMorePokemon() {
    const searchButton = document.getElementById('morePokemonsID');
    const searchButton2 = document.getElementById('morePokemons2ID');
    searchButton.classList.remove('loading');
    searchButton2.classList.remove('loading');
    searchButton.innerHTML = '<span class="icon">&#128269;</span>More Pokemons';
    searchButton2.innerHTML = '<span class="icon">&#128269;</span>More Pokemons';
    isLoading = false;
  }
  
  function showPreviousPokemonSingleCard() {
    const cardsContainer = document.querySelector('.content');
    const allCards = Array.from(cardsContainer.querySelectorAll('.card'));  
    const currentIndex = allCards.findIndex(card => card.dataset.pokemonId === clickedPokemonID);  // Find the index of the clicked card in the array  
    const previousIndex = (currentIndex - 1 + allCards.length) % allCards.length;  // Calculate the previous index in a circular manner
    const previousCard = allCards[previousIndex];
    handleCardClick(previousCard); // Show the previous card using the existing handleCardClick function
  }
  
  function showNextPokemonSingleCard() {
    const cardsContainer = document.querySelector('.content');
    const allCards = Array.from(cardsContainer.querySelectorAll('.card'));  
    const currentIndex = allCards.findIndex(card => card.dataset.pokemonId === clickedPokemonID);  // Find the index of the clicked card in the array  
    const nextIndex = (currentIndex + 1) % allCards.length;  // Calculate the next index in a circular manner
    const nextCard = allCards[nextIndex];
    handleCardClick(nextCard); // Show the next card using the existing handleCardClick function
  }

  function checkPricesButtonClicked(PricesButton, pokemon) {
    let pricesButtonClicked = false;
    PricesButton.addEventListener("click", () => {
      if (!pricesButtonClicked) {
        pricesButtonClicked = true;
        openPrices(pokemon);
      }
    });
  }
  
  function createPricesButtonForSearchedPokemon(enlargedCardContainer) {
    const PricesButton = document.createElement("button");
    PricesButton.innerText = "Prices";
    PricesButton.classList.add("prices-button");
    enlargedCardContainer.appendChild(PricesButton);
    stopLoadingAnimation();
    return PricesButton;
  }