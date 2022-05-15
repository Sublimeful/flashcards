(function() {
  const create_flashcard_btn = document.getElementById("create-flashcard-btn")
  const my_library_btn = document.getElementById("my-library-btn")
  const flashcard_front = document.getElementById("flashcard-front")
  const flashcard_back = document.getElementById("flashcard-back")
  const next_card_btn = document.getElementById("next-card-btn")
  const progress_text = document.getElementById("progress-text")
  const progress_bar = document.getElementById("progress-bar")

  create_flashcard_btn.onclick = function() {
    load_flashcards()
  }

  my_library_btn.onclick = function() {
    load_library()
  }

  function shuffle_studyset() {
    function shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    shuffle(studyset)
  }

  function clear_flashcard() {
    for(let i = flashcard_front.children.length - 1; i >= 0; i--) {
      flashcard_front.children[i].remove()
    }
    for(let i = flashcard_back.children.length - 1; i >= 0; i--) {
      flashcard_back.children[i].remove()
    }
  }

  function display_flashcard(card) {
    // Clear children
    clear_flashcard()

    let term = card["term"]
    let definition = card["definition"]

    let term_el = document.createElement("p")
    term_el.textContent = term;

    let definition_el = document.createElement("p")
    definition_el.textContent = definition;

    flashcard_back.appendChild(definition_el);
    flashcard_front.appendChild(term_el);
  }

  function set_progess(prog) {
    progress_text.textContent = `${prog}/${studyset.length}`
    progress_bar.style.width = `${prog/studyset.length * 100}%`
  }

  if(studyset !== null) {
    if(studyset.length === 0) {
      return
    }

    shuffle_studyset()

    let curr_flashcard = 0;
    set_progess(1)
    next_card_btn.textContent = "Next Card"

    if(studyset.length === 1) {
      next_card_btn.textContent = "Done"
    }

    function next_card() {
      if(curr_flashcard + 1 === studyset.length) {
        return;
      }

      curr_flashcard++;

      if(curr_flashcard + 1 === studyset.length) {
        next_card_btn.textContent = "Done"
      }

      display_flashcard(studyset[curr_flashcard])
      set_progess(curr_flashcard + 1)
    }

    display_flashcard(studyset[curr_flashcard])

    next_card_btn.onclick = next_card;
  }
})();
