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
      
        // Add event listener to handle the click event
        card.addEventListener('click', () => {
          handleCardClick(card);
        });
      
        cardsContainer.appendChild(card);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function handleCardClick(card) {
    // Add a class to the clicked card to apply the animation
    card.classList.add('active');
  
    // Create a blurred background div and append it to the container
    const blurredBackground = document.createElement('div');
    blurredBackground.classList.add('blurred-background');
    document.querySelector('body').appendChild(blurredBackground);
  
    // Add event listener to remove the enlarged card and blurred background when clicking outside
    blurredBackground.addEventListener('click', () => {
      card.classList.remove('active');
      blurredBackground.remove();
    });
  }