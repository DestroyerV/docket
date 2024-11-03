// Generate a short UUID
function generateShortUUID() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Toggle notes color display
function toggleNotesColorDisplay() {
  const notesColor = document.querySelector(".notes-color");
  if (notesColor.classList.contains("show")) {
    notesColor.classList.remove("show");
    setTimeout(() => {
      notesColor.style.display = "none";
    }, 600);
  } else {
    notesColor.style.display = "block";
    setTimeout(() => {
      notesColor.classList.add("show");
    }, 10);
  }
}

// Add a new note
function addNoteHandler(event) {
  const button = event.target;
  const color = button.style.backgroundColor;
  const note = createNoteElement(color);
  const notesContainer = document.querySelector(".notes-container");
  notesContainer.insertBefore(note, notesContainer.firstChild);
}

// Create a new note element
function createNoteElement(
  color,
  text = "",
  id = generateShortUUID(),
  date = new Date()
) {
  const note = document.createElement("div");
  note.classList.add("note");
  note.id = id;
  note.innerHTML = text
    ? `
    <p class="note-text">${text}</p>
    <div class="note-footer">
      <p class="date">${new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}</p>
      <div class="edit-icon">
        <i class="fa-solid fa-pen" style="color: #fdfdfd"></i>
      </div>
    </div>`
    : `
    <textarea class="note-input" placeholder="Enter your note here"></textarea>
    <div class="note-footer">
      <div class="cancel-icon">
        <i class="fa-solid fa-x" style="color: #fdfdfd"></i>
      </div>
      <div class="save-icon">
        <i class="fa-solid fa-check" style="color: #fdfdfd"></i>
      </div>
    </div>`;
  note.style.backgroundColor = color;

  // Attach event listeners to the note
  if (text) {
    note
      .querySelector(".edit-icon")
      .addEventListener("click", editNoteHandler.bind(null, note));
  } else {
    note
      .querySelector(".save-icon")
      .addEventListener("click", saveNoteHandler.bind(null, note));
    note
      .querySelector(".cancel-icon")
      .addEventListener("click", cancelNoteHandler.bind(null, note));
  }

  return note;
}

// Save note handler
function saveNoteHandler(note) {
  const noteText = note.querySelector(".note-input").value;
  if (noteText.trim() === "") {
    alert("Please enter a note");
    return;
  }
  note.id = generateShortUUID();
  note.innerHTML = `
    <p class="note-text">${noteText}</p>
    <div class="note-footer">
      <p class="date">${new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}</p>
      <div class="edit-icon">
        <i class="fa-solid fa-pen" style="color: #fdfdfd"></i>
      </div>
    </div>`;
  note
    .querySelector(".edit-icon")
    .addEventListener("click", editNoteHandler.bind(null, note));
  saveNotesToLocalStorage();
}

// Cancel note handler
function cancelNoteHandler(note) {
  note.classList.add("deleting");
  setTimeout(() => {
    note.remove();
    saveNotesToLocalStorage();
  }, 300);
}

// Edit note handler
function editNoteHandler(note) {
  const noteText = note.querySelector(".note-text").innerText;
  note.innerHTML = `
    <textarea class="note-input">${noteText}</textarea>
    <div class="note-footer">
      <div class="cancel-icon">
        <i class="fa-solid fa-x" style="color: #fdfdfd"></i>
      </div>
      <div class="save-icon">
        <i class="fa-solid fa-check" style="color: #fdfdfd"></i>
      </div>
    </div>`;

  // Attach event listeners to the save and cancel icons
  note
    .querySelector(".save-icon")
    .addEventListener("click", saveNoteHandler.bind(null, note));
  note
    .querySelector(".cancel-icon")
    .addEventListener("click", cancelNoteHandler.bind(null, note));
}

// Save notes to local storage
function saveNotesToLocalStorage() {
  const notes = [];
  document.querySelectorAll(".note").forEach((note) => {
    const noteText = note.querySelector(".note-text")
      ? note.querySelector(".note-text").innerText
      : "";
    const noteColor = note.style.backgroundColor;
    const noteDate = note.querySelector(".date")
      ? note.querySelector(".date").innerText
      : new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
    notes.push({
      id: note.id,
      text: noteText,
      color: noteColor,
      date: noteDate,
    });
  });
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Load notes from local storage
function loadNotesFromLocalStorage() {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const notesContainer = document.querySelector(".notes-container");
  notes.forEach((noteData) => {
    const note = createNoteElement(
      noteData.color,
      noteData.text,
      noteData.id,
      noteData.date
    );
    notesContainer.appendChild(note);
  });
}

// Search notes
function searchNotes(event) {
  const searchQuery = event.target.value.toLowerCase();
  const notes = document.querySelectorAll(".note");
  notes.forEach((note) => {
    const noteText = note.querySelector(".note-text").innerText.toLowerCase();
    if (noteText.includes(searchQuery)) {
      note.style.display = "";
    } else {
      note.style.display = "none";
    }
  });
}

// Event listeners
document
  .querySelector(".add-icon")
  .addEventListener("click", toggleNotesColorDisplay);
document.querySelectorAll(".note-color").forEach((button) => {
  button.addEventListener("click", addNoteHandler);
});
document.querySelector(".search-box").addEventListener("input", searchNotes);

// Load notes on page load
document.addEventListener("DOMContentLoaded", loadNotesFromLocalStorage);
