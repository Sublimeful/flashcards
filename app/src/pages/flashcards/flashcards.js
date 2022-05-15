const home_directory = require("os").homedir();
const import_flashcards_btn = document.getElementById("import-flashcards-btn");
const create_btn = document.getElementById("create-btn");
const add_card_btn = document.getElementById("add-card-btn");
let card_num = document.getElementById("card-num");
let title_input = document.getElementById("title-input");
let term_input = document.getElementById("term-input");
let definition_input = document.getElementById("definition-input");
let card_entries = [];


console.log(import_flashcards_btn)

import_flashcards_btn.onclick = import_flashcards;
add_card_btn.onlick = add_flashcard;
create_btn.onlick = create_study_set;

function add_flashcard() {
  card_entries.push(
    {
      "term": term_input.value,
      "definition": definition_input.value
    }
  );

  term_input.value = "";
  definition_input.value = "";
  card_num.textContent = "Card " + card_entries.length;
}


function create_study_set() {
  
}


async function parse_flashcards_file(path_to_flashcards_file) {
  const data = await fs.readFile(path_to_flashcards_file, {encoding: 'utf8', flag: 'r'});

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
  console.log("OK")
  ipcRenderer.invoke("import_flashcards", home_directory);
}

ipcRenderer.on("import_flashcards", async (event, data) => {
  const canceled = data.canceled;
  const path = data.filePaths[0];

  if(canceled) return;

  // Flashcards importeR
  const fcs = await parse_flashcards_file(path);

  for (const [category, cards] of Object.entries(fcs)) {
    for(let card of cards) {
      if(!(category in flashcards)) {
        flashcards[category] = [];
      }

      flashcards[category].push(card);
    }
  }

  console.log(flashcards)
})


