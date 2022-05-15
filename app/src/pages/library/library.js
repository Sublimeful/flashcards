(function() {
	const back_btn = document.querySelector(".topnav img");
	let search_input = document.getElementById("search-input");

	back_btn.onclick = load_welcome;
	search_input.onkeyup = get_search_input;

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
