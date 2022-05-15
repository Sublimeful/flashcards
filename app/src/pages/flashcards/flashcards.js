(function() {
  const import_flashcards_btn = document.getElementById("import-flashcards-btn");
  const create_btn = document.getElementById("create-btn");
  const create_card_btn = document.getElementById("create-card-btn");
  const card_number_el = document.getElementById("card-number");
  const title_input = document.getElementById("title-input");
  const term_input = document.getElementById("term-input");
  const definition_input = document.getElementById("definition-input");
  const back_btn = document.querySelector(".topnav img")
  let card_entries = [];

  import_flashcards_btn.onclick = import_flashcards;
  create_card_btn.onclick = create_flashcard;
  create_btn.onclick = create_study_set;
  back_btn.onclick = load_welcome;

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
    card_entries.push(
      {
        "term": term_input.value,
        "definition": definition_input.value
      }
    );

    term_input.value = "";
    definition_input.value = "";
    card_number_el.textContent = "Card " + (card_entries.length + 1);
  }

  function create_study_set() {
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

  ipcRenderer.on("import_flashcards", (event, data) => {
    const canceled = data.canceled;
    const path = data.filePaths[0];

    if(canceled) return;

    // Flashcards importeR
    const fcs = parse_flashcards_file(path);

<<<<<<< HEAD
    for (const [category, cards] of Object.entries(fcs)) {
      for(let card of cards) {
        add_flashcard(card, category);
      }
=======
  if(canceled) return;

  // Flashcards imported
  const fcs = parse_flashcards_file(path);

  for (const [category, cards] of Object.entries(fcs)) {
    for(let card of cards) {
      add_flashcard(card, category);
>>>>>>> 8fc30ae795b1103f7de44925a9719f345ab54efc
    }
  })

  ipcRenderer.on("export_flashcards", (event, data) => {
    const canceled = data.canceled;
    const path = data.filePath;

<<<<<<< HEAD
    if(canceled) return;

    // Clear or make file
    fs.writeFileSync(path, '');

    let category = title_input.value;
    export_flashcards(card_entries, category, path);
  })
})();
=======
  if(canceled) return;

  // Clear or make file
  fs.writeFileSync(path, '');

  let category = title_input.value;
  export_flashcards(card_entries, category, path);
})
>>>>>>> 8fc30ae795b1103f7de44925a9719f345ab54efc
