const modal = document.querySelector('#modal');
const openModal = document.querySelector('#openModal');
const closeModal = document.querySelector('#closeModal');
const toggleSwitch = document.querySelector('.switch input');
const currentPageInput = document.querySelector('.current-page');
const ratingsContainer = document.querySelector('.ratings-container');
const stars = document.querySelectorAll(".ratings-container span");
let selectedRating = 0;

openModal.addEventListener("click", () => {
  modal.showModal();
});

closeModal.addEventListener("click", () => {
  modal.close();
});

// Switch adds or removes extra inputs depending on if you have read a book, or not.
document.querySelector('.switch input').addEventListener("change", function () {
  if (toggleSwitch.checked) {
    currentPageInput.classList.add('hidden');
    ratingsContainer.classList.remove('hidden')
  } else {
    currentPageInput.classList.remove('hidden');
    ratingsContainer.classList.add('hidden');
  }
});

// Control the star rating system.
stars.forEach((star) => {
  star.addEventListener("click", () => {
    selectedRating = star.getAttribute("data-value");
    updateStars(selectedRating);
  });

  star.addEventListener("mouseover", () => {
    let hoverValue = star.getAttribute("data-value");
    updateStars(hoverValue);
  });

  star.addEventListener("mouseleave", () => {
    updateStars(selectedRating);
  });
});

function updateStars(value) {
  stars.forEach((s) => {
    s.style.color = s.getAttribute("data-value") <= value ? "gold" : "#ccc";
  });
}