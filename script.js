// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with fade-in class
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Reusable Slider Function
function createSlider(trackId, slideClass, prevBtnId, nextBtnId, auto = true, useFade = false) {
    const track = document.getElementById(trackId);
    const slides = track.querySelectorAll("." + slideClass);
    const prev = document.getElementById(prevBtnId);
    const next = document.getElementById(nextBtnId);

    if (!track || !slides.length || !prev || !next) {
        console.warn(`Slider setup failed for ${trackId}`);
        return;
    }

    let index = 0;
    let isTransitioning = false;

    function update() {
        if (isTransitioning) return;
        isTransitioning = true;

        if (useFade) {
            // Fade transition for reviews
            slides.forEach(slide => slide.classList.remove('active'));
            if (slides[index]) {
                slides[index].classList.add('active');
            }
        } else {
            // Slide transition for gallery
            track.style.transform = `translateX(-${index * 100}%)`;
        }

        setTimeout(() => {
            isTransitioning = false;
        }, useFade ? 500 : 400);
    }

    function nextSlide() {
        if (isTransitioning) return;
        index = (index + 1) % slides.length;
        update();
    }

    function prevSlide() {
        if (isTransitioning) return;
        index = (index - 1 + slides.length) % slides.length;
        update();
    }

    next.addEventListener("click", nextSlide);
    prev.addEventListener("click", prevSlide);

    if (auto) {
        setInterval(() => {
            if (!isTransitioning) {
                nextSlide();
            }
        }, 5000);
    }

    // Initialize position
    if (useFade && slides[0]) {
        slides[0].classList.add('active');
    } else if (!useFade) {
        update();
    }
}


// Header scroll effect
let lastScroll = 0;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Reviews Carousel Auto-Scroll with Manual Navigation
(function() {
    const desktopSlides = document.querySelectorAll('.review-slide');
    const mobileSlides = document.querySelectorAll('.review-slide-mobile');
    const desktopCarousel = document.querySelector('.reviews-carousel');
    const mobileCarousel = document.querySelector('.reviews-carousel-mobile');
    const dots = document.querySelectorAll('.pagination-dot');
    const leftArrow = document.querySelector('.carousel-arrow-left');
    const rightArrow = document.querySelector('.carousel-arrow-right');
    
    let currentSlide = 0;
    let autoInterval;
    const intervalTime = 4500; // 4.5 seconds
    
    function isMobile() {
        return window.innerWidth <= 767;
    }
    
    function getSlides() {
        return isMobile() ? mobileSlides : desktopSlides;
    }
    
    function getTotalSlides() {
        return isMobile() ? 4 : 3;
    }
    
    function calculateCarouselHeight() {
        const slides = getSlides();
        const carousel = isMobile() ? mobileCarousel : desktopCarousel;
        
        if (!carousel || slides.length === 0) return;
        
        let maxHeight = 0;
        
        // Temporarily show all slides to measure their heights
        slides.forEach(slide => {
            const originalDisplay = slide.style.display;
            const originalPosition = slide.style.position;
            const originalOpacity = slide.style.opacity;
            const originalVisibility = slide.style.visibility;
            
            // Make slide visible for measurement
            slide.style.display = 'block';
            slide.style.position = 'relative';
            slide.style.opacity = '1';
            slide.style.visibility = 'visible';
            
            // Measure height
            const height = slide.offsetHeight;
            if (height > maxHeight) {
                maxHeight = height;
            }
            
            // Restore original styles
            slide.style.display = originalDisplay || '';
            slide.style.position = originalPosition || '';
            slide.style.opacity = originalOpacity || '';
            slide.style.visibility = originalVisibility || '';
        });
        
        // Set the carousel height
        if (maxHeight > 0) {
            carousel.style.height = maxHeight + 'px';
        }
    }
    
    function showSlide(index) {
        const slides = getSlides();
        const totalSlides = getTotalSlides();
        
        // Ensure index is within bounds
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        currentSlide = index;
        
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        if (slides[currentSlide]) {
            slides[currentSlide].classList.add('active');
        }
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }
    
    function nextSlide() {
        const totalSlides = getTotalSlides();
        showSlide((currentSlide + 1) % totalSlides);
    }
    
    function prevSlide() {
        const totalSlides = getTotalSlides();
        showSlide((currentSlide - 1 + totalSlides) % totalSlides);
    }
    
    function startAutoScroll() {
        if (autoInterval) {
            clearInterval(autoInterval);
        }
        autoInterval = setInterval(nextSlide, intervalTime);
    }
    
    function stopAutoScroll() {
        if (autoInterval) {
            clearInterval(autoInterval);
        }
    }
    
    // Manual navigation
    if (leftArrow) {
        leftArrow.addEventListener('click', () => {
            prevSlide();
            startAutoScroll(); // Restart auto-scroll after manual navigation
        });
    }
    
    if (rightArrow) {
        rightArrow.addEventListener('click', () => {
            nextSlide();
            startAutoScroll(); // Restart auto-scroll after manual navigation
        });
    }
    
    // Handle window resize to switch between mobile/desktop and recalculate heights
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            calculateCarouselHeight();
            showSlide(0); // Reset to first slide on resize
            startAutoScroll();
        }, 250);
    });
    
    // Initialize: calculate height, show first slide, start auto-scroll
    // Wait for page to be fully loaded to ensure accurate measurements
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                calculateCarouselHeight();
                showSlide(0);
                startAutoScroll();
            }, 100);
        });
    } else {
        setTimeout(() => {
            calculateCarouselHeight();
            showSlide(0);
            startAutoScroll();
        }, 100);
    }
})();

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Hero section entrance animation
const heroSection = document.querySelector('.hero');
if (heroSection) {
    // Trigger animation on page load
    const triggerHeroAnimation = () => {
        if (!heroSection.classList.contains('animated')) {
            heroSection.classList.add('animated');
        }
    };
    
    // Trigger immediately if hero is in viewport
    if (window.innerHeight > 0) {
        triggerHeroAnimation();
    }
    
    // Also observe for when hero enters viewport (handles scroll-to-top case)
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !heroSection.classList.contains('animated')) {
                heroSection.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });
    
    heroObserver.observe(heroSection);
}

// Mobile Menu Functionality
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const body = document.body;

function openMobileMenu() {
    hamburger.classList.add('active');
    mobileMenu.classList.add('active');
    body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    // Wait for transition to complete before allowing scroll
    setTimeout(() => {
        if (!mobileMenu.classList.contains('active')) {
            body.style.overflow = '';
        }
    }, 300);
}

// Toggle menu on hamburger click
if (hamburger) {
    hamburger.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
}

// Close menu on close button click
if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', () => {
        closeMobileMenu();
    });
}

// Close menu when clicking on a nav link
mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // If it's an internal link, scroll and close menu
        if (link.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
            // Close menu after a short delay to allow scroll to start
            setTimeout(() => {
                closeMobileMenu();
            }, 300);
        } else {
            // External links - just close menu
            setTimeout(() => {
                closeMobileMenu();
            }, 100);
        }
    });
});

// Close menu when clicking outside
if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });
}

// Close menu on window resize if it goes back to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

