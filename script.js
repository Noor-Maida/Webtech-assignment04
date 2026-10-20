let currentSlide = 0;
let slides = [];
let presenting = false;

let markdownInput = document.getElementById("markdownInput");

// load saved slides
let saved = localStorage.getItem("mySlides");
if (saved != null) {
    markdownInput.value = saved;
}

// make slides from the text
function createSlides() {
    let parts = markdownInput.value.split("---");
    slides = [];

    for (let i = 0; i < parts.length; i++) {
        if (parts[i].trim() != "") {
            slides.push(parts[i]);
        }
    }

    if (slides.length == 0) {
        slides.push("# Empty slide");
    }

    if (currentSlide >= slides.length) {
        currentSlide = slides.length - 1;
    }

    showSlide();
}

// show the slide
function showSlide() {
    let html = marked.parse(slides[currentSlide]);
    document.getElementById("slide").innerHTML = html;
    document.getElementById("presentationSlide").innerHTML = html;

    let count = (currentSlide + 1) + " / " + slides.length;
    document.getElementById("slideCount").textContent = count;
    document.getElementById("presentCount").textContent = count;

    // left button
    if (currentSlide == 0) {
        document.getElementById("prevBtn").disabled = true;
        document.getElementById("presentPrevBtn").disabled = true;
    } else {
        document.getElementById("prevBtn").disabled = false;
        document.getElementById("presentPrevBtn").disabled = false;
    }

    // right button
    if (currentSlide == slides.length - 1) {
        document.getElementById("nextBtn").disabled = true;
        document.getElementById("presentNextBtn").disabled = true;
    } else {
        document.getElementById("nextBtn").disabled = false;
        document.getElementById("presentNextBtn").disabled = false;
    }
}

// when user types
markdownInput.addEventListener("input", function () {
    createSlides();
});

function previousSlide() {
    if (currentSlide > 0) {
        currentSlide = currentSlide - 1;
        showSlide();
    }
}

function nextSlide() {
    if (currentSlide < slides.length - 1) {
        currentSlide = currentSlide + 1;
        showSlide();
    }
}

// save slides
markdownInput.addEventListener("input", function () {
    createSlides();
});

// open presentation
function startPresentation() {
    presenting = true;
    document.getElementById("editorPage").style.display = "none";
    document.getElementById("presentationPage").style.display = "block";
    document.documentElement.requestFullscreen();
}

// close presentation
function stopPresentation() {
    presenting = false;
    document.getElementById("editorPage").style.display = "block";
    document.getElementById("presentationPage").style.display = "none";
}

// full screen button
function toggleFullscreen() {
    if (presenting == false) {
        startPresentation();
    } else {
        if (document.fullscreenElement != null) {
            document.exitFullscreen();
        }
        stopPresentation();
    }
}

// if user presses Esc to leave full screen
document.addEventListener("fullscreenchange", function () {
    if (document.fullscreenElement == null && presenting == true) {
        stopPresentation();
    }
});

// keyboard keys
document.addEventListener("keydown", function (event) {
    if (event.key == "ArrowRight") {
        if (presenting == true || document.activeElement != markdownInput) {
            nextSlide();
        }
    }

    if (event.key == "ArrowLeft") {
        if (presenting == true || document.activeElement != markdownInput) {
            previousSlide();
        }
    }

    if (event.key == "F11") {
        event.preventDefault();
        toggleFullscreen();
    }

    if (event.ctrlKey == true && (event.key == "s" || event.key == "S")) {
        event.preventDefault();
        saveSlides();
    }
});

// start
createSlides();