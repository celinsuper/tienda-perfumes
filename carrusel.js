// ==========================================
// CÓDIGO DEL CARRUSEL DE PORTADA (HERO)
// ==========================================
let currentSlideIndex = 0;
let carouselTimer = null;

function showHeroSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.indicator-dot');
    
    if (slides.length === 0) return;

    // Manejo de límites circular
    if (index >= slides.length) currentSlideIndex = 0;
    else if (index < 0) currentSlideIndex = slides.length - 1;
    else currentSlideIndex = index;

    // Cambiar opacidad de las diapositivas
    slides.forEach((slide, i) => {
        if (i === currentSlideIndex) {
            slide.classList.remove('opacity-0');
            slide.classList.add('opacity-100');
        } else {
            slide.classList.remove('opacity-100');
            slide.classList.add('opacity-0');
        }
    });

    // Actualizar estilo de los indicadores
    dots.forEach((dot, i) => {
        if (i === currentSlideIndex) {
            dot.className = 'indicator-dot w-8 h-1 rounded-full bg-gold-400 transition-all';
        } else {
            dot.className = 'indicator-dot w-2 h-1 rounded-full bg-white/40 transition-all';
        }
    });
}

function nextHeroSlide() {
    showHeroSlide(currentSlideIndex + 1);
    resetCarouselTimer();
}

function prevHeroSlide() {
    showHeroSlide(currentSlideIndex - 1);
    resetCarouselTimer();
}

function goToHeroSlide(index) {
    showHeroSlide(index);
    resetCarouselTimer();
}

function startCarouselAutoPlay() {
    carouselTimer = setInterval(() => {
        showHeroSlide(currentSlideIndex + 1);
    }, 5000); // Cambia de imagen cada 5 segundos
}

function resetCarouselTimer() {
    clearInterval(carouselTimer);
    startCarouselAutoPlay();
}

// Iniciar carrusel al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    showHeroSlide(0);
    startCarouselAutoPlay();
});