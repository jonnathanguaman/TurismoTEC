//Inicia slider
//Para un maximo de 3 imagenes
let currentIndex = 0;
let intervalId;

function startSlider() {
  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(() => {
    // Asegurarse de que el elemento existe antes de intentar modificarlo
    const sliderImages = document.querySelector('.slider-images');
    if (sliderImages) {
      currentIndex = (currentIndex + 1) % 3;
      sliderImages.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, 5000);
}


window.onload = startSlider;

function stopSlider() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
//Termina slider


