let container = document.querySelector(".container");
let filterByType = document.querySelector("#filterByType");
let searchBox = document.querySelector("#searchBox");
let loadMoreBtn = document.querySelector("#loadmore");

let pokemons = [];
let allPokemons = [];
let limit = 20;
let offset = 0;

// let url = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";
let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
let typeUrl = "https://pokeapi.co/api/v2/type/";

filterByType.addEventListener("change", filterPokemons);
searchBox.addEventListener("input", searchPokemons);

async function fetchData(url) {
  let response = await fetch(url);
  let result = await response.json();
  return result;
}

window.addEventListener("load", async () => {
  const types = await fetchData(typeUrl);
  console.log(types.results);
  addTypeOption(types.results);

  let res = await fetchData(url);
  let results = res.results;

  let promises = [];

  for (let i = 0; i < results.length; i++) {
    let uri = results[i].url;
    // console.log(uri);
    let promise = fetch(uri).then((r) => r.json());
    promises.push(promise);
  }
  console.log(promises);
  showData(promises);
});

async function showData(promisesOrPokemons) {
  // This check was used to handle both cases: when data came as Promises (from API) or as already resolved Pokémon objects (from filter/search).
  if (promisesOrPokemons[0] && promisesOrPokemons[0].name) {
    pokemons = promisesOrPokemons;
  } else {
    pokemons = await Promise.all(promisesOrPokemons);
  }
  // pokemons = await Promise.all(promisesOrPokemons);
  console.log("Currently showing:", pokemons);
  if (allPokemons.length === 0 || pokemons.length > allPokemons.length) {
    allPokemons = pokemons;
  }

  container.innerHTML = "";
  for (let i = 0; i < allPokemons.length; i++) {
    let flipCard = document.createElement("div");
    flipCard.classList.add("flip-card");

    let flipCardInner = document.createElement("div");
    flipCardInner.classList.add("flip-card-inner");

    let flipCardFront = document.createElement("div");
    flipCardFront.classList.add("flip-card-front");

    let img = document.createElement("img");
    let para1 = document.createElement("p");
    para1.classList.add("pokemon-name");

    let para2 = document.createElement("p");
    para2.classList.add("pokemon-type");
    let para3 = document.createElement("p");
    para3.classList.add("pokemon-type");

    let flipCardBack = document.createElement("div");
    flipCardBack.classList.add("flip-card-back");

    let height = document.createElement("p");
    let weight = document.createElement("p");
    let hp = document.createElement("p");
    let attack = document.createElement("p");
    let defense = document.createElement("p");
    let specialAttack = document.createElement("p");
    let specialDefense = document.createElement("p");
    let speed = document.createElement("p");

    para1.innerText = pokemons[i].name;
    let typeContainer = document.createElement("div");
    typeContainer.classList.add("pokemon-types");

    pokemons[i].types.forEach((t) => {
      let typeP = document.createElement("p");
      typeP.classList.add("pokemon-type", t.type.name);
      typeP.innerText = t.type.name;
      typeContainer.append(typeP);
    });

    img.src = pokemons[i].sprites.other.dream_world.front_default;
    height.innerText = "Height: " + pokemons[i].height + "cm";
    weight.innerText = "Weight: " + pokemons[i].weight + "kg";
    hp.innerText = "hp: " + pokemons[i].stats[0].base_stat;
    attack.innerText = "attack: " + pokemons[i].stats[1].base_stat;
    defense.innerText = "defense: " + pokemons[i].stats[2].base_stat;
    specialAttack.innerText =
      "special-attack: " + pokemons[i].stats[3].base_stat;
    specialDefense.innerText =
      "special-defense: " + pokemons[i].stats[4].base_stat;
    speed.innerText = "speed: " + pokemons[i].stats[5].base_stat;

    flipCardFront.append(img, para1, typeContainer);
    flipCardBack.append(
      height,
      weight,
      hp,
      attack,
      defense,
      specialAttack,
      specialDefense,
      speed
    );
    flipCardInner.append(flipCardFront, flipCardBack);
    flipCard.append(flipCardInner);
    container.append(flipCard);
  }
}

function addTypeOption(arr) {
  arr.forEach((obj) => {
    if (obj.name !== "unknown") {
      const option = document.createElement("option");
      option.value = obj.name;
      option.innerText = obj.name;
      filterByType.append(option);
    }
  });
}

// function filterPokemons(e) {
//   let selectedType = e.target.value;
//   let matched = [];

//   if (selectedType === "all") {
//     showData(allPokemons); // reset to all
//     return;
//   }

//   for (let i = 0; i < allPokemons.length; i++) {
//     let pokemon = allPokemons[i];

//     for (let j = 0; j < pokemon.types.length; j++) {
//       let typeName = pokemon.types[j].type.name;

//       if (typeName === selectedType) {
//         matched.push(pokemon);
//         break;
//       }
//     }
//   }

//   showData(matched);
// }

function filterPokemons(e) {
  if (e.target.value === "" || e.target.value === "all") {
    showData(allPokemons);
    return;
  }

  const matchedPokemons = allPokemons.filter((object) => {
    return object.types.find((obj) => obj.type.name.includes(e.target.value));
  });

  if (matchedPokemons.length === 0) {
    container.innerHTML = "<p>No Pokémon Found</p>";
  } else {
    showData(matchedPokemons);
  }
}

function searchPokemons(e) {
  let text = e.target.value.toLowerCase();

  if (text === "") {
    showData(allPokemons);
    return;
  }

  const matched = allPokemons.filter((pokemon) => {
    return pokemon.name.includes(text);
  });

  if (matched.length === 0) {
    container.innerHTML = "<p>No Pokémon Found</p>";
  } else {
    showData(matched);
  }
}

loadMoreBtn.addEventListener("click", async () => {
  offset += limit;
  let res = await fetchData(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );
  let results = res.results;

  let promises = results.map((r) => fetch(r.url).then((d) => d.json()));
  let newPokemons = await Promise.all(promises);

  allPokemons = [...allPokemons, ...newPokemons];

  appendData(newPokemons);
});

function appendData(pokemons) {
  console.log("Currently showing:", pokemons);
  for (let i = 0; i < pokemons.length; i++) {
    let flipCard = document.createElement("div");
    flipCard.classList.add("flip-card");

    let flipCardInner = document.createElement("div");
    flipCardInner.classList.add("flip-card-inner");

    let flipCardFront = document.createElement("div");
    flipCardFront.classList.add("flip-card-front");

    let img = document.createElement("img");
    let para1 = document.createElement("p");
    para1.classList.add("pokemon-name");

    let para2 = document.createElement("p");
    para2.classList.add("pokemon-type");
    let para3 = document.createElement("p");
    para3.classList.add("pokemon-type");

    let flipCardBack = document.createElement("div");
    flipCardBack.classList.add("flip-card-back");

    let height = document.createElement("p");
    let weight = document.createElement("p");
    let hp = document.createElement("p");
    let attack = document.createElement("p");
    let defense = document.createElement("p");
    let specialAttack = document.createElement("p");
    let specialDefense = document.createElement("p");
    let speed = document.createElement("p");

    para1.innerText = pokemons[i].name;
    let typeContainer = document.createElement("div");
    typeContainer.classList.add("pokemon-types");

    pokemons[i].types.forEach((t) => {
      let typeP = document.createElement("p");
      typeP.classList.add("pokemon-type", t.type.name);
      typeP.innerText = t.type.name;
      typeContainer.append(typeP);
    });

    img.src = pokemons[i].sprites.other.dream_world.front_default;
    height.innerText = "Height: " + pokemons[i].height + "cm";
    weight.innerText = "Weight: " + pokemons[i].weight + "kg";
    hp.innerText = "hp: " + pokemons[i].stats[0].base_stat;
    attack.innerText = "attack: " + pokemons[i].stats[1].base_stat;
    defense.innerText = "defense: " + pokemons[i].stats[2].base_stat;
    specialAttack.innerText =
      "special-attack: " + pokemons[i].stats[3].base_stat;
    specialDefense.innerText =
      "special-defense: " + pokemons[i].stats[4].base_stat;
    speed.innerText = "speed: " + pokemons[i].stats[5].base_stat;

    flipCardFront.append(img, para1, typeContainer);
    flipCardBack.append(
      height,
      weight,
      hp,
      attack,
      defense,
      specialAttack,
      specialDefense,
      speed
    );
    flipCardInner.append(flipCardFront, flipCardBack);
    flipCard.append(flipCardInner);
    container.append(flipCard);
  }
}
