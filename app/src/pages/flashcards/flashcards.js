const home_directory = require("os").homedir();
const import_flashcards_btn = document.getElementById("import-flashcards-btn");
console.log(import_flashcards_btn)

import_flashcards_btn.onclick = import_flashcards;

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
