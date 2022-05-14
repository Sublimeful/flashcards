const path = require("path")
const fs = require("fs").promises;

let window_el = document.querySelector("#window")
let pages = path.resolve(path.join(__dirname, "pages"))
let welcome_page = path.resolve(path.join(pages, "welcome"))
let flashcards_page = path.resolve(path.join(pages, "flashcards"))
let library_page = path.resolve(path.join(pages, "library"))

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

async function load_page(page_path) {
  const html = await fs.readFile(page_path, "utf8")
  window_el.innerHTML = ''
  window_el.insertAdjacentHTML("beforeend", html);
  executeScriptElements(window_el);
}

async function load_welcome() {
  await load_page(path.resolve(path.join(welcome_page, "welcome.html")))
}

async function load_flashcards() {
  await load_page(path.resolve(path.join(flashcards_page, "flashcards.html")))
}

async function load_library() {
  await load_page(path.resolve(path.join(library_page, "library.html")))
}

load_welcome()

