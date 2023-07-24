function init() {
  fetchAndDisplayPokemon();
}
  
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
    // Create a new div container for the enlarged card and stats button
    const enlargedCardContainer = document.createElement('div');
    enlargedCardContainer.classList.add('enlarged-card-container');
    enlargedCardContainer.classList.add('displayFlex');
  
    // Clone the clicked card and add it to the new container
    const enlargedCard = card.cloneNode(true);
    enlargedCard.classList.add('enlarged-card');
  
    // Remove the animation class from the cloned card
    enlargedCard.classList.remove('active');
  
    // Add a new class to the cloned card to disable the animation
    enlargedCard.classList.add('no-animation');
  
    enlargedCardContainer.appendChild(enlargedCard);
  
    // Create the "Stats" button and append it to the container
    const statsButton = document.createElement('button');
    statsButton.innerText = 'Stats';
    statsButton.classList.add('stats-button');
    enlargedCardContainer.appendChild(statsButton);

    // Add event listener to the "Stats" button to call openStats() when clicked
  let statsButtonClicked = false; // Variable to keep track of whether the "Stats" button was clicked

  statsButton.addEventListener('click', () => {
    if (!statsButtonClicked) {
      statsButtonClicked = true;
      openStats();

      // Re-enable the click event after a short delay (e.g., 500ms)
      setTimeout(() => {
        statsButtonClicked = false;
      }, 500);
    }
  });
  
    // Position the "Stats" button below the enlarged card
    const cardRect = card.getBoundingClientRect();
    const statsButtonTop = cardRect.bottom + 20; // Add some spacing (20px) below the card    
    statsButton.style.left = '50%';
    statsButton.style.transform = 'translateX(-50%)';
    statsButton.style.top = `${statsButtonTop}px`;
  
    // Append the new container to the body
    document.querySelector('body').appendChild(enlargedCardContainer);
  
    // Add event listener to remove the enlarged card and container when clicking outside
    enlargedCardContainer.addEventListener('click', (event) => {
      if (!enlargedCard.contains(event.target)) {
        enlargedCardContainer.remove();
      }
    });
  }

  function openStats() {
    // Find the content container
    const contentContainer = document.querySelector('.content');
    contentContainer.classList.add('vh100');
    // Remove all existing content (cards)
    contentContainer.innerHTML = '';
  
    // Create a new card element with a blue background
    const newCard = document.createElement('div');
    newCard.classList.add('card');    
    newCard.style.backgroundColor = 'blue';

    // Remove the animation classes from the new card
    newCard.classList.remove('active');
    newCard.style.animation = 'none';
  
    // Append the new card to the content container
    contentContainer.appendChild(newCard);      
  }