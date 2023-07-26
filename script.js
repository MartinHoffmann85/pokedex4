function init() {
  fetchAndDisplayPokemonImage();
}

async function fetchAndDisplayPokemonImage() {  // Function to fetch Pokemon data from the API and display cards with images  
  const pokemonDataInLocalStorage = localStorage.getItem('pokemonData'); // Überprüfen, ob die Pokemon-Daten bereits im LocalStorage vorhanden sind
  if (pokemonDataInLocalStorage) {  // Wenn die Daten bereits im LocalStorage vorhanden sind, rufe sie ab und zeige sie an    
    const pokemonData = JSON.parse(pokemonDataInLocalStorage);
    const cardsContainer = document.querySelector('.content');
    displayPokemonImage(pokemonData, cardsContainer);
  } else {  // Wenn die Daten nicht im LocalStorage vorhanden sind, rufe sie von der API ab    
    const apiUrl = 'https://api.pokemontcg.io/v2/cards';  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const pokemonData = data.data.slice(0, 10);      
      localStorage.setItem('pokemonData', JSON.stringify(pokemonData));  // Speichere die Pokemon-Daten im LocalStorage  
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
    card.addEventListener("click", () => {  // Add event listener to handle the click event
      handleCardClick(card);
    });
    cardsContainer.appendChild(card);    
    VanillaTilt.init(card, {  // Init Vanilla Tilt for each card after it's created
      max: 25,
      speed: 400,
      glare: true,
      "max-glare": 0.5,
    });
  });
}

function handleCardClick(card) {
  const enlargedCardContainer = document.createElement("div");  // Create a new div container for the enlarged card and stats button
  enlargedCardContainer.classList.add("enlarged-card-container");
  enlargedCardContainer.classList.add("displayFlex");
  
  const enlargedCard = card.cloneNode(true);  // Clone the clicked card and add it to the new container
  enlargedCard.classList.add("enlarged-card");  
  enlargedCard.classList.remove("active");  // Remove the animation class from the cloned card  
  enlargedCard.classList.add("no-animation");  // Add a new class to the cloned card to disable the animation
  enlargedCardContainer.appendChild(enlargedCard);
  
  const statsButton = document.createElement("button");  // Create the "Stats" button and append it to the container
  statsButton.innerText = "Stats";
  statsButton.classList.add("stats-button");
  enlargedCardContainer.appendChild(statsButton);
  
  let statsButtonClicked = false; // Variable to keep track of whether the "Stats" button was clicked

  statsButton.addEventListener("click", () => {  // Add event listener to the "Stats" button to call openStats() when clicked
    if (!statsButtonClicked) {
      statsButtonClicked = true;
      openStats();
      
      setTimeout(() => {  // Re-enable the click event after a short delay (e.g., 500ms)
        statsButtonClicked = false;
      }, 500);
    }
  });
  
  const cardRect = card.getBoundingClientRect();  // Position the "Stats" button below the enlarged card
  const statsButtonTop = cardRect.bottom + 20; // Add some spacing (20px) below the card
  statsButton.style.left = "50%";
  statsButton.style.transform = "translateX(-50%)";
  statsButton.style.top = `${statsButtonTop}px`;  
  document.querySelector("body").appendChild(enlargedCardContainer);  // Append the new container to the body  
  enlargedCardContainer.addEventListener("click", (event) => {  // Add event listener to remove the enlarged card and container when clicking outside
    if (!enlargedCard.contains(event.target)) {
      enlargedCardContainer.remove();
    }
  });
}

function openStats() {
  const contentContainer = document.querySelector(".content");
  contentContainer.classList.add("vh100");
  contentContainer.innerHTML = "";

  const newCard = document.createElement("div");
  newCard.id = "newCardID";
  newCard.classList.add("card");
  newCard.classList.add("colorBlack");
  newCard.style.backgroundColor = "white";
  newCard.classList.remove("active");
  newCard.style.animation = "none";

  contentContainer.appendChild(newCard);

  const pokemonDataInLocalStorage = localStorage.getItem("pokemonData");
  if (pokemonDataInLocalStorage) {
    const pokemonData = JSON.parse(pokemonDataInLocalStorage);
    const cardId = pokemonData[0].id; // Hier nehmen wir die ID des ersten Pokemons im Array als Beispiel
    fetchAndDisplayPrices(cardId, newCard); // Hier wird die Funktion aufgerufen, um die Preise abzurufen und anzuzeigen
  } else {
    fetchAndDisplayPokemonImage();
  }

  const backButton = document.createElement("button");
  backButton.innerText = "Back";
  backButton.classList.add("back-button");
  contentContainer.appendChild(backButton);
  backButton.addEventListener("click", backButtonHandler);
}



function backButtonHandler() {  
  const contentContainer = document.querySelector('.content');  // Find the content container
  contentContainer.classList.remove('vh100');  
  contentContainer.innerHTML = '';  // Remove all existing content (cards)  
  const pokemonDataInLocalStorage = localStorage.getItem('pokemonData');  // Überprüfen, ob die Pokemon-Daten im LocalStorage vorhanden sind

  if (pokemonDataInLocalStorage) {  // Wenn die Daten im LocalStorage vorhanden sind, rufe sie ab und zeige sie an    
    const pokemonData = JSON.parse(pokemonDataInLocalStorage);
    displayPokemonImage(pokemonData, contentContainer);
  } else {    
    fetchAndDisplayPokemonImage();  // Wenn die Daten nicht im LocalStorage vorhanden sind, rufe sie von der API ab
  }
}



function generatePricesHTML(newCard, prices) {
  newCard.innerHTML += `
    <h2>Prices:</h2>
    <p>Low: $${prices.low}</p>
    <p>Mid: $${prices.mid}</p>
    <p>High: $${prices.high}</p>
    <p>Market: $${prices.market}</p>
  `;
  
  if (prices.directLow !== null) {
    newCard.innerHTML += `<p>Direct Low: $${prices.directLow}</p>`;
  }
}


async function fetchAndDisplayPrices(id, newCard) {
  const apiUrl = `https://api.pokemontcg.io/v2/cards/${id}`;
  try {
    console.log('Fetching data from API...');
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log('API response:', data);

    if (data && data.data && data.data.tcgplayer && data.data.tcgplayer.prices && data.data.tcgplayer.prices.holofoil) {
      const prices = data.data.tcgplayer.prices.holofoil;
      localStorage.setItem('pokemonPrices', JSON.stringify(prices));
      console.log('Prices fetched and saved:', prices);
      generatePricesHTML(newCard, prices);
    } else {
      console.error('Error: Prices not found in API response');
    }
  } catch (error) {
    console.error('Error fetching prices:', error);
  }
}

