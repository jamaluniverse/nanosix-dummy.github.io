tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#46ec13",
                "primary-dark": "#36b80f",
                "background-light": "#f6f8f6",
                "background-dark": "#131811",
                "surface-dark": "#1e271c",
                "border-dark": "#2c3928",
                "text-secondary": "#a3b99d",
            },
            fontFamily: {
                sans: ['Lexend', 'Sofia Sans', 'sans-serif'],
                display: ['Lexend', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: "0.25rem",
                lg: "0.5rem",
                xl: "0.75rem",
                "2xl": "1rem",
            },
        },
    },
}

document.addEventListener('DOMContentLoaded', () => {
    // Basic artificial progress simulation for visual feedback
    const loadingBar = document.getElementById('loading-bar');
    if (loadingBar) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 90) {
                progress = 90; // Hold at 90% until fully loaded
                clearInterval(interval);
            }
            loadingBar.style.width = `${progress}%`;
        }, 100);
    }

    const callBtn = document.getElementById('call-btn');
    const callPanel = document.getElementById('call-panel');
    const emailBtn = document.getElementById('email-btn');
    const emailPanel = document.getElementById('email-panel');
    const rightPill = document.getElementById('right-pill');

    function closeCall() {
        callPanel.classList.remove('call-open');
        callBtn.classList.remove('icon-hidden');
    }

    function closeEmail() {
        emailPanel.classList.remove('email-open');
        emailBtn.classList.remove('icon-hidden');
    }

    if (callBtn && callPanel && emailBtn && emailPanel && rightPill) {
        callBtn.addEventListener('click', () => {
            if (emailPanel.classList.contains('email-open')) {
                closeEmail();
            }
            rightPill.classList.add('pill-active');
            callPanel.classList.add('call-open');
            callBtn.classList.add('icon-hidden');
        });

        callPanel.addEventListener('click', () => {
            rightPill.classList.remove('pill-active');
            closeCall();
        });

        emailBtn.addEventListener('click', () => {
            if (callPanel.classList.contains('call-open')) {
                closeCall();
            }
            rightPill.classList.add('pill-active');
            emailPanel.classList.add('email-open');
            emailBtn.classList.add('icon-hidden');
        });

        emailPanel.addEventListener('click', () => {
            rightPill.classList.remove('pill-active');
            closeEmail();
        });

        // Close when clicking outside
        document.addEventListener('click', (event) => {
            const isClickInside = rightPill.contains(event.target);
            const isCallOpen = callPanel.classList.contains('call-open');
            const isEmailOpen = emailPanel.classList.contains('email-open');

            if (!isClickInside && (isCallOpen || isEmailOpen)) {
                rightPill.classList.remove('pill-active');
                if (isCallOpen) closeCall();
                if (isEmailOpen) closeEmail();
            }
        });
    }
});

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const loadingBar = document.getElementById('loading-bar');

    if (preloader && loadingBar) {
        // Complete the progress bar
        loadingBar.style.width = '100%';

        // Wait a slight moment for the bar to reach 100% visually, then fade out screen
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 700); // Wait for CSS transition to finish (duration-700)
        }, 400);
    }
});

function handleScrollAnimation() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    const windowHeight = window.innerHeight;
    const centerLine = windowHeight / 2;

    reveals.forEach(reveal => {
        const rect = reveal.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;

        // Calculate progress line (center of screen)
        // Using the outer centerLine variable

        let progress;
        if (elementCenter <= centerLine) {
            // If the element is at or above the center line, keep it at 100% progress
            progress = 1;
        } else {
            // If the element is in the bottom half, calculate 20% to 100% transition
            // 0 = at bottom edge (20% opacity), 1 = at center (100% opacity)
            let distanceFromBottom = (window.innerHeight - elementCenter) / (window.innerHeight / 2);
            progress = 0.2 + (distanceFromBottom * 0.8);
            progress = Math.min(Math.max(progress, 0.2), 1);
        }

        reveal.style.opacity = progress;

        // Translation: 30px at bottom, 0px at center
        const translateY = 30 * (1 - (progress - 0.2) / 0.8);
        reveal.style.transform = `translateY(${Math.max(translateY, 0)}px)`;
    });
}

// ── Sticky Features Scroll Logic ──
function initFeaturesScroll() {
    const featuresBg = document.getElementById('features-bg');
    const cards = document.querySelectorAll('.feature-card');

    if (!featuresBg || cards.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0% -20% 0%', // Trigger when card is roughly in the middle 60% of screen
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get background color and image from data attributes
                const bgColor = entry.target.getAttribute('data-bg');
                const bgImg = entry.target.getAttribute('data-img');

                // Update sticky background layer
                if (bgColor) featuresBg.style.backgroundColor = bgColor;
                if (bgImg) featuresBg.style.backgroundImage = `url('${bgImg}')`;

                // Toggle active class for cards
                cards.forEach(card => card.classList.remove('feature-card-active'));
                entry.target.classList.add('feature-card-active');
            }
        });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));
}

// Consolidated initialization
window.addEventListener('load', () => {
    handleScrollAnimation();
    handlePillColorChange();
    initFeaturesScroll();
});

// Optimized scroll listener
let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            handleScrollAnimation();
            handlePillColorChange();
            isScrolling = false;
        });
        isScrolling = true;
    }
});

function handlePillColorChange() {
    const rightPill = document.getElementById('right-pill');
    const headerLogo = document.getElementById('header-logo');
    const lightSections = document.querySelectorAll('.light-section');

    if (!rightPill) return;

    const pillRect = rightPill.getBoundingClientRect();
    const pillCenter = pillRect.top + pillRect.height / 2;

    let isOverLight = false;

    lightSections.forEach(section => {
        const sectionRect = section.getBoundingClientRect();
        if (pillCenter >= sectionRect.top && pillCenter <= sectionRect.bottom) {
            isOverLight = true;
        }
    });

    if (isOverLight) {
        rightPill.classList.add('pill-dark');
        if (headerLogo) headerLogo.src = 'element/logo-scroll.svg';
    } else {
        rightPill.classList.remove('pill-dark');
        if (headerLogo) headerLogo.src = 'element/logo.svg';
    }
}