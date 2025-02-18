const modal = document.querySelector('#modal');
const openModal = document.querySelector('#openModal');
const closeModal = document.querySelector('#closeModal');
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author');
const toggleSwitch = document.querySelector('.switch input');
const currentPageInput = document.querySelector('.current-page');
const totalPageInput = document.querySelector('#totalPages');
const ratingsContainer = document.querySelector('.ratings-container');
const stars = document.querySelectorAll(".ratings-container span");
const bookForm = document.querySelector('.add-book');
const imageUpload = document.querySelector('#imageUpload');
const imageWarning = document.querySelector('#imageWarning');
const imageWarningContainer = document.querySelector('.warning-container');
let selectedRating = 0;

// If a file is not selected.
function warningDefault() {
  imageWarning.textContent = "PLEASE SELECT AN IMAGE FILE.";
  imageWarning.style.color = "red";
  imageWarningContainer.style.backgroundColor = 'rgb(255, 165, 165)'
  imageWarningContainer.style.border = "red solid 2px";
  imageWarningContainer.style.setProperty('--triangle-color', 'red');
}

// When the page loads, ensure a warning message is displayed.
window.addEventListener('DOMContentLoaded', () => {
  warningDefault();
});

// Event listener for when the user selects a file.
imageUpload.addEventListener('change', function() {
  if (imageUpload.files.length > 0) {
    // If a file is selected.
    imageWarning.textContent = "FILE SELECTED SUCCESSFULLY!";
    imageWarning.style.color = "green";
    imageWarningContainer.style.backgroundColor = 'rgb(210, 255, 210)'
    imageWarningContainer.style.border = "green solid 2px";
    imageWarningContainer.style.setProperty('--triangle-color', 'green');
  } else {
    // If a file is not selected.
    warningDefault();
  }
});

openModal.addEventListener("click", () => {
  modal.showModal();
  imageUpload.value = '';
  warningDefault();
  titleInput.value = '';
  authorInput.value = '';
  
  if (!toggleSwitch.checked) {
    currentPageInput.value = '';
    totalPageInput.value = '';
    currentPageInput.classList.remove('hidden');
    ratingsContainer.classList.add('hidden');
    currentPageInput.setAttribute('required', '');
  } else {
    currentPageInput.value = '';
    totalPageInput.value = '';
    currentPageInput.classList.add('hidden');
    ratingsContainer.classList.remove('hidden');
    currentPageInput.removeAttribute('required');
  }
});

closeModal.addEventListener("click", () => {
  modal.close();
});

// Switch adds or removes extra inputs depending on if you have read a book, or not.
document.querySelector('.switch input').addEventListener("change", function () {
  if (!toggleSwitch.checked) {
    currentPageInput.classList.remove('hidden');
    ratingsContainer.classList.add('hidden');
    currentPageInput.setAttribute('required', '');
    selectedRating = 0;
    updateStars(selectedRating);
  } else {
    currentPageInput.classList.add('hidden');
    ratingsContainer.classList.remove('hidden');
    currentPageInput.removeAttribute('required');
  }
});

// Star function.
stars.forEach(star => {
  // Make each star have an eventlistener.
  star.addEventListener('click', () => {
    selectedRating = parseInt(star.getAttribute('data-value'));
    updateStars(selectedRating);
  });

  // Handle hover for stars.
  star.addEventListener('mouseover', () => {
    let hoverValue = parseInt(star.getAttribute('data-value'));
    updateStars(hoverValue);
  });

  // Reset to the selected star when the mouse leaves.
  star.addEventListener('mouseleave', () => {
    updateStars(selectedRating);
  });
})

// Update the color of the stars based on the rating.
function updateStars(value) {
  stars.forEach(star => {
    if(parseInt(star.getAttribute('data-value')) <= value) {
      star.style.color = 'gold';
    } else {
      star.style.color = '#CCC'
    }
  });
}

// Store books here.
const myLibrary = [];

// Construct Books here.
function Book(imageUrl, readingStatus, title, author, currentPages, totalPages, rating) {
  this.imageUrl = imageUrl;
  this.readingStatus = readingStatus;
  this.title = title;
  this.author = author;
  this.currentPages = currentPages;
  this.totalPages = totalPages;
  this.rating = rating;
}

bookForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const currentPagesInput = document.querySelector('#currentPages');
  const totalPagesInput = document.querySelector('#totalPages');
  const rating = selectedRating;

  if(toggleSwitch.checked) {
    currentPagesInput.value = totalPagesInput.value;
  }

  const currentPages = currentPagesInput.value;
  const totalPages = totalPagesInput.value;

  // Handle image file.
  const imageUploadInput = document.querySelector('#imageUpload');
  const imageFile = imageUploadInput.files[0];
  let imageUrl = '';

  const reader = new FileReader();
  reader.onloadend = function () {
    imageUrl = reader.result; // Base64 URL.

    const readingStatus = toggleSwitch.checked;

    addBookToLibrary(imageUrl, readingStatus, title, author, currentPages, totalPages, rating);
    displayBooks();
    modal.close();
  };

  reader.readAsDataURL(imageFile);
});

// Take parameters, create a book then store it in the array.
function addBookToLibrary(imageUrl, readingStatus, title, author, currentPages, totalPages, rating) {
  const newBook = new Book(imageUrl, readingStatus, title, author, currentPages, totalPages, rating);
  myLibrary.push(newBook);
}

function displayBooks() {
  const bookContainer =  document.querySelector('.bottom-cards-container');

  bookContainer.innerHTML = '';

  myLibrary.forEach((book) => {
    // Create the left container.
    const bookCardLeft = document.createElement('div');
    bookCardLeft.classList.add('bottom-card-left');

    // Create the middle.
    const bookCardMiddle = document.createElement('div');

    // Create the right container
    const bottomCardRight = document.createElement('div');
    bottomCardRight.classList.add('bottom-card-right');
    const bottomCardDetails = document.createElement('div');
    bottomCardDetails.classList.add('bottom-card-details');
    const bottomCardStatus = document.createElement('div');
    bottomCardStatus.classList.add('bottom-card-status');

    // For left side.
    if (book.imageUrl) {
      const bookImage = document.createElement('img');
      bookImage.classList.add('bottom-card-left');
      bookImage.src = book.imageUrl;
      bookImage.alt = `${book.title} cover`;
      bookCardLeft.appendChild(bookImage); // Append the img container to the div (Left Side).
    }
    
    // For the middle.
    if (book.readingStatus) {
      bookCardMiddle.classList.add('book-status-read'); // If it has been read.
    } else {
      bookCardMiddle.classList.add('book-status-reading');
    }

    // For right side.
    // Top right.
    // Grab Title.
    const bookTitle = document.createElement('h3');
    bookTitle.classList.add('title');
    bookTitle.textContent = book.title;

    // Grab Author.
    const bookAuthor = document.createElement('p');
    bookAuthor.classList.add('author');
    bookAuthor.textContent = `by ${book.author}`;

    // Bottom right.
    // Grab Page Numbers.
    const bookPages = document.createElement('p');
    bookPages.classList.add('pages');
    bookPages.textContent = `${book.currentPages} of ${book.totalPages} pages`;

    // Grab star rating.
    const ratingsContainer = document.createElement('div');
    ratingsContainer.classList.add('ratings-container-small');

    // Loop through and make a span for each star.
    for(i = 0; i < 5; i++) {
      const star = document.createElement('span');
      star.textContent = '★'

      // BAsed on the rating, color the stars accordingly.
      if (i < book.rating) {
        star.style.color = 'gold';
      } else {
        star.style.color = '#CCC';
      }

      ratingsContainer.appendChild(star);
    }

    // Append the elements to the bookCardDetails div (The Top Right).
    bottomCardDetails.appendChild(bookTitle);
    bottomCardDetails.appendChild(bookAuthor);

    // Append the elements to the bookCardStatus div (The Bottom Right).
    bottomCardStatus.appendChild(bookPages);
    bottomCardStatus.appendChild(ratingsContainer);

    // Append the element to the bottomCardRight div (Merge The Top Right and Bottom Right).
    bottomCardRight.appendChild(bottomCardDetails);
    bottomCardRight.appendChild(bottomCardStatus);

    // Create the bottomCard div.
    const bottomCard = document.createElement('div');
    bottomCard.classList.add('bottom-card');

    // Append the everything to the bottomCard.
    bottomCard.appendChild(bookCardLeft);
    bottomCard.appendChild(bookCardMiddle);
    bottomCard.appendChild(bottomCardRight);

    // Append the bottomCard to the main container.
    bookContainer.appendChild(bottomCard);
  });
}