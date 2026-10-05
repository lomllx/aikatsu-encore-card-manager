let cards = [];

let ownedCards =
  JSON.parse(
    localStorage.getItem("aikatsuOwned") || "{}"
  );

let currentFilter = "all";


async function loadCards() {

  try {

    const response =
      await fetch("cards.json");

    cards =
      await response.json();

    renderCards();
    updateStatus();

  } catch (error) {

    console.error(error);

    document.getElementById("cards").innerHTML =
      "<p>カードデータを読み込めませんでした。</p>";

  }

}


function renderCards() {

  const container =
    document.getElementById("cards");

  const search =
    document
      .getElementById("search")
      .value
      .toLowerCase();

  container.innerHTML = "";


  const filteredCards =
    cards.filter(card => {

      const matchesSearch =
        card.name
          .toLowerCase()
          .includes(search);


      const isOwned =
        !!ownedCards[card.id];


      const matchesFilter =
        currentFilter === "all" ||
        (currentFilter === "owned" && isOwned) ||
        (currentFilter === "missing" && !isOwned);


      return matchesSearch && matchesFilter;

    });


  filteredCards.forEach(card => {

    const div =
      document.createElement("div");

    div.className = "card";


    if (ownedCards[card.id]) {

      div.classList.add("owned");

    }


    div.innerHTML = `

      <img
        class="card-image"
        src="${card.image}"
        alt="${card.name}"
      >

      <div class="card-name">
        ${card.name}
      </div>

      <div class="card-info">
        ${card.brand || ""}
        ${card.rarity ? " ・ " + card.rarity : ""}
      </div>

      <button class="own-button">

        ${
          ownedCards[card.id]
            ? "♡ 所持中"
            : "☆ 未所持"
        }

      </button>

    `;


    div
      .querySelector(".own-button")
      .addEventListener("click", () => {

        if (ownedCards[card.id]) {

          delete ownedCards[card.id];

        } else {

          ownedCards[card.id] = true;

        }


        localStorage.setItem(
          "aikatsuOwned",
          JSON.stringify(ownedCards)
        );


        renderCards();
        updateStatus();

      });


    container.appendChild(div);

  });

}


function updateStatus() {

  const total =
    cards.length;


  const owned =
    Object.keys(ownedCards)
      .filter(id =>
        cards.some(card => card.id === id)
      )
      .length;


  const missing =
    total - owned;


  const percentage =
    total === 0
      ? 0
      : Math.round((owned / total) * 100);


  document.getElementById("total")
    .textContent = total;


  document.getElementById("owned")
    .textContent = owned;


  document.getElementById("ownedDetail")
    .textContent = owned;


  document.getElementById("missing")
    .textContent = missing;


  document.getElementById("percentage")
    .textContent = percentage;


  document.getElementById("progressBar")
    .style.width = percentage + "%";

}


document
  .getElementById("search")
  .addEventListener(
    "input",
    renderCards
  );


document
  .querySelectorAll(".filter-button")
  .forEach(button => {

    button.addEventListener("click", () => {

      document
        .querySelectorAll(".filter-button")
        .forEach(b =>
          b.classList.remove("active")
        );


      button.classList.add("active");


      currentFilter =
        button.dataset.filter;


      renderCards();

    });

  });


loadCards();
