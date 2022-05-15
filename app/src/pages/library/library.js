(function() {
	const back_btn = document.querySelector(".topnav img");
	let search_input = document.getElementById("search-input");
	let cards_div = document.getElementById("cards-div");

	back_btn.onclick = load_welcome;
	search_input.onkeyup = get_search_input;

	for (const [category, cards] of Object.entries(flashcards)) {
    let delete_btn = document.createElement("button")
    delete_btn.classList.add("button")
    delete_btn.classList.add("is-danger")
    delete_btn.style.float = "left"
    delete_btn.style.margin = "1%"

    let delete_btn_icon = document.createElement("i")
    delete_btn_icon.classList = "fa-solid fa-xmark"
    delete_btn_icon.style.color = "black"
    delete_btn_icon.style.transform = "scale(150%)"
    delete_btn.appendChild(delete_btn_icon)

    let edit_btn = document.createElement("button")
    edit_btn.classList.add("button")
    edit_btn.classList.add("is-warning")
    edit_btn.style.float = "left"
    edit_btn.style.margin = "1%"

    let edit_btn_icon = document.createElement("i")
    edit_btn_icon.classList = "fa-solid fa-pen-to-square"
    edit_btn_icon.style.color = "black"
    edit_btn.appendChild(edit_btn_icon)

    let card_div = document.createElement("div")
    card_div.classList.add("card-div")

    let card_btn = document.createElement("button")
    card_btn.classList.add("card")

    let category_h1 = document.createElement("h1")
    category_h1.textContent = category
    
    let card_number = document.createElement("p")
    card_number.textContent = cards.length

    card_div.appendChild(delete_btn)
    card_div.appendChild(edit_btn)
    card_btn.appendChild(category_h1)
    card_btn.appendChild(card_number)
    card_div.appendChild(card_btn)

    card_btn.onclick = () => start_studyset(category)
    delete_btn.onclick = () => {
      delete flashcards[category]
      card_div.remove()
    }
    edit_btn.onclick = e => {
      to_edit = {
        "category": category,
        "cards": flashcards[category]
      }

      load_flashcards()
    }

    cards_div.appendChild(card_div)
	}

	function get_search_input() {
		let card_list = document.getElementsByClassName("card-div");

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
