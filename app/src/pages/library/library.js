(function() {
	const back_btn = document.querySelector(".topnav img");
	let search_input = document.getElementById("search-input");
	let cards_div = document.getElementById("cards-div");

	back_btn.onclick = load_welcome;
	search_input.onkeyup = get_search_input;

	for (const [category, cards] of Object.entries(flashcards)) {
		cards_div.innerHTML += `
			<button class="card">
		      <h2>${category}</h2>
		      <p>${cards.length} cards</p>
		    </button>
		`
		console.log(category);
		console.log(cards.length)
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
})();
