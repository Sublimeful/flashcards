const create_flashcard_btn = document.getElementById("create-flashcard-btn")
const my_library_btn = document.getElementById("my-library-btn")

create_flashcard_btn.onclick = function() {
  console.log("Clicked")
  load_flashcards()
}

my_library_btn.onclick = function() {
  console.log("Clicked")
  load_library()
}
