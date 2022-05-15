(function() {
  const import_flashcards_btn = document.getElementById("import-flashcards-btn");
  const create_btn = document.getElementById("create-btn");
  const create_card_btn = document.getElementById("create-card-btn");
  const card_number_el = document.getElementById("card-number");
  const term_input = document.getElementById("term-input");
  const definition_input = document.getElementById("definition-input");
  const back_btn = document.querySelector(".topnav img");
  const card_row = document.getElementById("card-row")

  let card_entries = [];
  let edit_mode = false;
  let event_emitter = document.createElement("div")

  if(to_edit != null) {
    const title_input = document.getElementById("title-input");

    title_input.value = to_edit["category"];
    card_entries = to_edit["cards"];

    for(let card_index = 0; card_index < card_entries.length; card_index++) {
      let card = card_entries[card_index]
      let card_div = card_row.querySelectorAll(".card")[card_index]
      let term_input = card_div.querySelector(".term-input")
      let definition_input = card_div.querySelector(".definition-input")

      term_input.value = card["term"]
      definition_input.value = card["definition"]

      if(card_index === card_entries.length - 1) break;

      create_flashcard()
    }

    title_input.disabled = true;
    to_edit = null;
    edit_mode = true;
  }

  import_flashcards_btn.onclick = import_flashcards;
  create_card_btn.onclick = create_flashcard;
  create_btn.onclick = create_study_set;
  back_btn.onclick = () => {
    event_emitter.removeAllListeners()
    load_welcome();
  }

  function export_flashcards(fcs, category, path) {
    fs.appendFileSync(path, category)
    for(let card of fcs) {
      fs.appendFileSync(path, "\n" + card["term"])
      fs.appendFileSync(path, "\n" + card["definition"])
    }
  }

  function add_flashcard(card, category) {
    if(!(category in flashcards)) {
      flashcards[category] = [];
    }

    flashcards[category].push(card);
  }

  function create_flashcard() {
    let card_column = document.createElement("div")
    card_column.classList.add("column")
    
    let card_div = document.createElement("div")
    card_div.classList.add("card")

    let card_top_div = document.createElement("div")
    card_top_div.classList.add("card-top")

    let card_number_h3 = document.createElement("h3")
    card_number_h3.classList.add("card-number")
    card_number_h3.textContent = `Card ${card_row.querySelectorAll(".card").length + 1}`

    let term_input = document.createElement("input")
    term_input.type = "text"
    term_input.placeholder = "Term"
    term_input.classList.add("term-input")

    let definition_input = document.createElement("input")
    definition_input.type = "text"
    definition_input.placeholder = "Definition"
    definition_input.classList.add("definition-input")

    card_div.appendChild(card_top_div)
    card_top_div.appendChild(card_number_h3)

    card_div.appendChild(term_input)
    card_div.appendChild(definition_input)

    card_column.appendChild(card_div)
    card_row.insertBefore(card_column, create_card_btn.parentNode)

    function edit() {
      if(!edit_mode || term_input.value.trim() === "") return;

      const title_input = document.getElementById("title-input");

      let card_list = []

      for(let card_el of card_row.querySelectorAll(".card")) {
        let term_input = card_el.querySelector(".term-input")
        let definition_input = card_el.querySelector(".definition-input")


        let term = term_input.value.trim()
        let definition = definition_input.value.trim()

        if(term === '' || definition === '') continue;

        let card = {
          "term": term,
          "definition": definition
        }

        card_list.push(card)
      }

      card_entries = card_list;
      flashcards[title_input.value] = card_list;
    }

    term_input.oninput = edit;
    definition_input.oninput = edit;

    return card_div;
  }

  function create_study_set() {
    const title_input = document.getElementById("title-input");

    let category = title_input.value.trim()
    if(category === '') {
      ipcRenderer.invoke("notify", "Please add a title!", "");
      return;
    }

    if(!edit_mode) {
      card_entries = []

      for(let card_el of card_row.querySelectorAll(".card")) {
        let term_input = card_el.querySelector(".term-input")
        let definition_input = card_el.querySelector(".definition-input")


        let term = term_input.value.trim()
        let definition = definition_input.value.trim()

        if(term === '' || definition === '') continue;

        let card = {
          "term": term,
          "definition": definition
        }

        card_entries.push(card)
        add_flashcard(card, category)
      }
    }
    
    ipcRenderer.invoke("export_flashcards", home_directory);
  }

  function parse_flashcards_file(path_to_flashcards_file) {
    const data = fs.readFileSync(path_to_flashcards_file, {encoding: 'utf8', flag: 'r'});

    let category = null;
    let fcs = {}
    let card = {}

    for(let line of data.split("\n").map(l => l.trim())) {
      if(category === null) {
        category = line;
        continue;
      }

      if("term" in card && "definition" in card) {
        fcs[category].push(card)
        card = {}
      }

      if(line === "") {
        category = null;
        continue;
      }

      if(!(category in fcs)) {
        fcs[category] = []
      }

      if(!("term" in card)) {
        card["term"] = line;
        continue;
      }

      if(!("definition" in card)) {
        card["definition"] = line;
        continue;
      }
    }

    if("term" in card && "definition" in card) {
      fcs[category].push(card)
      card = {}
    }

    return fcs;
  }

  function import_flashcards() {
    ipcRenderer.invoke("import_flashcards", home_directory);
  }

  event_emitter = ipcRenderer.on("import_flashcards", (event, data) => {
    const canceled = data.canceled;
    const path = data.filePaths[0];

    if(canceled) return;

    // Flashcards importeR
    const fcs = parse_flashcards_file(path);

    for (const [category, cards] of Object.entries(fcs)) {
      for(let card of cards) {
        add_flashcard(card, category);
      }
    }
  })

  event_emitter = ipcRenderer.on("export_flashcards", (event, data) => {
    const title_input = document.getElementById("title-input");

    const canceled = data.canceled;
    const path = data.filePath;

    if(canceled) return;

    // If title is empty
    let category = title_input.value.trim();
    console.log(category)
    console.log(title_input)
    if(category === '') {
      ipcRenderer.invoke("notify", "Please add a title!", "");
      return;
    }

    // Clear or make file
    fs.writeFileSync(path, '');

    // Export
    export_flashcards(card_entries, category, path);
  })
})();
