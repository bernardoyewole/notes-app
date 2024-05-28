'use strict';

import { onEvent, select, selectAll, create, print } from "./utils.js";

import { Note } from "./Note.js";

const createNote = select('.fa-pen-to-square');
const deleteNote = select('.fa-trash-can');
const categories = selectAll('.note-categories-flex');
const noteListContainer = select('.note-list');
const noteContent = select('.note-content');
const noteDateInfo = select('.note-date-info');
const noteTitleInfo = select('.note-title-info');
const noteContentInfo = select('.note-content-info');
const inputContainer = select('.input-container');
const inputNoteTitle = select('.input-note-title');
const inputNoteDescrip = select('.input-note-description');
const cancelBtn = select('.cancel-btn');
const saveBtn = select('.save-btn');

onEvent('load', window, () => {
    noteContent.style.display = 'none';
    updateNoteList();
    updateCategories();
});

onEvent('click', createNote, () => {
    noteContent.style.display = 'none';
    inputContainer.style.display = 'block';
});

onEvent('click', deleteNote, () => {

});

categories.forEach(category => {
    onEvent('click', category, () => {
        // remove 'selected-category' class from all categories
        categories.forEach(category => {
            category.classList.remove('selected-category');
        });

        // add 'selected-category' class to the clicked category
        category.classList.add('selected-category');
        noteListContainer.innerHTML = '';
        updateNoteList();
    });
});


let notes = getNotesFromStorage();

// returns an empty array if stored notes is null
function getNotesFromStorage() {
    let storedNotes = localStorage.getItem('notes');
    return storedNotes ? JSON.parse(storedNotes) : [];
}

function saveNote() {
    let selectedCategory = select('.selected-category p');
    let noteTitle = inputNoteTitle.value;
    let noteContent = inputNoteDescrip.value;
    let noteCategory = selectedCategory.innerText;

    notes.push({
        "id": Date.now(),
        "title": noteTitle,
        "content": noteContent,
        "category": noteCategory
    });

    localStorage.setItem('notes', JSON.stringify(notes));
}

onEvent('click', saveBtn, () => {
    if (inputNoteTitle.value.trim() != "" && inputNoteDescrip.value.trim() !== "") {
        saveNote();
        inputNoteTitle.value = '';
        inputNoteDescrip.value = '';
        updateNoteList();
        updateCategories();
    } else {
        inputNoteTitle.focus();
    }

    inputNoteTitle.value.trim() == '' ? inputNoteTitle.focus() : inputNoteDescrip.focus();
});

onEvent('click', cancelBtn, () => {
    inputNoteTitle.value = '';
    inputNoteDescrip.value = '';
});

function updateNoteList() {
    noteListContainer.innerHTML = '';
    let selectedCategory = select('.selected-category p');
    let notesForCategory = notes.filter(note => note.category == selectedCategory.innerText);

    notesForCategory.forEach(note => {
        let container = document.createElement('div');
        let title = document.createElement('p');
        let date = document.createElement('p');
        let id = document.createElement('span');

        title.innerText = note.title;
        title.classList.add('note-title');
        date.innerText = new Date(note.id).toLocaleDateString().replaceAll('-', '/');
        date.classList.add('note-date');

        // hide id from users
        id.innerText = note.id;
        id.style.display = 'none';

        container.appendChild(title);
        container.appendChild(date);
        container.appendChild(id);

        noteListContainer.appendChild(container);
    });
}

function updateCategories() {
    categories.forEach((category) => {
        let categoryCount = category.lastChild.previousSibling;
        let categoryName = category.querySelector('p:first-of-type').innerText;

        categoryCount.innerText = notes.filter(note => note.category == categoryName).length;
    });
}

function formatDateTime(dateString) {
    let date = new Date(dateString);
    // Format date
    let formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Format time
    let formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }).replace('AM', 'am').replace('PM', 'pm');

    return `${formattedDate} at ${formattedTime}`;
}

onEvent('click', noteListContainer, (event) => {
    let notePreview = event.target.closest('.note-list div');

    if (notePreview !== null) {
        let currentSelected = select('.selected-note');

        if (currentSelected !== null) {
            currentSelected.classList.remove('selected-note');
        }

        notePreview.classList.add('selected-note');
        let noteId = notePreview.querySelector('span').innerText;
        let noteToDisplay = notes.find(note => note.id == noteId);

        noteDateInfo.innerText = formatDateTime(noteToDisplay.id);
        noteTitleInfo.innerText = noteToDisplay.title;
        noteContentInfo.innerText = noteToDisplay.content;

        inputContainer.style.display = 'none';
        noteContent.style.display = 'block';
    }
});

onEvent('click', deleteNote, () => {
    let noteIdToDelete = select('.selected-note span');

    if (noteIdToDelete != null) {
        // filter out the note to delete
        let modifiedNotes = notes.filter(note => note.id != noteIdToDelete.innerText);
        // console.log(modifiedNotes);

        // update the notes in local storage
        localStorage.setItem('notes', JSON.stringify(modifiedNotes));

        // update display
        inputContainer.style.display = 'block';
        noteContent.style.display = 'none';
        notes = getNotesFromStorage()
        updateCategories();
        updateNoteList();
        console.log(notes);
    }
});

console.log(notes);