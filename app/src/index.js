const { ipcRenderer } = require("electron");
const { app } = require('electron');

const path = require("path")
const fs = require("fs");

let window_el = document.querySelector("#window")
let pages = path.resolve(path.join(__dirname, "pages"))
let welcome_page = path.resolve(path.join(pages, "welcome"))
let flashcards_page = path.resolve(path.join(pages, "flashcards"))
let library_page = path.resolve(path.join(pages, "library"))
let flashcards = {
}

let welcome_page_loaded = false;
let flashcards_page_loaded = false;
let library_page_loaded = false;

// flashcards variables
const home_directory = require("os").homedir();

let flashcards = {}

function executeScriptElements(containerElement) {
  const scriptElements = containerElement.querySelectorAll("script");

  Array.from(scriptElements).forEach((scriptElement) => {
    const clonedElement = document.createElement("script");

    Array.from(scriptElement.attributes).forEach((attribute) => {
      clonedElement.setAttribute(attribute.name, attribute.value);
    });
    
    clonedElement.text = scriptElement.text;

    scriptElement.parentNode.replaceChild(clonedElement, scriptElement);
  });
}

function load_page(page_path) {
  const html = fs.readFileSync(page_path, "utf8")
  window_el.innerHTML = ''
  window_el.insertAdjacentHTML("beforeend", html);
  executeScriptElements(window_el);
}

function load_welcome() {
  load_page(path.resolve(path.join(welcome_page, "welcome.html")))
  welcome_page_loaded = true;
}

function load_flashcards() {
  load_page(path.resolve(path.join(flashcards_page, "flashcards.html")))
  flashcards_page_loaded = true;
}

function load_library() {
  load_page(path.resolve(path.join(library_page, "library.html")))
  library_page_loaded = true;
}

(async () => {
  let appdata = path.resolve(path.join((await ipcRenderer.invoke("get_appdata")), "karta"))
  let flashcards_loc = path.resolve(path.join(appdata, "flashcards.cards"))

  if(!fs.existsSync(appdata)) fs.mkdirSync(appdata)
  if(!fs.existsSync(flashcards_loc)) fs.writeFileSync(flashcards_loc, "")

  load_welcome()
  //load_flashcards()
})();

