let clickedPokemon = null;  // Define a global variable to store the clicked Pokemon ID

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
    card.dataset.pokemonId = pokemon.id; // Add the Pokemon ID to the card's dataset
    card.addEventListener("click", () => {
      handleCardClick(card);
    });
    cardsContainer.appendChild(card);
    VanillaTilt.init(card, {
      max: 25,
      speed: 400,
      glare: true,
      "max-glare": 0.5,
    });
  });
}



function handleCardClick(card) {  
  clickedPokemon = card.dataset.pokemonId;  // Store the clicked Pokemon ID in the global variable
  const enlargedCardContainer = document.createElement("div");
  enlargedCardContainer.classList.add("enlarged-card-container");
  enlargedCardContainer.classList.add("displayFlex");
  const enlargedCard = card.cloneNode(true);
  enlargedCard.classList.add("enlarged-card");
  enlargedCard.classList.remove("active");
  enlargedCard.classList.add("no-animation");
  enlargedCardContainer.appendChild(enlargedCard);
  const PricesButton = document.createElement("button");
  PricesButton.innerText = "Prices";
  PricesButton.classList.add("prices-button");
  enlargedCardContainer.appendChild(PricesButton);
  let statsButtonClicked = false;
  PricesButton.addEventListener("click", () => {
    if (!statsButtonClicked) {
      statsButtonClicked = true;
      openStats();
    }
  });
  enlargedCardContainer.addEventListener("click", (event) => {
    if (!enlargedCard.contains(event.target)) {
      enlargedCardContainer.remove();
    }
  }
  );
  document.querySelector("body").appendChild(enlargedCardContainer);
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
    const cardId = pokemonData[0]; // Hier nehmen wir die ID des ersten Pokemons im Array als Beispiel
    fetchAndDisplayPrices(clickedPokemon, newCard); // Hier wird die Funktion aufgerufen, um die Preise abzurufen und anzuzeigen
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
  const canvas = document.createElement('canvas');  // Erstelle ein Canvas-Element für das Balkendiagramm
  canvas.width = 400; // Breite des Diagramms (kann angepasst werden)
  canvas.height = 200; // Höhe des Diagramms (kann angepasst werden)
  newCard.appendChild(canvas);  
  const chartData = {  // Daten für das Balkendiagramm
    labels: ['Low', 'Mid', 'High', 'Market'],
    datasets: [
      {
        label: 'Prices',
        data: [prices.low, prices.mid, prices.high, prices.market],
        backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)'],
        borderColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 206, 86)', 'rgb(75, 192, 192)'],
        borderWidth: 1
      }
    ]
  };  
  const chartOptions = {  // Optionen für das Balkendiagramm
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };  
  new Chart(canvas, {  // Erstelle das Balkendiagramm
    type: 'bar',
    data: chartData,
    options: chartOptions
  });
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
      newCard.innerHTML = "<p>Prices not available for this Pokemon.</p>";  // If prices are not found, display a message in the card
    }
  } catch (error) {
    console.error('Error fetching prices:', error);  // If an error occurs, display an error message in the card    
    newCard.innerHTML = "<p>Error fetching prices.</p>";
  }
}

