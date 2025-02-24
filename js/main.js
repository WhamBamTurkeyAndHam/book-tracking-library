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
const ratingsContainer = document.querySelector('.ratings-container');
const stars = document.querySelectorAll(".ratings-container span");
const bookForm = document.querySelector('.add-book');
const imageUpload = document.querySelector('#imageUpload');
const imageWarning = document.querySelector('#imageWarning');
const imageWarningContainer = document.querySelector('.warning-container');
const editModal = document.querySelector('.edit-current-page-modal');
const closeEditModal = document.querySelector('#closeEditModal');
const editInput = document.querySelector('#newCurrentPages');
let selectedRating = 0;
let booksTotalTradeBefore = 0;

// Store books here.
const myLibrary = [];

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
  
  if (!toggleReadSwitch.checked) {
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
document.querySelector('.reading-switch input').addEventListener("change", function () {
  if (!toggleReadSwitch.checked) {
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

  if(toggleReadSwitch.checked) {
    currentPagesInput.value = totalPagesInput.value;
  }

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

  const bookContainer =  document.querySelector('.book-wrapper');

  function checkContainer() {
    const overlay = document.querySelector('#overlay');
  
    if (bookContainer.children.length > 0) {
      overlay.classList.add("hidden");
    } else {
      overlay.classList.remove("hidden");
    }
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
      if (book.readingStatus) {
        totalStatus += book.readingStatus;
      }
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
    if (book.trade === true) {
      bookCardMiddle.classList.add('book-trade')
    } else if (book.readingStatus) {
      bookCardMiddle.classList.add('book-status-read');
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

    // Create the "toggle read status" button.
    const spanReadingRight = document.createElement('span');
    spanReadingRight.textContent = "I Have Read It";
    spanReadingRight.classList.add('reading-option-right-small');
    const spanReadingLeft = document.createElement('span');
    spanReadingLeft.textContent = "I Haven't read It";
    spanReadingLeft.classList.add('reading-option-left-small');

    const spanReadingSlider = document.createElement('span');
    spanReadingSlider.classList.add('reading-slider', 'rounded');

    const switchReadingInput = document.createElement('input');
    switchReadingInput.classList.add('.reading-checkbox');
    switchReadingInput.setAttribute('type', 'checkbox');

    const toggleReadButton = document.createElement('label');
    toggleReadButton.classList.add('reading-switch');

    toggleReadButton.append(switchReadingInput, spanReadingSlider, spanReadingLeft, spanReadingRight);

    // Set initial state of the toggle based on book's readingStatus.
    switchReadingInput.checked = book.readingStatus;

    // Add event listener to the read toggle switch.
    switchReadingInput.addEventListener('change', function() {
      const card = this.closest('.bottom-card');
      const index = card.getAttribute('data-index');
      const book = myLibrary[index];
      
      // Update reading status.
      book.readingStatus = this.checked;
      
      // If marked as read, set current pages to total pages.
      if (book.readingStatus) {
        book.currentPages = book.totalPages;

        // Refresh the display to show updated status.
        updatePage();
        displayBooks();
      } else {
        // Set the currentPages to be in the input field.
        editInput.value = book.currentPages;
        editModal.showModal();
        
        const handleSubmit = function(event) {
          event.preventDefault();

          const newCurrentPages = parseInt(editInput.value, 10);

          if (newCurrentPages > book.totalPages) {
            editInput.classList.add('shake');
            editInput.addEventListener('animationend', () => {
              editInput.classList.remove('shake');
            });
          } else {
            book.currentPages = newCurrentPages;
            if (book.currentPages === book.totalPages) {
              book.readingStatus = true;
            }
            editModal.close();
            updatePage();
            displayBooks();
          };
        }
        
        editModal.removeEventListener('submit', handleSubmit);
        editModal.addEventListener('submit', handleSubmit);
      }

      function handleCancel() {
        editInput.value = book.currentPages;
        switchReadingInput.checked = true;
        editModal.close();
      }
      
      // Make sure there isn't multiple listeners.
      closeEditModal.removeEventListener('click', handleCancel);
      closeEditModal.addEventListener('click', handleCancel);
    });

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
    bottomCardButtons.append(toggleReadButton, deleteButton, toggleTradeButton);

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
    bookContainer.appendChild(bottomCard);
  });

  checkContainer();
  updatePage();
  updateStatus(myLibrary);
  updateRating(myLibrary);
}