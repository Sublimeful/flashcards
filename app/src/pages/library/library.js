(function() {
	const back_btn = document.querySelector(".topnav img");
	let search_input = document.getElementById("search-input");
	let cards_div = document.getElementById("cards-div");

	back_btn.onclick = load_welcome;
	search_input.onkeyup = get_search_input;

	for (const [category, cards] of Object.entries(flashcards)) {
    let cards_btn = document.createElement("button")
    cards_btn.classList.add("card")

    let category_h1 = document.createElement("h1")
    category_h1.textContent = category
    
    let cards_number = document.createElement("p")
    cards_number.textContent = cards.length
    
    cards_btn.appendChild(category_h1)
    cards_btn.appendChild(cards_number)
    cards_div.appendChild(cards_btn)

    cards_btn.onclick = () => start_studyset(category)
	}

	function get_search_input() {
		let card_list = document.getElementsByClassName("card");

		for (let card of card_list) {
			if (!card.innerText.toLowerCase().includes(search_input.value.toLowerCase())) {
				card.style.display = "none";
			}else {
				card.style.display = "block";
			}
		}
	}

  function start_studyset(category) {
    studyset = flashcards[category]
    load_welcome()
  }
})();
