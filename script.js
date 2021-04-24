'use strict';
////Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const header = document.querySelector(`.header`);
const nav = document.querySelector(`.nav`);
const navHeight = nav.getBoundingClientRect().height;
const navLinksContainer = document.querySelector(`.nav-links`);
const sections = document.querySelectorAll(`.section`);
const section1 = document.querySelector(`#section-1`);
const section2 = document.querySelector(`#section-2`);
const section3 = document.querySelector(`#section-3`);
const section4 = document.querySelector(`#section-4`);
const imgTargets = document.querySelectorAll(`img[data-src]`);
const tabs = document.querySelectorAll(`.operations-tab`);
const tabsContent = document.querySelectorAll(`.operations-content`);
const tabsContainer = document.querySelector(`.operations-tab-container`);
const slides = document.querySelectorAll(`.slide`);
const btnLeft = document.querySelector(`.slider-btn-left`);
const btnRight = document.querySelector(`.slider-btn-right`);
const dots = document.querySelector(`.dots`);
const btnCloseModal = document.querySelector('.btn-close-modal');
const btnsOpenModal = document.querySelectorAll('.btn-show-modal');
const btnScrollTo = document.querySelector(`.btn-scroll-to`);

//////////MODAL behavior//////////
btnsOpenModal.forEach(modal => {
  modal.addEventListener(`click`, openModal);
});
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

function openModal(e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
}

//////////SMOOTH SCROLLING//////////
btnScrollTo.addEventListener(`click`, () => {
  const s1coords = section1.getBoundingClientRect();
  //reference point of top and left calculation is viewport not document.
  //That's why scroll coords are added to element coords
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: `smooth`,
  });
});

navLinksContainer.addEventListener(`click`, e => {
  e.preventDefault();
  //Determine origin of event and get id of element
  if (e.target.classList.contains(`nav-link`)) {
    const id = e.target.getAttribute(`href`);
    //Get coords of element
    const sectionCoords = document.querySelector(id).getBoundingClientRect();
    //Scroll behavior
    window.scrollTo({
      left: sectionCoords.left + window.pageXOffset,
      top: sectionCoords.top + window.pageYOffset,
      behavior: `smooth`,
    });
  }

  //Scroll Behavior2: document.querySelector(id).scrollIntoView({behavior: `smooth`});
});

//////////OPERATIONS behavior//////////
tabsContainer.addEventListener(`click`, function (e) {
  const activeTab = e.target;
  const activeTabNum = activeTab.dataset.tab;
  //Guard clause
  if (!activeTab) return;
  tabs.forEach(tab => tab.classList.remove(`operations-tab-active`));
  activeTab.classList.add(`operations-tab-active`);
  tabsContent.forEach(content =>
    content.classList.remove(`operations-content-active`)
  );
  document
    .querySelector(`.operations-content-${activeTabNum}`)
    .classList.add(`operations-content-active`);
});

//////////NAVIGATION behavior//////////
navLinksContainer.addEventListener(`mouseover`, hover(0.5));
navLinksContainer.addEventListener(`mouseout`, hover(1));
function hover(opacity) {
  return function (e) {
    if (e.target.classList.contains(`nav-link`)) {
      const link = e.target;
      const siblings = link.closest(`.nav-links`).querySelectorAll(`.nav-link`);
      siblings.forEach(sibling => {
        if (sibling !== link) {
          sibling.style.opacity = opacity;
        }
      });
    }
  };
}

//////////STICKY NAVIGATION//////////
function headerCallback(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add(`sticky`);
  else nav.classList.remove(`sticky`);
}
const headerOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const observerHeader = new IntersectionObserver(headerCallback, headerOptions);
observerHeader.observe(header);

//////////SECTION REVEALING//////////
function sectionCallback(entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove(`section-hidden`);
    observer.unobserve(entry.target);
  }
}

const sectionOptions = {
  root: null,
  threshold: 0.15,
};

const observerSection = new IntersectionObserver(
  sectionCallback,
  sectionOptions
);

sections.forEach(section => {
  observerSection.observe(section);
});

//////////LAZY LOADING IMAGES//////////
function imgCallback(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener(`load`, () => {
    entry.target.classList.remove(`lazy-img`);
  });
  observer.unobserve(entry.target);
}

const imgOptions = {
  root: null,
  threshold: 0,
  rootMargin: `200px`,
};

const observerImg = new IntersectionObserver(imgCallback, imgOptions);
imgTargets.forEach(img => observerImg.observe(img));

//////////SLIDER//////////
let currentSlideIndex = 0;
const lastSlideIndex = slides.length - 1;
viewSlide(0);
createDots();

document.addEventListener(`keydown`, e => {
  if (e.key === `ArrowLeft`) previousSlide();
  if (e.key === `ArrowRight`) nextSlide();
});

btnLeft.addEventListener(`click`, previousSlide);
btnRight.addEventListener(`click`, nextSlide);
dots.addEventListener(`click`, function (e) {
  if (e.target.dataset.slide) {
    viewSlide(e.target.dataset.slide);
    activateDot(e.target.dataset.slide);
  }
});

function viewSlide(slideIndex) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - slideIndex)}%)`;
  });
}

function previousSlide() {
  currentSlideIndex === 0
    ? (currentSlideIndex = lastSlideIndex)
    : currentSlideIndex--;
  viewSlide(currentSlideIndex);
  activateDot(currentSlideIndex);
}

function nextSlide() {
  currentSlideIndex === lastSlideIndex
    ? (currentSlideIndex = 0)
    : currentSlideIndex++;
  viewSlide(currentSlideIndex);
  activateDot(currentSlideIndex);
}

function createDots() {
  slides.forEach((slide, i) => {
    dots.insertAdjacentHTML(
      `beforeend`,
      `<button class="dots-dot" data-slide="${i}"></button>`
    );
  });
  activateDot(0);
}

function activateDot(slide) {
  document
    .querySelectorAll(`.dots-dot`)
    .forEach(dot => dot.classList.remove(`dots-dot-active`));
  document
    .querySelector(`.dots-dot[data-slide="${slide}"]`)
    .classList.add(`dots-dot-active`);
}
