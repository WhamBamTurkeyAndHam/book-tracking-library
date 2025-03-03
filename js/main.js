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

// When the page loads, ensure a warning message is displayed for the image.
window.addEventListener('DOMContentLoaded', () => {
  allImageWarning();
});

// If a file is not selected.
function allImageWarning() {
  imageWarning.forEach(imageWarning => {
    imageWarning.textContent = "PLEASE SELECT AN IMAGE FILE.";
    imageWarning.style.color = "red";
  });
  imageWarningContainer.forEach(imageWarningContainer => {
    imageWarningContainer.style.backgroundColor = 'rgb(255, 165, 165)'
    imageWarningContainer.style.border = "red solid 2px";
    imageWarningContainer.style.setProperty('--triangle-color', 'red');
  });
}

// Event listener for when the user selects a file.
imageUpload.addEventListener('change', function() {
  if (imageUpload.files.length > 0) {
    // If a file is selected.
    imageWarning.forEach(imageWarning => {
      imageWarning.textContent = "FILE SELECTED SUCCESSFULLY!";
      imageWarning.style.color = "green";
    });
    imageWarningContainer.forEach(imageWarningContainer => {
      imageWarningContainer.style.backgroundColor = 'rgb(210, 255, 210)'
      imageWarningContainer.style.border = "green solid 2px";
      imageWarningContainer.style.setProperty('--triangle-color', 'green');
    });
  } else {
    // If a file is not selected.
    allImageWarning();
  }
});

// Read status toggle.
function toggleOff() {
  currentPageInput.classList.remove('hidden');
  ratingsContainer.classList.add('hidden');
  currentPageInput.setAttribute('required', '');
}

function toggleOn() {
  currentPageInput.classList.add('hidden');
  ratingsContainer.classList.remove('hidden');
  currentPageInput.removeAttribute('required');
}

openModal.addEventListener("click", () => {
  modal.showModal();
  imageUpload.value = '';
  allImageWarning();
  titleInput.value = '';
  authorInput.value = '';
  
  if (!toggleReadSwitch.checked) {
    currentPageInput.value = '';
    totalPageInput.value = '';
    toggleOff();
  } else {
    currentPageInput.value = '';
    totalPageInput.value = '';
    toggleOn();
  }
});

closeModal.addEventListener('click', () => {
  modal.close();
});

closeEditModal.addEventListener('click', () => {
  editModal.close();
})

// Switch adds or removes extra inputs depending on if you have read a book, or not.
document.querySelector('.reading-switch input').addEventListener("change", function () {
  if (!toggleReadSwitch.checked) {
    toggleOff();
    selectedRating = 0;
    updateStars(selectedRating);
  } else {
    toggleOn();
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

  if (currentPages > totalPages){
    currentPageInput.classList.add('shake');
    currentPageInput.addEventListener('animationend', () => {
      currentPageInput.classList.remove('shake');
    });
    return
  }

  // Handle image file.
  const imageUploadInput = document.querySelector('#imageUpload');
  const imageFile = imageUploadInput.files[0];
  let imageUrl = '';

  const reader = new FileReader();
  reader.onloadend = function () {
    imageUrl = reader.result; // Base64 URL.

    const readingStatus = toggleReadSwitch.checked;

    addBookToLibrary(imageUrl, readingStatus, title, author, currentPages, totalPages, rating);
    displayBooks();
    modal.close();
  };

  reader.readAsDataURL(imageFile);
});

// Take parameters, create a book then store it in the array.
function addBookToLibrary(imageUrl, readingStatus, title, author, currentPages, totalPages, rating) {
  const newBook = new Book(imageUrl, readingStatus, title, author, currentPages, totalPages, rating, false);
  myLibrary.push(newBook);
}

function displayBooks() {

  function checkContainer() {
    const overlay = document.querySelector('#overlay');
  
    bookWrapper.children.length > 0 ? overlay.classList.add('hidden') : overlay.classList.remove('hidden');
  }

  // Change Pages This Month card.
  function updatePage() {
    const pageTotal = myLibrary.reduce((sum, book) => {
      return sum + book.currentPages;
    }, 0);
    
    pagesRead.textContent = pageTotal;
  }

  // Change Books Completed This Year card.
  function updateStatus(books) {
    let totalStatus = 0;

    books.forEach(book => {
      if (book.readingStatus) totalStatus += book.readingStatus;
    });

    booksRead.textContent = totalStatus;
  }

  // Change Books Traded card.
  function updateTrade() {
    const tradedCount = myLibrary.filter(book => book.trade).length;
    booksTrade.textContent = tradedCount;
  }

  // Change Average Star Rating card.
  function updateRating(books) {
    let totalRating = 0;
    let count = 0;

    // Loop through the books array to sum the ratings.
    books.forEach(book => {
      if (book.rating) {
          totalRating += book.rating;
          count++;
        }
    });

    // If the average rating is above a 0, average it. Otherwise leave at 0 (to avoid division by 0)
    // and simply say 'No Stars Yet'.
    const averageRating = count > 0 ? (totalRating / count).toFixed(2) : 0;
    averageRating === 0 ? booksRating.textContent = 'No Stars Yet' : booksRating.textContent = `${averageRating} Stars`;
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
      bookCardLeft.appendChild(bookImage); // Append the img container to the div (Left Side).
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
    for(i = 0; i < 5; i++) {
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

    // Delete Button.
    deleteButton.addEventListener("click", function() {
      const cardToDelete = this.closest('.bottom-card'); // Find the closest bottom card.
      const bookIndex = cardToDelete.getAttribute("data-index");
    
      // Find the index, delete only that card.
      myLibrary.splice(bookIndex, 1);

      // Refresh the display to show updated status.
      updatePage();
      updateTrade();
      updateStatus(myLibrary);
      updateRating(myLibrary);
      displayBooks();
    });

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
      updateTrade();
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
  updatePage();
  updateStatus(myLibrary);
  updateRating(myLibrary);
}