// mobile nav show

const hamburgerButton = document.querySelector(".hamburger-button");

const hamburgers = document.querySelectorAll(".hamburger"); //hamburger div lines
const mobileNav = document.querySelector(".mobile-nav-bar"); //mobile nav bar

hamburgerButton.addEventListener("click", () => {
  mobileNav.classList.toggle("mobile-nav-show");
  hamburgers.forEach((hamburger) => {
    hamburger.classList.toggle("open");
  });
});

// image carousel

const buttons = document.querySelectorAll("[data-carousel-button]");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const offset = button.dataset.carouselButton === "next" ? 1 : -1;
    carousel(offset, button);
  });
});

function autoSlide() {
  const button = document.getElementById("next-button");
  if (button) {
    button.click();
  }
}

const slideTime = 5000; //ms
let autoSlideTime = setInterval(autoSlide, slideTime);

function disableCarousel() {
  //stops animation spam
  const carouselButtons = [...buttons, ...slideButtons];
  carouselButtons.forEach((button) => {
    button.disabled = true;
    setTimeout(() => {
      button.disabled = false;
    }, 1250);
  });
}

function carousel(next, button) {
  clearInterval(autoSlideTime);

  disableCarousel();

  const slides = button
    .closest(["[data-carousel]"])
    .querySelector("[data-slides]");

  const slideCircles = document.querySelectorAll(".carousel-index");

  const activeSlide = slides.querySelector("[data-active]");
  let newIndex = [...slides.children].indexOf(activeSlide) + next;
  let slideRight =
    newIndex > [...slides.children].indexOf(activeSlide) ? true : false;

  if (newIndex < 0) newIndex = slides.children.length - 1;
  if (newIndex >= slides.children.length) newIndex = 0;

  slideCircles[newIndex].style.backgroundColor = "#C81818";
  slideCircles[
    [...slides.children].indexOf(activeSlide)
  ].style.backgroundColor = "transparent";

  slideRight
    ? (activeSlide.style.animationName = "slideoutRight")
    : (activeSlide.style.animationName = "slideoutLeft");

  slideRight
    ? (slides.children[newIndex].style.animationName = "slideinLeft")
    : (slides.children[newIndex].style.animationName = "slideinRight");

  slides.children[newIndex].dataset.active = true;
  delete activeSlide.dataset.active;
  autoSlideTime = setInterval(autoSlide, slideTime);
}

const slideButtons = document.querySelectorAll(".carousel-index");
const slideButtonContainer = document.querySelector(".carousel-item-number");

slideButtons.forEach((slideButton) => {
  slideButton.addEventListener("click", (event) => {
    const newIndex = slideButton.dataset.slideIndex;
    selectedCarousel(newIndex, slideButtonContainer, event);
  });
});

function selectedCarousel(index, button, event) {
  clearInterval(autoSlideTime);

  disableCarousel();

  const slides = document.querySelector(".carousel-list");

  const slideCircles = document.querySelectorAll(".carousel-index");

  const activeSlide = slides.querySelector("[data-active]");
  let activeIndex = [...slides.children].indexOf(activeSlide);
  let newIndex = index;

  if (Number(newIndex) === activeIndex) {
    autoSlideTime = setInterval(autoSlide, slideTime);
    event.stopPropagation();
    return;
  }

  let slideRight =
    newIndex > [...slides.children].indexOf(activeSlide) ? true : false;

  slideCircles[
    [...slides.children].indexOf(activeSlide)
  ].style.backgroundColor = "transparent";
  slideCircles[newIndex].style.backgroundColor = "#C81818";

  slideRight
    ? (activeSlide.style.animationName = "slideoutRight")
    : (activeSlide.style.animationName = "slideoutLeft");

  slideRight
    ? (slides.children[newIndex].style.animationName = "slideinLeft")
    : (slides.children[newIndex].style.animationName = "slideinRight");

  delete activeSlide.dataset.active;
  slides.children[newIndex].dataset.active = true;

  autoSlideTime = setInterval(autoSlide, slideTime);
}

// animate on scroll

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.target.classList.contains("fadeLeft")) {
      entry.target.classList.add("fadeInLeft");
    } else if (
      entry.isIntersecting &&
      entry.target.classList.contains("fadeDown")
    ) {
      entry.target.classList.add("fadeInDown");
    }
  });
});

const animateOnScroll = document.querySelectorAll(".animate-on-scroll");
animateOnScroll.forEach((el) => observer.observe(el));

// menu filter

menuFilter = document.getElementById("filter-menu");

if (menuFilter) {
  menuFilter.addEventListener("change", (event) => {
    const selectedValue = event.target.value;

    if (selectedValue) {
      const selectedElement = document.getElementById(selectedValue);
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "start" });

        // if not starter (first section) scroll up to show more clearly
        if (selectedElement.id != "starter-section") {
          setTimeout(() => {
            window.scrollBy({ top: -100, behavior: "smooth" });
          }, 650);
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  });
}

// my order page

// sessionStorage.clear()

const items = document.querySelectorAll(".my-order-item");
const basketContainer = document.querySelector(".item-container");

let total = 0; //price total for all courses
let priceTitle; //price title element to change innerhtml to total variable
let basketCount; //basket item count

function loadData() {
  items.forEach((item) => {
    const itemData = item.querySelector("[data-name]");
    const quantity = item.querySelector("[data-quantity]");
    const findItemData = myOrderStorage.find(
      (object) => object.name === itemData.dataset.name
    ); //searches each item to see if in database

    if (findItemData) {
      // console.log(itemData.dataset.name, "found");
      quantity.value = findItemData.quantity;
      const basketDuplicate = item.cloneNode(true);
      basketContainer.appendChild(basketDuplicate);
    } else {
      // console.log(itemData.dataset.name, "not in basket");
    }
  });
}

let myOrderStorage;

// initialise database
if (sessionStorage.getItem("myOrder")) {
  myOrderStorage = JSON.parse(sessionStorage.getItem("myOrder"));
  console.log(myOrderStorage);
  loadData();
} else {
  myOrderStorage = [];
  sessionStorage.setItem("myOrder", myOrderStorage);
}

updatePrice() //update price after getting data / calculate data when loaded


// creates id for storing object and for dataset
function generateID(item) {
  let first = item.dataset.name;
  let last = Date.now().toString(36) + Math.random().toString(36).substr(2);

  let id = last;
  return id;
}

function restrictNumberInput(item) {

  if(!parseInt(item.value)){
    item.value = 0
  }

  item.value = parseInt(item.value.slice(0, 2));
  item.value = item.value.replace(/\D/g, "").slice(0, 2);

  let value = parseInt(item.value);
  let min = item.getAttribute("min");
  let max = item.getAttribute("max");

  if (value <= min) {
    item.value = min;
  } else if (value > max) {
    item.value = max;
  }
}

function incrementQuantity(button) {
  const numberInput = button
    .closest(".quantity-inputs")
    .querySelector("[data-quantity]"); //gets number input of its item

  let value = numberInput.value;
  if (!value) {
    value = 0;
  }
  value = parseInt(value);

  if (button.classList.contains("increment")) {
    //checks if the button is increment or decrement
    value += 1;
    if (value == 100) {
      value = 99;
    }
    numberInput.value = value;
  } else {
    value -= 1;
    if (value == -1) {
      value = 0;
    }
    numberInput.value = value;
  }
  updateItem(button);
}

function updateItem(el) {
  const parent = el.closest(".quantity-inputs");
  const item = parent
    .closest(".order-item-wrapper")
    .querySelector("[data-name]");

  const numberInput = parent.querySelector("[data-quantity]");
  let value = numberInput.value;
  item.dataset.quantity = value;
  if (!value) {
    value = 0;
  }
  value = parseInt(value);
  // console.log(numberInput, value)

  const findItem = myOrderStorage.find(
    (object) => object.name === item.dataset.name
  ); //searches for item that has been updated in data base

  if (value > 0) {
    if (findItem) {
      // console.log("data found");
      findItem.quantity = value; //updates my order storage item quantity

      // console.log(findItem)
      sessionStorage.setItem("myOrder", JSON.stringify(myOrderStorage));
      //update total price/basket
      updateBasket("update", parent, value);
    } else {
      //data not found in database, new item being added
      // create id and add it to item
      const id = generateID(item);
      console.log(id);
      item.setAttribute("data-item-id", id);

      // creates object to be saved
      let object = {
        id: id,
        name: item.dataset.name,
        price: item.dataset.price,
        quantity: numberInput.value,
      };
      //pushes object to datastore
      myOrderStorage.push(object);
      sessionStorage.setItem("myOrder", JSON.stringify(myOrderStorage));

      updateBasket("create", parent, value);
    }
  }
  if (value == 0) {
    // if item exists in database
    if (findItem) {
      const deleteIndex = myOrderStorage.findIndex(
        (object) => object.id === findItem.id
      ); //grabs index of found element in database array from the id

      //ensures the index of item to delete exists in the array otherwise .findindex returns -1 and would delete the last item in the array
      // which may not be intended item to delete
      if (deleteIndex !== -1) {
        syncValues(item.closest(".my-order-item"), value) //syncs values even if deleting for menu
        myOrderStorage.splice(deleteIndex, 1);
        sessionStorage.setItem("myOrder", JSON.stringify(myOrderStorage));
        updateBasket("delete", parent, 0);
      }
    }
  }
}

function deleteItem(item){
  console.log(item)
  const syncParent = item.closest(".my-order-item")
  const numberInput = item.closest(".quantity-inputs").querySelector("[data-quantity]")
  numberInput.value = 0
  updateItem(item)
  syncValues(syncParent, 0)
}


//delegate event listeners to parent to dynamically add for basket
const container = document.querySelector(".my-order-page-wrapper")

//only runs if container exists on page
if(container){
  container.addEventListener("click", function(event){
    if (event.target.classList.contains("increment") || event.target.classList.contains("decrement")){
      incrementQuantity(event.target)
    }
    else if(event.target.classList.contains("reset-quantity")){
      deleteItem(event.target)
    }
  })
  
  container.addEventListener("change", function(event){
    if(event.target.classList.contains("item-quantity")){
      restrictNumberInput(event.target)
      updateItem(event.target)
    }
  })

  container.addEventListener("input", function(event){
    if(event.target.classList.contains("item-quantity")){
      restrictNumberInput(event.target)
      updateItem(event.target)
    }
  })
  
  //ensures updates item quantity for mobile devices when pressing enter or loses focus
  container.addEventListener("keydown", function(event){
    if(event.target.classList.contains("item-quantity")){
      if(event.key === "Enter"){
        restrictNumberInput(event.target)
        updateItem(event.target)
      }
    }
  })
  container.addEventListener("blur", function(event){
    if(event.target.classList.contains("item-quantity")){
      restrictNumberInput(event.target)
      updateItem(event.target)
    }
  })
  
}

function syncValues(item, value){
  const itemName = item.querySelector("[data-name]") //grabs div with name to find corresponding element in basket or menu
  const syncItems = container.querySelectorAll(`[data-name="${itemName.dataset.name}"]`)
  syncItems.forEach((item) =>{
    const parent = item.closest(".my-order-item")
    const numberInput = parent.querySelector(".item-quantity")
    numberInput.value = value
  })
}

function updateBasket(method, element, value) {
  
  const item = element.closest(".my-order-item");
  const duplicate = item.cloneNode(true);
  // console.log(item);
  if (method === "create") {
    console.log("duplicating item to basket");
    basketContainer.appendChild(duplicate);
    
    // console.log(duplicate);
    
  } else if (method === "update") {
    syncValues(item, value)

  } else if (method === "delete") {
    console.log("delete item");
    const itemName = item.querySelector("[data-name]") //gets data name

    const foundItem = basketContainer.querySelector(`[data-name="${itemName.dataset.name}"]`) //gets item with same name as deleted item from within the basket

    const foundItemParent = foundItem.closest(".my-order-item") //gets the full element/parent wrapper of item thats getting deleted in the basket
    basketContainer.removeChild(foundItemParent) //removes found element from basket container in the DOM
  }
  updatePrice()
}

function updatePrice(){

  priceTitle = document.querySelector(".basket-price")
  basketCountEl = document.querySelector(".basket-item-count")

  console.log("update price")
  let itemPrice
  let totalPrice = 0
  basketCount = 0
  myOrderStorage.forEach((item) =>{
    itemPrice = parseFloat(item.price) * item.quantity
    totalPrice += itemPrice
    basketCount += parseInt(item.quantity)
  })
  totalPrice = totalPrice.toFixed(2)
  if(priceTitle){
    priceTitle.innerHTML = `£${totalPrice}`
    basketCountEl.innerHTML = `(${basketCount})`
  }
}

// contact page

const form = document.getElementById("contact-form");
const result = document.getElementById("form-send-success");

if (form) {
  form.addEventListener("submit", function (e) {
    console.log("form submitted");
    e.preventDefault();
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    result.innerHTML = "Please wait...";

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    })
      .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
          result.innerHTML = json.message;
        } else {
          console.log(response);
          result.innerHTML = json.message;
        }
      })
      .catch((error) => {
        console.log(error);
        result.innerHTML = "Something went wrong!";
      })
      .then(function () {
        form.reset();
        setTimeout(() => {
          result.style.display = "none";
        }, 3000);
      });
  });
}

// subscribe email

const scriptURL =
  "https://script.google.com/macros/s/AKfycbzhlTPJyw5kCvuDMiZijz8BFDc4yhq9R2bEda2mDJJnTkiLKun3b7Nh_xixd56rVlNc/exec";
const subscribeForm = document.forms["subscribe-to-google-sheet"];
const subscribeMessage = document.querySelector(".subscribe-message");

const subscribeEmail = document.querySelector(".subscribe-input.email");
const subscribeButton = document.querySelector(".subscribe-input.subscribe");

function disableSubscribeButtons() {
  subscribeEmail.setAttribute("disabled", true);
  subscribeEmail.style.opacity = 0.75;
  subscribeEmail.style.cursor = "default";

  subscribeButton.setAttribute("disabled", true);
  subscribeButton.style.opacity = 0.75;
  subscribeButton.style.cursor = "default";
}

function enableSubscribeButtons() {
  subscribeEmail.removeAttribute("disabled");
  subscribeEmail.style.opacity = 1;
  subscribeEmail.style.cursor = "text";

  subscribeButton.removeAttribute("disabled");
  subscribeButton.style.opacity = 1;
  subscribeButton.style.cursor = "pointer";
}

subscribeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(subscribeForm);
  disableSubscribeButtons();

  subscribeMessage.classList.add("white-text");
  subscribeMessage.innerHTML = "Please Wait..";

  fetch(scriptURL, { method: "POST", body: formData })
    .then((response) => {
      subscribeMessage.classList.remove("white-text");
      subscribeMessage.innerHTML = "Thank You For Subscribing!";
      console.log("Subscribe Email Success!", response);
      setTimeout(() => {
        subscribeMessage.innerHTML = "";
      }, 3000);
      subscribeForm.reset();
      enableSubscribeButtons();
    })

    .catch((error) => console.error("Subscribe Email Error!", error.message));
});
