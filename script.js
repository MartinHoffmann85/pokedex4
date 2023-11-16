let clickedPokemonID = null;  // clicked Pokemon ID
let isLoading = false;
let startIndex = 0;  // Startindex for loaded Pokemons
let endIndex = 100;   // Endindex for loaded Pokemons

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
  const minimumDuration = 7000; // 7 seconds in milliseconds, Set a minimum duration of 7 seconds
  await fetchPokemonJsonFromUrl(); // Fetch 100 Pokémon data
  setTimeout(() => {
    loadingScreen.style.display = 'none'; // Hide the loading screen once the content is ready
  }, minimumDuration);
}

async function fetchAndDisplayPokemonImage() {  // Function to fetch Pokemon data from the API and display cards with images  
  const pokemonDataInLocalStorage = localStorage.getItem('pokemonData'); // Check if the Pokemon data is already available in the LocalStorage
  if (pokemonDataInLocalStorage) {  // If the data is already available in the LocalStorage, retrieve and display it    
    const pokemonData = JSON.parse(pokemonDataInLocalStorage);
    const cardsContainer = document.querySelector('.content');
    displayPokemonImages(pokemonData, cardsContainer);
  } else {  // If the data is not available in the LocalStorage, fetch it from the API    
    await fetchPokemonJsonFromUrl();
  }
}

async function fetchPokemonJsonFromUrl() {
  const apiUrl = 'https://api.pokemontcg.io/v2/cards';
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const pokemonData = data.data.slice(startIndex, endIndex);  // Load the first 100 Pokémon
    localStorage.setItem('pokemonData', JSON.stringify(pokemonData)); // Save the Pokemon-Data in LocalStorage
    const cardsContainer = document.querySelector('.content'); // Manipulate the 'content' to show the Pokemon Cards
    displayPokemonImages(pokemonData, cardsContainer); // Render 100 Pokemon
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function displayPokemonImages(pokemonData, cardsContainer) { // Display the Pokemon image and handle the click, add vanillatilt function
  pokemonData.forEach((pokemon) => {
    const card = document.createElement('div');
    card.classList.add("card");
    card.style.backgroundImage = `url(${pokemon.images.large})`;  
    card.dataset.pokemonId = pokemon.id; // Add the Pokemon ID to the card's dataset
    card.addEventListener("click", () => {
      handleCardClick(card);
    });
    cardsContainer.appendChild(card);
    vanillaTiltFunction(card);
  });
}

async function loadMorePokemons() {
  loadingAnimationMorePokemon();
  const apiUrl = 'https://api.pokemontcg.io/v2/cards';    
  const response = await fetch(apiUrl);
  const data = await response.json();
  const morePokemonData = data.data.slice(endIndex, endIndex + 10);  // Load 10 more Pokémon
  endIndex += 10;  // Update the endIndex for the next load
  const cardsContainer = document.querySelector('.content');
  displayPokemonImages(morePokemonData, cardsContainer);
  stopLoadingAnimationMorePokemon();
}

function vanillaTiltFunction(card) {
  VanillaTilt.init(card, {
    max: 25,
    speed: 400,
    glare: true,
    "max-glare": 0.5,
  });
}

function handleCardClick(card) {
  clickedPokemonID = card.dataset.pokemonId; // Store the clicked Pokemon ID in the global variable
  const { enlargedCardContainer, enlargedCard } = createEnlargedContainer(card);
  createButtonsAndHandleClick(enlargedCardContainer);
  enlargedCardContainer.addEventListener("click", (event) => {
    if (!enlargedCard.contains(event.target)) {
      enlargedCardContainer.remove();
    }
  });  
  document.querySelector("body").appendChild(enlargedCardContainer);
}

function createButtonsAndHandleClick(enlargedCardContainer) {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container"); // Fügen Sie eine CSS-Klasse für das Flexbox-Layout hinzu
  const previousButton = createPreviousButton(buttonContainer);
  const pricesButton = createPricesButton(buttonContainer);  
  const nextButton = createNextButton(buttonContainer);
  enlargedCardContainer.appendChild(buttonContainer);
  let nextButtonClicked = false;
  let pricesButtonClicked = false;
  let previousButtonClicked = false;
  pricesButtonClicked = checkStatsButtonClicked(pricesButton, pricesButtonClicked);
  previousButtonClicked = checkPreviousButtonClicked(previousButton, previousButtonClicked);
  nextButtonClicked = checkNextButtonClicked(nextButton, nextButtonClicked);
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

function checkPreviousButtonClicked(previousButton, previousButtonClicked) {
  previousButton.addEventListener("click", () => {
    if (!previousButtonClicked) {
      previousButtonClicked = true;
      showPreviousPokemonSingleCard();
    }
  });
  return previousButtonClicked;
}

function checkNextButtonClicked(nextButton, nextButtonClicked) {
  nextButton.addEventListener("click", () => {
    if (!nextButtonClicked) {
      nextButtonClicked = true;
      showNextPokemonSingleCard();
    }
  });
  return nextButtonClicked;
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

function createPreviousButton(enlargedCardContainer) {
  const previousButton = document.createElement("button");
  previousButton.innerText = "<";
  previousButton.classList.add("prices-button");
  enlargedCardContainer.appendChild(previousButton);
  return previousButton;
}

function createNextButton(enlargedCardContainer) {
  const nextButton = document.createElement("button");
  nextButton.innerText = ">";
  nextButton.classList.add("prices-button");  
  enlargedCardContainer.appendChild(nextButton);
  return nextButton;
}

function openPrices() {
  const contentContainer = createContentContainer();
  const newCard = createNewCard(contentContainer); 
  createBackButton(contentContainer);
  fetchAndDisplayPrices(clickedPokemonID, newCard); // Here, the function is called to retrieve and display the prices
}

function createBackButton(contentContainer) {
  const backButton = document.createElement("button");
  backButton.innerText = "Back";
  backButton.classList.add("back-button");
  contentContainer.appendChild(backButton);
  backButton.addEventListener("click", backButtonHandler);  
  return contentContainer;
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
  contentContainer.classList.add("open-stats"); // Add the class "open-stats" to remove the background image
  contentContainer.classList.add("v65");
  contentContainer.classList.add("displayFlex");
  contentContainer.innerHTML = "";
  return contentContainer;
}

function backButtonHandler() {
  const contentContainer = document.querySelector('.content');  
  const morePokemonsButton = document.getElementById('morePokemonsID');  // Sichtbarkeit des Buttons mit der ID "morePokemonsID" ändern
  if (morePokemonsButton) {
    morePokemonsButton.style.display = 'inline-block'; // oder 'inline', 'inline-block', je nach Bedarf
  }  
  contentContainer.innerHTML = '';
  contentContainer.classList.remove('vh65');    
  contentContainer.classList.remove('displayFlex'); // Remove the class "displayFlex" from the container "content."
  contentContainer.classList.remove('open-stats');  // Remove the class "open-stats" from the container "content."
  ifPokemonDataInLocalSorage(contentContainer);
}



function ifPokemonDataInLocalSorage(contentContainer) {
  const pokemonDataInLocalStorage = localStorage.getItem('pokemonData');
  if (pokemonDataInLocalStorage) {
    const pokemonData = JSON.parse(pokemonDataInLocalStorage);
    displayPokemonImages(pokemonData, contentContainer);
  } else {
    fetchAndDisplayPokemonImage();
  }
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
  const canvas = document.createElement('canvas'); // Create a canvas element for the bar chart
  canvas.width = 400; // Width of the chart
  canvas.height = 200; // height of the chart
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

function setupSearch() {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInputID");

  // Funktion für die Suche nach Pokemon
  async function searchPokemon() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm.length < 3) {
      alert("Der Suchbegriff muss mindestens 3 Zeichen lang sein.");
      return;
    }

    const apiUrl = `https://api.pokemontcg.io/v2/cards?q=name:*${searchTerm}*`;
    loadingAnimation();
    await cheackIfPokemonFind(apiUrl);
    stopLoadingAnimation();
  }

  // Event-Listener für das Absenden des Formulars
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Verhindere das Standardverhalten des Formulars (z. B. Neuladen der Seite)
    searchPokemon();
  });
}

async function cheackIfPokemonFind(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const foundPokemonList = data.data; // Eine Liste aller gefundenen Pokémon
    if (foundPokemonList && foundPokemonList.length > 0) {
      displaySearchedPokemons(foundPokemonList);
    } else {
      alert("Pokémon not found!");
    }
  } catch (error) {
    alert("Please insert Pokemon name here.");
  }
}

function displaySearchedPokemons(foundPokemonList) {
  const cardsContainer = document.querySelector('.content');
  forEachSearchedPokemon(cardsContainer, foundPokemonList);  
  const backButtonContainer = createBackButton(document.createElement('div')); // Add the back button at the end  
    cardsContainer.appendChild(backButtonContainer);    
    const backButton = backButtonContainer.querySelector('.back-button');  // Get the Back-Button at the Container and set the class with Margin
    backButton.classList.add('back-button-with-margin');  
  const morePokemonsButton = document.getElementById('morePokemonsID');  // Hide the Button with ID "morePokemonsID"
  if (morePokemonsButton) {
    morePokemonsButton.style.display = 'none';
  }
    stopLoadingAnimation();
  }


function forEachSearchedPokemon(cardsContainer, foundPokemonList) {
  cardsContainer.innerHTML = ''; // Clear the container to display the new results
  foundPokemonList.forEach((pokemon) => {
    const card = document.createElement('div');
    card.classList.add("card");
    card.style.backgroundImage = `url(${pokemon.images.large})`;
    card.dataset.pokemonId = pokemon.id; // Add the Pokemon ID to the card's dataset
    card.addEventListener("click", () => {
      handleCardClick(card);
    });
    cardsContainer.appendChild(card);
    vanillaTiltFunction(card);
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



