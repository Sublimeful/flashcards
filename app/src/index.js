const path = require("path")
const fs = require("fs");

let window_el = document.querySelector("#window")
let pages = path.resolve(path.join(__dirname, "pages"))
let welcome_page = path.resolve(path.join(pages, "welcome"))

function load_welcome() {
  fs.readFile(path.resolve(path.join(welcome_page, "welcome.html")), "utf8", (err, data) => {
    window_el.innerHTML = ''
    console.log(data)
    window_el.innerHTML = data
  })
}

load_welcome()
