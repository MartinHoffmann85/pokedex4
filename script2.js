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
    const currentIndex = allCards.findIndex(card => card.dataset.pokemonId === clickedPokemonID);  
    const previousIndex = (currentIndex - 1 + allCards.length) % allCards.length;
    const previousCard = allCards[previousIndex];    
    handleCardClick(previousCard);    
  }
  
  async function showNextPokemonSingleCard() {    
    const cardsContainer = document.querySelector('.content');
    const allCards = Array.from(cardsContainer.querySelectorAll('.card'));  
    const currentIndex = allCards.findIndex(card => card.dataset.pokemonId === clickedPokemonID);
    const nextIndex = (currentIndex + 1) % allCards.length;
    const nextCard = allCards[nextIndex];    
    handleCardClick(nextCard);    
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

  function showScrollBar() {
    isScrollBarVisible = true;
    document.body.style.overflow = 'auto'; // Show scroll bar
  }
  
  function hideScrollBar() {
    isScrollBarVisible = false;
    document.body.style.overflow = 'hidden'; // Hide scroll bar
  }