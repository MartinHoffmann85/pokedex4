function init() {
    fetchAndDisplayPokemon();
  };
  
  // Function to fetch Pokemon data from the API and display cards with images
  async function fetchAndDisplayPokemon() {
    const apiUrl = 'https://api.pokemontcg.io/v2/cards';
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const cardsContainer = document.querySelector('.content');
  
      // Get the first 10 Pokemon cards from the API response
      const pokemonData = data.data.slice(0, 10);
  
      // Create and append card elements with background images to the container
      pokemonData.forEach((pokemon) => {
        const card = document.createElement('div');
        card.classList.add('card');        
        card.style.backgroundImage = `url(${pokemon.images.small})`;
        cardsContainer.appendChild(card);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }