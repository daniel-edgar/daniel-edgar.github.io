//load function
let loaded = false
document.body.style.visibility = "hidden"
document.body.style.display = "none"
const loader = document.querySelector("#loader")
loader.style.display = "flex"
window.addEventListener("load", function(){
    this.document.body.style.visibility = "visible"
    this.document.body.style.display = "block"
    loader.style.display = "none"
    loaded = true
})

const hamburgerButton = document.querySelector(".hamburger-container")
const mobileNav = document.querySelector(".mobile-nav-bar")

hamburgerButton.addEventListener("click", function(){
    hamburgerButton.classList.toggle("active")
    mobileNav.classList.toggle("active")
})


let methodId
function debounce(method, delay){ // debounce so scroll event listener isnt fired too often
    clearTimeout(methodId)

    methodId = setTimeout(function() {
        method() //calls function passed into it
    }, delay); //sets delay passed into it
}

let styleRoot = getComputedStyle(document.body)
const navBar = document.querySelector(".nav")
const navBarContainer = document.querySelector(".nav-bar-container")
const navMail = document.querySelector(".nav-mail")

function handleScroll(){
    if(window.innerWidth > 768 && window.scrollY != 0 ){
        navBar.classList.add("sticky")
        navBarContainer.classList.add("sticky")
        navMail.classList.add("sticky")

    } else if(window.innerWidth > 768 && window.scrollY == 0){      
        navBar.classList.remove("sticky")
        navBarContainer.classList.remove("sticky")
        navMail.classList.remove("sticky")
    }
}
if(window.innerWidth > 768){
    handleScroll()
}

window.addEventListener("scroll", function(){ // sticky navbar js
    if(this.window.innerWidth > 768){
        debounce(handleScroll, 5)
    }
})

// animations 

let animationObserverThreshold = 0.7
function handleResizeAnimations(){ //change animation observer threshold depending on screen size
    
    if(window.innerWidth <= 768){
        animationObserverThreshold = 0.5
    }else{
        animationObserverThreshold = 0.7
    }
    return animationObserverThreshold
}
window.addEventListener("resize", function(){
    debounce(handleResizeAnimations, 500)
})
handleResizeAnimations() //initial threshold for if user never resizes screen

let contactSectionTopOffset
window.addEventListener("load", function(){
    contactSectionTopOffset = document.querySelector(".contact-section.animation-section")
    if(contactSectionTopOffset){
        contactSectionTopOffset = contactSectionTopOffset.getBoundingClientRect()
        contactSectionTopOffset = contactSectionTopOffset.top + window.scrollY
    }
})

function handleScrollAnimationThreshold(){
    if(contactSectionTopOffset - 750 <= this.window.scrollY){
        animationObserverThreshold = 0.2
        changeThreshold(animationObserverThreshold) //change threshold for animation observer when close to contact section
    }else{
        animationObserverThreshold = handleResizeAnimations() //resets it back to normal by returning appropriate value from resize function
        changeThreshold(animationObserverThreshold)
    }
}
window.addEventListener("scroll", function(){
    handleScrollAnimationThreshold()
})

let animationObserver = new IntersectionObserver(animationObserverCallback, {threshold: animationObserverThreshold}) // change threshold depending on user screen size (callback to animation logic)

const animationSections = document.querySelectorAll(".animation-section")
animationSections.forEach((animationSection) => animationObserver.observe(animationSection))
changeThreshold(animationObserverThreshold) //initial observer threshold depending on users screen size

//disconnects old observers and creates a new one with the new threshold passed into it 
function changeThreshold(newThreshold){
    animationObserver.disconnect();
    
    animationObserver = new IntersectionObserver(animationObserverCallback, {threshold: newThreshold})
    animationSections.forEach((animationSection) => animationObserver.observe(animationSection))
}

let animationDelay = 500 // delay for staggering the animations
function animationObserverCallback(entries, observer){ //animationobserver callback function for logic (written in a callback so tha threshold can be changed) by disconnecting and recreating with a new threshold
    entries.forEach((entry) =>{
        if(entry.isIntersecting){
            let animations = entry.target.querySelectorAll(".animate-on-scroll")
            animations.forEach((animation, index) =>{
                if(animation.classList.contains("blur-down")){
                    animation.classList.add("animate-blur-down")
                }else if(animation.classList.contains("fade-in")){
                    animation.classList.add("animate-fade-in")
                }else if(animation.classList.contains("fade-down")){
                    animation.classList.add("animate-fade-down")
                }
            
    
                let delay = animationDelay*index
                if(animation.classList.contains("animate-section-one")){ //animation delay control
                    if(index == 2){
                        delay = (animationDelay*index) + 400
                    }else if( index == 3){
                        delay = (animationDelay*2) + 400
                    }else if (index >= 4){
                        delay = (animationDelay*index) + 600
                    }else{
                        delay = animationDelay*index
                    }
    
                }else if(animation.classList.contains("animate-section-two")){
                    delay = (animationDelay*index)
                }else if(animation.classList.contains("animate-section-three")){
                    if(index >= 2){
                        delay = (animationDelay*index) + 200
                    }
                }else if(animation.classList.contains("animate-section-four")){
                    delay = (animationDelay + 100)*index
                    if(index >= 3){
                        delay = ((animationDelay + 100)*index) + 150
                    }
                }else if(animation.classList.contains("animate-section-five")){
                    if(index >= 2){
                        delay = (animationDelay*index)*1.25 -300
                    }else if(index == 3 || index == 5 ){
                        delay = (animationDelay*index)*1.25
                    }
                }else if(animation.classList.contains("animate-section-six")){
                    if(index >= 2){
                        delay = (200*index) + ((animationDelay*2) + 250)
                    }
                }    
    
                animation.style.animationDelay = `${delay}ms`
            })
        }
    })
}


// carousel 

//carousel autoslide function

//function returning true or false if carousel is in frame 

let carouselVisible = false
const carouselContainer = document.querySelector(".carousel")

function setupCarouselObserver(element){
    const observer = new IntersectionObserver((entries) =>{
        entries.forEach((entry) =>{
            if(entry.isIntersecting){
                carouselVisible = true //sets carousel is visible to true
            }else{
                carouselVisible = false //sets carousel is visbile to false
            }
        })
    },{
        threshold: 0.55 //checks if 55% of carousel if visible to decide if it is intersecting
    })

    observer.observe(element)
    return carouselVisible //returns if carousel is visible or not
}

function autoSlide(){
    if(carouselNext ){ //if carousel button next exits 
        const carouselIsVisible = setupCarouselObserver(carouselContainer) // function returns true if carousel if visible false if not visible

        if(carouselIsVisible){
            carouselNext.click() //if carousel is visible then click
        }
    } 
}
const slideInterval = 3000
//autoslide interval 
let autoSlideInterval = setInterval(() => {
    autoSlide()
} ,slideInterval); 

function getCurrentIndex(nodeList){ //recieves a node list to search for active slide
    
    let slidesArray = Array.from(nodeList) //convert node list into array so can get index
    let currentIndexEl
    slidesArray.forEach((slide) =>{ //loops through each slide and finds which HTML element has active data set to be able to search for its index
        if(slide.hasAttribute("data-slide-active")){
            currentIndexEl = slide
        }
    })
    let currentIndex  = slidesArray.indexOf(currentIndexEl)
    return {
        index: currentIndex,
        indexEl: currentIndexEl
    }
}

function carousel(next){
    
    clearInterval(autoSlideInterval) //clear autoslide interval
    let direction
    next.classList.contains("next") ? direction = 1 : direction = -1 

    //if chevron button contains next slide direction is positive else negative
    //check which button has been clicked
    
    let slides = document.querySelectorAll(".carousel-slides .slide") 
    let slidesArray = Array.from(slides)
    let currentIndex = getCurrentIndex(slides) //send a node list to get current index and corresponding element from function
    currentIndexEl = currentIndex.indexEl
    currentIndex = currentIndex.index

    let newindex = currentIndex + direction
    if(newindex > slidesArray.length -1){ //checks if new index pushes outside list length and reroutes to begginning/end
        newindex = 0
    }else if(newindex < 0){
        newindex = slidesArray.length - 1
    }
    delete currentIndexEl.dataset.slideActive
    slidesArray[newindex].dataset.slideActive = ""
    let slideIndexArray = Array.from(document.querySelectorAll(".slide-index-container .slide-index"))
    slideIndexArray[currentIndex].classList.remove("active")
    slideIndexArray[newindex].classList.add("active")

    autoSlideInterval = setInterval(() => autoSlide(), slideInterval); //reset autoslide interval
}

const carouselPrev = document.querySelector(".carousel-button.prev")
const carouselNext = document.querySelector(".carousel-button.next")

const slideCount = document.querySelectorAll(".carousel-slides .slide").length //length of how many list element in carousel(how many slides)

//sets up slide buttons to how many slides there is (slidecount)
const slideIndexContainer = document.querySelector(".slide-index-container") 
for(let i = 0; i < slideCount; i++){
    let newSlideIndex = document.createElement("div")
    newSlideIndex.className = "slide-index"
    slideIndexContainer.appendChild(newSlideIndex)
}
const slideIndex = document.querySelector(".slide-index") //gets first found slide-index(first slide to make it active on page load)
if(slideIndex){
    slideIndex.classList.add("active")
}

const slideIndexButtons = document.querySelectorAll(".slide-index")// get all slide-index 
slideIndexButtons.forEach((slideButton) =>{
    slideButton.addEventListener("click", ()=>{
        let index = Array.from(slideIndexButtons).indexOf(slideButton) //gets index of button clicked
        jumpSlide(index)
    })
})
function jumpSlide(newIndex){ //jumps to index of button pressed
    clearInterval(autoSlideInterval) //clear autoslide interval

    let slides = document.querySelectorAll(".carousel-slides .slide") 
    let currentIndex = getCurrentIndex(slides) //grabs current indexed element to delete active class
    let currentIndexEl = currentIndex.indexEl // gets element from current index
    currentIndex = currentIndex.index //gets index to delete slide active class

    if(currentIndex == newIndex){
        autoSlideInterval = setInterval(() => autoSlide(), slideInterval); //reset interval if exit code early
        return; //if index is the same exit function early dont perform code(more performant)
    }

    delete currentIndexEl.dataset.slideActive //deletes current active element active state
    let slideIndexArray = Array.from(slideIndexButtons) //sets slidebuttons from node list into array
    slideIndexArray[currentIndex].classList.remove("active") //removes active from current index of selected button 
    slideIndexArray[newIndex].classList.add("active") //adds active to current index of slide buttons
    
    let slidesArray = Array.from(slides)
    slidesArray[newIndex].dataset.slideActive = "" //sets index of slides array to active to same index of button

    autoSlideInterval = setInterval(() => autoSlide(), slideInterval) //resets autoslide interval 
}

if(carouselNext && carouselPrev){
    carouselNext.addEventListener("click", ()=>{
        carousel(carouselNext)
    })
    
    carouselPrev.addEventListener("click", ()=>{
        carousel(carouselPrev)
    })
}


// contact page API

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