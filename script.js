// DOM Elements
const questionSection = document.getElementById('question-section');
const celebrationSection = document.getElementById('celebration-section');
const contentSection = document.getElementById('content-section');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const continueBtn = document.getElementById('continue-btn');
const confettiContainer = document.getElementById('confetti-container');

// Carousel Elements
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
const dotsContainer = document.querySelector('.carousel-dots');

// Carousel Setup
let currentSlide = 0;

// Create dots
slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
});

const dots = Array.from(dotsContainer.children);

function updateCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

prevBtn.addEventListener('click', () => {
    currentSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
    updateCarousel();
});

nextBtn.addEventListener('click', () => {
    currentSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
    updateCarousel();
});

// Auto-advance carousel every 4 seconds
setInterval(() => {
    currentSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
    updateCarousel();
}, 4000);

// No Button Behavior (Funny - runs away from cursor)
let noButtonClickCount = 0;

noBtn.addEventListener('mouseover', () => {
    const container = questionSection;
    const containerRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    // Calculate safe boundaries
    const maxX = containerRect.width - btnRect.width - 40;
    const maxY = containerRect.height - btnRect.height - 40;
    
    // Random position
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    noBtn.style.position = 'absolute';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    
    // Change button text with each attempt
    const messages = [
        'No',
        '¿Segura? 🥺',
        'Piénsalo mejor',
        'Dale una oportunidad',
        'Vamos, di que sí',
        'Por favor 🥹',
        'Te amo ❤️',
        'Sé mi Valentine',
        'No seas así 😢'
    ];
    
    noButtonClickCount++;
    if (noButtonClickCount < messages.length) {
        noBtn.textContent = messages[noButtonClickCount];
    }
    
    // Make the yes button bigger each time they try to click no
    const currentSize = parseFloat(getComputedStyle(yesBtn).fontSize);
    yesBtn.style.fontSize = (currentSize + 2) + 'px';
    yesBtn.style.padding = (parseFloat(getComputedStyle(yesBtn).paddingTop) + 2) + 'px ' + 
                           (parseFloat(getComputedStyle(yesBtn).paddingLeft) + 4) + 'px';
});

// Yes Button Behavior
yesBtn.addEventListener('click', () => {
    // Hide question section
    questionSection.classList.remove('active');
    
    // Show celebration section
    celebrationSection.classList.add('active');
    
    // Create confetti
    createConfetti();
    
    // Play celebration animation
    setTimeout(() => {
        const heartBig = celebrationSection.querySelector('.heart-big');
        heartBig.style.animation = 'heartbeat 0.5s ease-in-out 3';
    }, 100);
});

// Continue Button
continueBtn.addEventListener('click', () => {
    celebrationSection.classList.remove('active');
    contentSection.classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Confetti Function
function createConfetti() {
    const colors = ['#ff6b9d', '#ffc3a0', '#ff8fab', '#ffd1dc', '#ffb6c1'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.opacity = Math.random();
            confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            
            confettiContainer.appendChild(confetti);
            
            // Animate confetti falling
            let position = -10;
            let rotation = Math.random() * 360;
            const horizontalDrift = (Math.random() - 0.5) * 100;
            const fallSpeed = Math.random() * 3 + 2;
            const rotationSpeed = Math.random() * 5 + 2;
            
            const fall = setInterval(() => {
                position += fallSpeed;
                rotation += rotationSpeed;
                confetti.style.top = position + 'px';
                confetti.style.transform = `translateX(${horizontalDrift}px) rotate(${rotation}deg)`;
                
                if (position > window.innerHeight) {
                    clearInterval(fall);
                    confetti.remove();
                }
            }, 20);
        }, i * 30);
    }
}

// Add smooth scroll for entire page
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for any anchor links if needed
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Touch support for carousel on mobile
let touchStartX = 0;
let touchEndX = 0;

track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swipe left - next slide
        currentSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
        updateCarousel();
    }
    if (touchEndX > touchStartX + 50) {
        // Swipe right - previous slide
        currentSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
        updateCarousel();
    }
}
