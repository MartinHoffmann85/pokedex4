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
    // Create a new div container for the enlarged card
    const enlargedCardContainer = document.createElement('div');
    enlargedCardContainer.classList.add('enlarged-card-container');
  
    // Clone the clicked card and add it to the new container
    const enlargedCard = card.cloneNode(true);
    enlargedCard.classList.add('enlarged-card');
  
    // Remove the animation class from the cloned card
    enlargedCard.classList.remove('active');
  
    // Add a new class to the cloned card to disable the animation
    enlargedCard.classList.add('no-animation');
  
    enlargedCardContainer.appendChild(enlargedCard);
  
    // Append the new container to the body
    document.querySelector('body').appendChild(enlargedCardContainer);
  
    // Add event listener to remove the enlarged card and container when clicking outside
    enlargedCardContainer.addEventListener('click', () => {
      enlargedCardContainer.remove();
    });
  }