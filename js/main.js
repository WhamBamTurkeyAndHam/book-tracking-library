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

  myLibrary.forEach((book, index) => {
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
    const bottomCardButtons = document.createElement('div');
    bottomCardButtons.classList.add('card-button-container');

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
    //
    // Top right.
    //
    // Grab Title.
    const bookTitle = document.createElement('h3');
    bookTitle.classList.add('title');
    bookTitle.textContent = book.title;

    // Grab Author.
    const bookAuthor = document.createElement('p');
    bookAuthor.classList.add('author');
    bookAuthor.textContent = `By ${book.author}`;

    // Middle right.
    //
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

      // Based on the rating, color the stars accordingly.
      if (i < book.rating) {
        star.style.color = 'gold';
      } else {
        star.style.color = '#CCC';
      }

      ratingsContainer.appendChild(star);
    }

    // Bottom right.
    //
    // Function to create an SVG with a given path.
    function createSVGIcon(pathData) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("width", "24");
      svg.setAttribute("height", "24");
      svg.classList.add("icons");

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathData);
      path.setAttribute("fill", "currentColor");

      svg.appendChild(path);
      return svg;
    }

    // Edit icon SVG path.
      // const editIconPath = "M18.13 12L19.39 10.74C19.83 10.3 20.39 10.06 21 10V9L15 3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H11V19.13L11.13 19H5V5H12V12H18.13M14 4.5L19.5 10H14V4.5M19.13 13.83L21.17 15.87L15.04 22H13V19.96L19.13 13.83M22.85 14.19L21.87 15.17L19.83 13.13L20.81 12.15C21 11.95 21.33 11.95 21.53 12.15L22.85 13.47C23.05 13.67 23.05 14 22.85 14.19Z";

    // Delete icon SVG path.
    const deleteIconPath = "M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z";

      // Create the Edit button.
      // const editButton = document.createElement('button');
      // editButton.classList.add("card-button", "card-edit-button");
      // editButton.appendChild(createSVGIcon(editIconPath));

    // Create the "toggle read status" button.
    const spanRight = document.createElement('span');
    spanRight.classList.add('option-right');
    const spanLeft = document.createElement('span');
    spanLeft.classList.add('option-left');

    const spanSlider = document.createElement('span');
    spanSlider.classList.add('slider', 'rounded');

    const switchInput = document.createElement('input');
    switchInput.setAttribute('type', 'checkbox');

    const toggleReadButton = document.createElement('label');
    toggleReadButton.classList.add('switch');

    toggleReadButton.append(switchInput, spanSlider, spanLeft, spanRight);

    // Set initial state of the toggle based on book's readingStatus.
    switchInput.checked = book.readingStatus;

    // Add event listener to the toggle switch
    switchInput.addEventListener('change', function() {
      const card = this.closest('.bottom-card');
      const index = card.getAttribute('data-index');
      const book = myLibrary[index];
      
      // Update reading status.
      book.readingStatus = this.checked;
      
      // If marked as read, set current pages to total pages.
      if (book.readingStatus) {
        book.currentPages = book.totalPages;
      }
      
      // Refresh the display to show updated status.
      displayBooks();
    });

    // Create the Delete button.
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("card-button", "card-delete-button");
    deleteButton.appendChild(createSVGIcon(deleteIconPath));

    // Append everything together.
    //
    // Append the elements to the bookCardDetails div (The Top Right).
    bottomCardDetails.appendChild(bookTitle);
    bottomCardDetails.appendChild(bookAuthor);

    // Append the elements to the bookCardStatus div (The Bottom Right).
    bottomCardStatus.appendChild(bookPages);
    bottomCardStatus.appendChild(ratingsContainer);

    // Append buttons to container.
    bottomCardButtons.appendChild(toggleReadButton);
      // bottomCardButtons.appendChild(editButton);
    bottomCardButtons.appendChild(deleteButton);

    // Append the element to the bottomCardRight div (Merge The Top Right and Bottom Right).
    bottomCardRight.appendChild(bottomCardDetails);
    bottomCardRight.appendChild(bottomCardStatus);
    bottomCardRight.appendChild(bottomCardButtons);

    // Create the bottomCard div.
    const bottomCard = document.createElement('div');
    bottomCard.classList.add('bottom-card');

    // Append the everything to the bottomCard.
    bottomCard.appendChild(bookCardLeft);
    bottomCard.appendChild(bookCardMiddle);
    bottomCard.appendChild(bottomCardRight);
    bottomCard.setAttribute("data-index", index); // Assign data-index

    // Delete Button.
    deleteButton.addEventListener("click", function() {
      const cardToDelete = this.closest('.bottom-card'); // Find the closest bottom card
      const bookIndex = cardToDelete.getAttribute("data-index");
    
      myLibrary.splice(bookIndex, 1);
      displayBooks();
    });

    // Append the bottomCard to the main container.
    bookContainer.appendChild(bottomCard);
  });
}