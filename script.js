let clickedPokemonID = null;  // clicked Pokemon ID
let isLoading = false;

const loadChartOptions = {
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 1), '
      }
    }
  }
};



async function init() {
  const loadingScreen = document.getElementById('loadingScreen');
  loadingScreen.style.display = 'block'; // Show the loading screen
  await fetchAndDisplayPokemonImage();
  loadingScreen.style.display = 'none'; // Hide the loading screen once the content is ready  
}



async function fetchAndDisplayPokemonImage() {  // Function to fetch Pokemon data from the API and display cards with images  
  const pokemonDataInLocalStorage = localStorage.getItem('pokemonData'); // Überprüfen, ob die Pokemon-Daten bereits im LocalStorage vorhanden sind
  if (pokemonDataInLocalStorage) {  // Wenn die Daten bereits im LocalStorage vorhanden sind, rufe sie ab und zeige sie an    
    const pokemonData = JSON.parse(pokemonDataInLocalStorage);
    const cardsContainer = document.querySelector('.content');
    displayPokemonImage(pokemonData, cardsContainer);
  } else {  // Wenn die Daten nicht im LocalStorage vorhanden sind, rufe sie von der API ab    
    await fetchPokemonJsonFromUrl();
  }
}



async function fetchPokemonJsonFromUrl() {
  const apiUrl = 'https://api.pokemontcg.io/v2/cards';
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const pokemonData = data.data.slice(0, 100);
    localStorage.setItem('pokemonData', JSON.stringify(pokemonData)); // Save the Pokemon-Data in LocalStorage  
    const cardsContainer = document.querySelector('.content');
    displayPokemonImage(pokemonData, cardsContainer);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}



function displayPokemonImage(pokemonData, cardsContainer) {
  pokemonData.forEach((pokemon) => {
    const card = document.createElement('div');
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
  clickedPokemonID = card.dataset.pokemonId; // Store the clicked Pokemon ID in the global variable
  const { enlargedCardContainer, enlargedCard } = createEnlargedContainer(card);
  const PricesButton = createPricesButton(enlargedCardContainer);
  let statsButtonClicked = false;
  statsButtonClicked = checkStatsButtonClicked(PricesButton, statsButtonClicked);
  enlargedCardContainer.addEventListener("click", (event) => {
    if (!enlargedCard.contains(event.target)) {
      enlargedCardContainer.remove();
    }
  });
  document.querySelector("body").appendChild(enlargedCardContainer);
}



function checkStatsButtonClicked(PricesButton, statsButtonClicked) {
  PricesButton.addEventListener("click", () => {
    if (!statsButtonClicked) {
      statsButtonClicked = true;
      openPrices();
    }
  });
  return statsButtonClicked;
}



function createEnlargedContainer(card) {
  const enlargedCardContainer = document.createElement("div");
  enlargedCardContainer.classList.add("enlarged-card-container");
  enlargedCardContainer.classList.add("displayFlex");
  const enlargedCard = card.cloneNode(true);
  enlargedCard.classList.add("enlarged-card");
  enlargedCard.classList.remove("active");
  enlargedCard.classList.add("no-animation"); // Add the no-animation class to prevent animations
  enlargedCard.classList.remove("starSparkle"); // Remove the starSparkle class to prevent the animation
  enlargedCardContainer.appendChild(enlargedCard);
  return { enlargedCardContainer, enlargedCard };
}



function createPricesButton(enlargedCardContainer) {
  const PricesButton = document.createElement("button");
  PricesButton.innerText = "Prices";
  PricesButton.classList.add("prices-button");
  enlargedCardContainer.appendChild(PricesButton);
  return PricesButton;
}



function openPrices() {
  const contentContainer = createContentContainer();
  const newCard = createNewCard(contentContainer); 
  createBackButton(contentContainer);
  fetchAndDisplayPrices(clickedPokemonID, newCard); // Hier wird die Funktion aufgerufen, um die Preise abzurufen und anzuzeigen
}



function createBackButton(contentContainer) {
  const backButton = document.createElement("button");
  backButton.innerText = "Back";
  backButton.classList.add("back-button");
  contentContainer.appendChild(backButton);
  backButton.addEventListener("click", backButtonHandler);
}



function createNewCard(contentContainer) {
  const newCard = document.createElement("div");
  newCard.id = "newCardID";
  newCard.classList.add("card");
  newCard.classList.add("colorBlack");
  newCard.style.backgroundColor = 'rgba(0, 231, 255, 0.9)';
  newCard.classList.remove("active");
  newCard.style.animation = "none";
  contentContainer.appendChild(newCard);
  return newCard;
}



function createContentContainer() {
  const contentContainer = document.querySelector(".content");
  contentContainer.classList.add("open-stats"); // Füge die Klasse "open-stats" hinzu, um das Hintergrundbild zu entfernen
  contentContainer.classList.add("vh100");
  contentContainer.classList.add("displayFlex");
  contentContainer.innerHTML = "";
  return contentContainer;
}



function backButtonHandler() {
  const contentContainer = document.querySelector('.content');
  contentContainer.classList.remove('vh100');
  contentContainer.innerHTML = '';
  const pokemonDataInLocalStorage = localStorage.getItem('pokemonData');
  if (pokemonDataInLocalStorage) {
    const pokemonData = JSON.parse(pokemonDataInLocalStorage);
    displayPokemonImage(pokemonData, contentContainer);
  } else {
    fetchAndDisplayPokemonImage();    
  }    
  contentContainer.classList.remove('displayFlex'); // Entfernt die Klasse "displayFlex" vom Container "content"
  contentContainer.classList.remove('open-stats');  // Entfernt die Klasse "displayFlex" vom Container "content"
}



async function fetchAndDisplayPrices(id, newCard) {
  const prices = await fetchPrices(id);
  displayPrices(newCard, prices);
}



async function fetchPrices(id) {
  try {
    const data = await (await fetch(`https://api.pokemontcg.io/v2/cards/${id}`)).json();
    if (data?.data?.tcgplayer?.prices?.holofoil) {
      localStorage.setItem('pokemonPrices', JSON.stringify(data.data.tcgplayer.prices.holofoil));
      return data.data.tcgplayer.prices.holofoil;
    } else return null;
  } catch (error) {
    console.error('Error fetching prices:', error);
    return null;
  }
}



function displayPrices(newCard, prices) {
  if (prices) generatePrices(newCard, prices);
  else newCard.innerHTML = "<p>Prices not available for this Pokemon.</p>";
}



function generatePrices(newCard, prices) {
  generatePricesHTML(newCard, prices);
  checkPricesDirectLow(prices, newCard);  
  const canvas = createCanvas(newCard);  
  const chartData = LoadChartData(prices);  
  const chartOptions = loadChartOptions;  
  drawPricesChart(canvas, chartData, chartOptions);
}



function LoadChartData(prices) {
  return {
    labels: ['Low', 'Mid', 'High', 'Market'],
    datasets: [
      {
        label: 'Prices',
        data: [prices.low, prices.mid, prices.high, prices.market],
        backgroundColor: ['rgba(255, 99, 132, 0.9)', 'rgba(54, 162, 235, 0.9)', 'rgba(255, 206, 86, 0.9)', 'rgba(165, 42, 42, 0.9)'],
        borderColor: ['rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0, 0, 0)'],
        borderWidth: 1
      }
    ]
  };
}



function checkPricesDirectLow(prices, newCard) {
  if (prices.directLow !== null) {
    newCard.innerHTML += `<p>Direct Low: $${prices.directLow}</p>`;
  }
}



function createCanvas(newCard) {
  const canvas = document.createElement('canvas'); // Erstelle ein Canvas-Element für das Balkendiagramm
  canvas.width = 400; // Breite des Diagramms (kann angepasst werden)
  canvas.height = 200; // Höhe des Diagramms (kann angepasst werden)
  newCard.appendChild(canvas);
  return canvas;
}



function generatePricesHTML(newCard, prices) {
  newCard.innerHTML += `
    <h2>Prices:</h2>
    <p>Low: $${prices.low}</p>
    <p>Mid: $${prices.mid}</p>
    <p>High: $${prices.high}</p>
    <p>Market: $${prices.market}</p>
  `;
}



function drawPricesChart(canvas, chartData, chartOptions) {
  new Chart(canvas, {
    type: 'bar',
    data: chartData,
    options: chartOptions
  });
}



async function searchPokemon() {
  const searchInput = document.getElementById("searchInputID");
  const searchTerm = searchInput.value.toLowerCase().trim();
  const apiUrl = `https://api.pokemontcg.io/v2/cards?q=name:${searchTerm}`;
  loadingAnimation (); 
  await cheackIfPokemonFind(apiUrl);  
  stopLoadingAnimation()
}



async function cheackIfPokemonFind(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const foundPokemon = data.data[0]; // Wir nehmen das erste gefundene Pokémon, falls vorhanden
    if (foundPokemon) {
      displaySearchedPokemon(foundPokemon);
    } else { // Zeige eine Meldung, wenn das gesuchte Pokémon nicht gefunden wurde      
      alert("Pokémon not found!");
    }
  } catch (error) {    
    alert("Please insert Pokemon name here.");
  }
}



function displaySearchedPokemon(pokemon) {
  const enlargedCardContainer = createEnlargedContainerForSearchedPokemon();
  const enlargedCard = createLargedCardForSearchedPokemon(pokemon, enlargedCardContainer);
  const PricesButton = createPricesButtonForSearchedPokemon(enlargedCardContainer);
  checkPricesButtonClicked(PricesButton, pokemon);
  checkEnlargedContainerClicked(enlargedCardContainer, enlargedCard);
  document.querySelector("body").appendChild(enlargedCardContainer);
}



function checkEnlargedContainerClicked(enlargedCardContainer, enlargedCard) {
  enlargedCardContainer.addEventListener("click", (event) => {
    if (!enlargedCard.contains(event.target)) {
      enlargedCardContainer.remove();
    }
  });
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



function createLargedCardForSearchedPokemon(pokemon, enlargedCardContainer) {
  const enlargedCard = document.createElement("div");
  enlargedCard.classList.add("enlarged-card");
  enlargedCard.style.backgroundImage = `url(${pokemon.images.large})`;
  enlargedCardContainer.appendChild(enlargedCard);
  return enlargedCard;
}



function createEnlargedContainerForSearchedPokemon() {
  const enlargedCardContainer = document.createElement("div");
  enlargedCardContainer.classList.add("enlarged-card-container");
  enlargedCardContainer.classList.add("displayFlex");
  return enlargedCardContainer;
}



function loadingAnimation() {
  const searchButton = document.getElementById('search-buttonID');  
  if (!isLoading) {  // Überprüfe, ob die Animation bereits läuft, bevor sie gestartet wird
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