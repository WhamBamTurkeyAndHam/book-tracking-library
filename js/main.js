// Store const here.
const pagesRead = document.querySelector('.pages-read');
const booksRead = document.querySelector('.books-read');
const booksTrade = document.querySelector('.books-traded');
const booksRating = document.querySelector('.books-ratings');
const modal = document.querySelector('#modal');
const openModal = document.querySelector('#openModal');
const closeModal = document.querySelector('#closeModal');
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author');
const toggleReadSwitch = document.querySelector('.reading-switch input');
const currentPageInput = document.querySelector('.current-page');
const totalPageInput = document.querySelector('#totalPages');
const ratingsContainer = document.querySelector('.ratings-container, .new-ratings-container');
const stars = document.querySelectorAll('.ratings-container span, .new-ratings-container span');
const bookForm = document.querySelector('.add-book');
const imageUpload = document.querySelector('#imageUpload');
const imageWarning = document.querySelectorAll('.image-warning');
const imageWarningContainer = document.querySelectorAll('.warning-container');
const editModal = document.querySelector('#editModal');
const closeEditModal = document.querySelector('#closeEditModal');
const editTitle = editModal.querySelector('#newTitle');
const editAuthor = editModal.querySelector('#newAuthor');
const newImageUpload = editModal.querySelector('#newImageUpload');
const editImageWarning = editModal.querySelectorAll('.new-image-warning');
const editImageWarningContainer = editModal.querySelectorAll('.new-warning-container');
const newToggleReadSwitch = editModal.querySelector('.new-reading-switch input');
const editCurrentPages = editModal.querySelector('#newCurrentPages');
const editTotalPages = editModal.querySelector('#newTotalPages')
const newRatingsContainer = editModal.querySelector('.new-ratings-container');
const bookContainer = document.querySelector('.bottom-cards-container');
const bookWrapper =  document.querySelector('.book-wrapper');

// Store books and let here.
const myLibrary = [];
let selectedRating = 0;
let editSelectedRating = 0;

function updateImageWarning(warningElements, containerElements, isSelected, isExisting = false) {
  warningElements.forEach(warning => {
    if (isSelected) {
      warning.textContent = isExisting ? "IMAGE ALREADY SELECTED!" : "FILE SELECTED SUCCESSFULLY!";
      warning.style.color = "green";
    } else {
      warning.textContent = "PLEASE SELECT AN IMAGE FILE.";
      warning.style.color = "red";
    }
  });

  containerElements.forEach(container => {
    if (isSelected) {
      container.style.backgroundColor = 'rgb(210, 255, 210)';
      container.style.border = "green solid 2px";
      container.style.setProperty('--triangle-color', 'green');
    } else {
      container.style.backgroundColor = 'rgb(255, 165, 165)';
      container.style.border = "red solid 2px";
      container.style.setProperty('--triangle-color', 'red');
    }
  });
}

// Process image file and perform callback when ready
function processImageFile(fileInput, existingImageUrl, callback) {
  const imageFile = fileInput.files[0];
  
  if (imageFile) {
    const reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    };
    reader.readAsDataURL(imageFile);
  } else if (existingImageUrl) {
    callback(existingImageUrl);
  } else {
    callback('');
  }
}

function validatePages(currentPages, totalPages, currentPagesElement) {
  if (currentPages > totalPages) {
    currentPagesElement.classList.add('shake');
    currentPagesElement.addEventListener('animationend', () => {
      currentPagesElement.classList.remove('shake');
    }, { once: true });
    return false;
  }
  return true;
}

// When the page loads, ensure a warning message is displayed for the image.
window.addEventListener('DOMContentLoaded', () => {
  updateImageWarning(imageWarning, imageWarningContainer, false);
});

// Event listener for when the user selects a file.
imageUpload.addEventListener('change', function() {
  updateImageWarning(imageWarning, imageWarningContainer, imageUpload.files.length > 0);
});

function toggleReadStatus(isRead, currentPagesElement, ratingsElement) {
  if (!isRead) {
    currentPagesElement.classList.remove('hidden');
    ratingsElement.classList.add('hidden');
    currentPagesElement.setAttribute('required', '');
  } else {
    currentPagesElement.classList.add('hidden');
    ratingsElement.classList.remove('hidden');
    currentPagesElement.removeAttribute('required');
  }
}

openModal.addEventListener("click", () => {
  modal.showModal();
  imageUpload.value = '';
  updateImageWarning(imageWarning, imageWarningContainer, false);
  titleInput.value = '';
  authorInput.value = '';
  currentPageInput.value = '';
  totalPageInput.value = '';
  
  toggleReadStatus(toggleReadSwitch.checked, currentPageInput, ratingsContainer)
  selectedRating = 0;
  updateStars(stars, selectedRating);
});

closeModal.addEventListener('click', () => {
  modal.close();
});

closeEditModal.addEventListener('click', () => {
  editModal.close();
})

// Switch adds or removes extra inputs depending on if you have read a book, or not.
toggleReadSwitch.addEventListener('change', function () {
  toggleReadStatus(this.checked, currentPageInput, ratingsContainer)
  if (!this.checked) {
    selectedRating = 0;
    updateStars(stars, selectedRating);
  }
});

// Star function.
stars.forEach(star => {
  // Make each star have an eventlistener.
  star.addEventListener('click', () => {
    selectedRating = parseInt(star.getAttribute('data-value'));
    updateStars(stars, selectedRating);
  });

  // Handle hover for stars.
  star.addEventListener('mouseover', () => {
    let hoverValue = parseInt(star.getAttribute('data-value'));
    updateStars(stars, hoverValue);
  });

  // Reset to the selected star when the mouse leaves.
  star.addEventListener('mouseleave', () => {
    updateStars(stars, selectedRating);
  });
})

function updateStars(stars, value) {
  stars.forEach(star => {
    star.style.color = parseInt(star.getAttribute('data-value')) <= value ? 'gold' : '#CCC';
  });
}

// Update book statistics
function updateStatistics() {
  // Change Pages This Month card.
  const pageTotal = myLibrary.reduce((sum, book) => sum + book.currentPages, 0);
  pagesRead.textContent = pageTotal;
  
  // Change Books Completed This Year card.
  const completedBooks = myLibrary.filter(book => book.readingStatus).length;
  booksRead.textContent = completedBooks;
  
  // Change Books Traded card.
  const tradedCount = myLibrary.filter(book => book.trade).length;
  booksTrade.textContent = tradedCount;
  
  // Change Average Star Rating card.
  const ratedBooks = myLibrary.filter(book => book.rating > 0);
  const totalRating = ratedBooks.reduce((sum, book) => sum + book.rating, 0);
  const averageRating = ratedBooks.length > 0 ? (totalRating / ratedBooks.length).toFixed(2) : 0;
  
  booksRating.textContent = averageRating > 0 ? `${averageRating} Stars` : 'No Stars Yet';
}

// Construct Books here.
function Book(imageUrl, readingStatus, title, author, currentPages, totalPages, rating, trade) {
  this.imageUrl = imageUrl;
  this.readingStatus = readingStatus;
  this.title = title;
  this.author = author;
  this.currentPages = currentPages;
  this.totalPages = totalPages;
  this.rating = rating;
  this.trade = trade;
}

bookForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const currentPagesInput = document.querySelector('#currentPages');
  const totalPagesInput = document.querySelector('#totalPages');
  const rating = selectedRating;

  if(toggleReadSwitch.checked) currentPagesInput.value = totalPagesInput.value;

  const currentPages = parseInt(currentPagesInput.value, 10);
  const totalPages = parseInt(totalPagesInput.value, 10);

  if (!validatePages(currentPages, totalPages, currentPageInput)) {
    return;
  }

  // Handle image file.
  processImageFile(imageUpload, null, (imageUrl) => {
    if (!imageUrl) {
      updateImageWarning(imageWarning, imageWarningContainer, false);
      return;
    }

    const readingStatus = toggleReadSwitch.checked;
    // Take parameters, create a book then store it in the array.
    const newBook = new Book(imageUrl, readingStatus, title, author, currentPages, totalPages, rating, false);
    myLibrary.push(newBook);
    displayBooks();
    modal.close();
  });
})

// Event delegation for edit buttons and delete buttons
bookContainer.addEventListener('click', (event) => {
  const editButton = event.target.closest('.card-edit-button');
  const deleteButton = event.target.closest('.card-delete-button');
  
  if (editButton) {
    handleEditButton(editButton);
  } else if (deleteButton) {
    handleDeleteButton(deleteButton);
  }
});

// Edit Button.
function handleEditButton(editButton) {
  const card = editButton.closest('.bottom-card');
  const index = parseInt(card.getAttribute('data-index'));
  const book = myLibrary[index];

  editModal.showModal();

  editTitle.value = book.title;
  editAuthor.value = book.author;
  newToggleReadSwitch.checked = book.readingStatus;
  editCurrentPages.value = book.currentPages;
  editTotalPages.value = book.totalPages;
  editSelectedRating = book.rating;

  // Setup image warning display.
  updateImageWarning(editImageWarning, editImageWarningContainer, book.imageUrl ? true : false, book.imageUrl ? true : false);
  
  // Store existing image info.
  editModal.dataset.hasExistingImage = book.imageUrl ? "true" : "false";
  editModal.dataset.existingImageUrl = book.imageUrl || "";
  editModal.dataset.newImageSelected = "false";

  // Handle new image upload.
  newImageUpload.addEventListener('change', function imageChangeHandler() {
    updateImageWarning(editImageWarning, editImageWarningContainer, 
      newImageUpload.files.length > 0 || book.imageUrl ? true : false, 
      newImageUpload.files.length === 0 && book.imageUrl ? true : false);
    
    editModal.dataset.newImageSelected = newImageUpload.files.length > 0 ? "true" : "false";
    
    newImageUpload.removeEventListener('change', imageChangeHandler);
  });

  // Set initial visibility based on reading status.
  toggleReadStatus(newToggleReadSwitch.checked, editCurrentPages, newRatingsContainer);

  function handleSwitchChange() {
    toggleReadStatus(this.checked, editCurrentPages, newRatingsContainer);
  }
  newToggleReadSwitch.addEventListener('change', handleSwitchChange);

  const editStars = newRatingsContainer.querySelectorAll('span');
  updateStars(editStars, editSelectedRating);

  editStars.forEach(star => {
    star.replaceWith(star.cloneNode(true));
  });

  const freshEditStars = newRatingsContainer.querySelectorAll('span');

  // Make each star have an event listener.
  freshEditStars.forEach(star => {
    star.addEventListener('click', () => {
      editSelectedRating = parseInt(star.getAttribute('data-value'));
      updateStars(freshEditStars, editSelectedRating);
    });

    // Handle hover for stars.
    star.addEventListener('mouseover', () => {
      let hoverValue = parseInt(star.getAttribute('data-value'));
      updateStars(freshEditStars, hoverValue);
    });

    // Reset to the selected star when the mouse leaves.
    star.addEventListener('mouseleave', () => {
      updateStars(freshEditStars, editSelectedRating);
    });
  });

  editModal.addEventListener('submit', function submitHandler(event) {
    event.preventDefault();

  // Edit Title Section.
  book.title = editTitle.value;

  // Edit Author Section.
  book.author = editAuthor.value;

 // Edit Image Section, as well as update each section.
  const newCurrentPages = parseInt(editCurrentPages.value, 10);
  const newTotalPages = parseInt(editTotalPages.value, 10);

  if (!validatePages(newCurrentPages, newTotalPages, editCurrentPages)) {
    return;
  }

  processImageFile(newImageUpload, editModal.dataset.hasExistingImage === "true" ? book.imageUrl : null,
    (imageUrl) => {
      // Update book properties.
      book.title = editTitle.value;
      book.author = editAuthor.value;
      book.imageUrl = imageUrl;
      book.totalPages = newTotalPages;
      
      // Update reading status and pages based on toggle.
      if (newToggleReadSwitch.checked) {
        book.readingStatus = true;
        book.rating = editSelectedRating;
        book.currentPages = newTotalPages;
      } else {
        book.currentPages = newCurrentPages;
        book.readingStatus = newCurrentPages === newTotalPages;
        book.rating = book.readingStatus ? editSelectedRating : 0;
      }

      editModal.close();
      displayBooks();
    }
  );

  newToggleReadSwitch.removeEventListener('change', handleSwitchChange);
  editModal.removeEventListener('submit', submitHandler);
  });
}

// Delete Button.
function handleDeleteButton(deleteButton) {
  const cardToDelete = deleteButton.closest('.bottom-card');
  const bookIndex = cardToDelete.getAttribute("data-index");

  // Find the index, delete only that card.
  myLibrary.splice(bookIndex, 1);

  // Refresh the display to show updated status.
  displayBooks();
}

function displayBooks() {

  function checkContainer() {
    const overlay = document.querySelector('#overlay');
  
    bookWrapper.children.length > 0 ? overlay.classList.add('hidden') : overlay.classList.remove('hidden');
  }

  bookWrapper.innerHTML = '';

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
    
      const bookImageOverlay = document.createElement('div');
      bookImageOverlay.classList.add('bottom-card-overlay');
    
      // Create circle-progress element.
      const progressCircle = document.createElement('circle-progress');
      progressCircle.setAttribute('value', (book.currentPages / book.totalPages * 100).toFixed(0));
      progressCircle.setAttribute('max', '100');
      progressCircle.setAttribute('text-format', 'percent');
      progressCircle.style.setProperty('--size', '80px');
    
      bookImageOverlay.appendChild(progressCircle);
      bookCardLeft.append(bookImage, bookImageOverlay);
    }

    // For the middle.

    book.trade === true ? bookCardMiddle.classList.add('book-trade') : 
    book.readingStatus ? bookCardMiddle.classList.add('book-status-read') : 
                        bookCardMiddle.classList.add('book-status-reading');

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
    for(let i = 0; i < 5; i++) {
      const star = document.createElement('span');
      star.textContent = '★'

      // Based on the rating, color the stars accordingly.
      i < book.rating ? star.style.color = 'gold' : star.style.color = '#CCC';

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

    // Create the Edit button.
    // Edit icon SVG path.
    const editIconPath = "M18.13 12L19.39 10.74C19.83 10.3 20.39 10.06 21 10V9L15 3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H11V19.13L11.13 19H5V5H12V12H18.13M14 4.5L19.5 10H14V4.5M19.13 13.83L21.17 15.87L15.04 22H13V19.96L19.13 13.83M22.85 14.19L21.87 15.17L19.83 13.13L20.81 12.15C21 11.95 21.33 11.95 21.53 12.15L22.85 13.47C23.05 13.67 23.05 14 22.85 14.19Z";

    const editButton = document.createElement('button');
    editButton.classList.add("card-button", "card-edit-button");
    editButton.setAttribute('id', 'openEditModal');
    editButton.appendChild(createSVGIcon(editIconPath));

    // Create the Delete button.
    // Delete icon SVG path.
    const deleteIconPath = "M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z";

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("card-button", "card-delete-button");
    deleteButton.appendChild(createSVGIcon(deleteIconPath));

    // Create the "toggle trade status" button.
    const spanTradingRight = document.createElement('span');
    spanTradingRight.textContent = "I Want To Trade It";
    spanTradingRight.classList.add('trading-option-right-small');
    const spanTradingLeft = document.createElement('span');
    spanTradingLeft.textContent = "I Don't Want To Trade It";
    spanTradingLeft.classList.add('trading-option-left-small');

    const spanTradingSlider = document.createElement('span');
    spanTradingSlider.classList.add('trading-slider', 'rounded');

    const switchTradingInput = document.createElement('input');
    switchTradingInput.classList.add('trading-checkbox');
    switchTradingInput.setAttribute('type', 'checkbox');

    const toggleTradeButton = document.createElement('label');
    toggleTradeButton.classList.add('trading-switch');

    toggleTradeButton.append(switchTradingInput, spanTradingSlider, spanTradingLeft, spanTradingRight);

    // Add event listener to the trade toggle switch.
    switchTradingInput.checked = book.trade;

    switchTradingInput.addEventListener('change', function() {
      const card = this.closest('.bottom-card');
      const index = card.getAttribute('data-index');
      const book = myLibrary[index];
      book.trade = this.checked;
      displayBooks();
    });

    // Append everything together.
    //
    // Append the elements to the bookCardDetails div (The Top Right).
    bottomCardDetails.append(bookTitle, bookAuthor);

    // Append the elements to the bookCardStatus div (The Middle Right).
    bottomCardStatus.append(bookPages, ratingsContainer);

    // Append the elements to the bookCardStatus div (The Bottom Right).
    bottomCardButtons.append(editButton, toggleTradeButton, deleteButton);

    // Append the elements to the bottomCardRight div (Merge The Top Right, Middle Right and Bottom Right).
    bottomCardRight.append(bottomCardDetails, bottomCardStatus, bottomCardButtons);

    // Add everything to the Bottom Card.
    //
    // Create the bottomCard div.
    const bottomCard = document.createElement('div');
    bottomCard.classList.add('bottom-card');

    // Append the everything to the bottomCard.
    bottomCard.append(bookCardLeft, bookCardMiddle, bottomCardRight);
    bottomCard.setAttribute("data-index", index); // Assign data-index.

    // Append the bottomCard to the main container.
    bookWrapper.appendChild(bottomCard);
  });

  checkContainer();
  updateStatistics();
}