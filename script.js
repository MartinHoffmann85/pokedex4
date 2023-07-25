function init() {
  fetchAndDisplayPokemon();
}



// Function to fetch Pokemon data from the API and display cards with images
async function fetchAndDisplayPokemon() {
  // Überprüfen, ob die Pokemon-Daten bereits im LocalStorage vorhanden sind
  const pokemonDataInLocalStorage = localStorage.getItem('pokemonData');

  if (pokemonDataInLocalStorage) {
    // Wenn die Daten bereits im LocalStorage vorhanden sind, rufe sie ab und zeige sie an
    const pokemonData = JSON.parse(pokemonDataInLocalStorage);
    const cardsContainer = document.querySelector('.content');
    displayPokemonImage(pokemonData, cardsContainer);
  } else {
    // Wenn die Daten nicht im LocalStorage vorhanden sind, rufe sie von der API ab
    const apiUrl = 'https://api.pokemontcg.io/v2/cards';
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const pokemonData = data.data.slice(0, 10);
  
      // Speichere die Pokemon-Daten im LocalStorage
      localStorage.setItem('pokemonData', JSON.stringify(pokemonData));
  
      const cardsContainer = document.querySelector('.content');
      displayPokemonImage(pokemonData, cardsContainer);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}




function displayPokemonImage(pokemonData, cardsContainer) {
  pokemonData.forEach((pokemon) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.backgroundImage = `url(${pokemon.images.large})`;

    // Add event listener to handle the click event
    card.addEventListener("click", () => {
      handleCardClick(card);
    });

    cardsContainer.appendChild(card);
  });
}



function handleCardClick(card) {
  // Create a new div container for the enlarged card and stats button
  const enlargedCardContainer = document.createElement("div");
  enlargedCardContainer.classList.add("enlarged-card-container");
  enlargedCardContainer.classList.add("displayFlex");

  // Clone the clicked card and add it to the new container
  const enlargedCard = card.cloneNode(true);
  enlargedCard.classList.add("enlarged-card");

  // Remove the animation class from the cloned card
  enlargedCard.classList.remove("active");

  // Add a new class to the cloned card to disable the animation
  enlargedCard.classList.add("no-animation");

  enlargedCardContainer.appendChild(enlargedCard);

  // Create the "Stats" button and append it to the container
  const statsButton = document.createElement("button");
  statsButton.innerText = "Stats";
  statsButton.classList.add("stats-button");
  enlargedCardContainer.appendChild(statsButton);

  // Add event listener to the "Stats" button to call openStats() when clicked
  let statsButtonClicked = false; // Variable to keep track of whether the "Stats" button was clicked

  statsButton.addEventListener("click", () => {
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
  statsButton.style.left = "50%";
  statsButton.style.transform = "translateX(-50%)";
  statsButton.style.top = `${statsButtonTop}px`;

  // Append the new container to the body
  document.querySelector("body").appendChild(enlargedCardContainer);

  // Add event listener to remove the enlarged card and container when clicking outside
  enlargedCardContainer.addEventListener("click", (event) => {
    if (!enlargedCard.contains(event.target)) {
      enlargedCardContainer.remove();
    }
  });
}



function openStats() {
  // Find the content container
  const contentContainer = document.querySelector(".content");
  contentContainer.classList.add("vh100");
  // Remove all existing content (cards)
  contentContainer.innerHTML = "";

  // Create a new card element with a blue background
  const newCard = document.createElement("div");
  newCard.classList.add("card");
  newCard.style.backgroundColor = "white";

  // Remove the animation classes from the new card
  newCard.classList.remove("active");
  newCard.style.animation = "none";

  // Append the new card to the content container
  contentContainer.appendChild(newCard);

  // Create the "back" button and append it to the container
  const backButton = document.createElement("button");
  backButton.innerText = "Back";
  backButton.classList.add("back-button"); // Use a different class name for the "Back" button
  contentContainer.appendChild(backButton);

  // Add event listener to the "Back" button to call backButton() when clicked
  backButton.addEventListener("click", backButtonHandler);
}



function backButtonHandler() {
  // Find the content container
  const contentContainer = document.querySelector('.content');  
  contentContainer.classList.remove('vh100');

  // Remove all existing content (cards)
  contentContainer.innerHTML = '';

  // Überprüfen, ob die Pokemon-Daten im LocalStorage vorhanden sind
  const pokemonDataInLocalStorage = localStorage.getItem('pokemonData');

  if (pokemonDataInLocalStorage) {
    // Wenn die Daten im LocalStorage vorhanden sind, rufe sie ab und zeige sie an
    const pokemonData = JSON.parse(pokemonDataInLocalStorage);
    displayPokemonImage(pokemonData, contentContainer);
  } else {
    // Wenn die Daten nicht im LocalStorage vorhanden sind, rufe sie von der API ab
    fetchAndDisplayPokemon();
  }
  // Find the content container
  
}




