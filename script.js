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
                'sofia-sans': ['Sofia Sans', 'sans-serif'],
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
    const bg1 = document.getElementById('features-bg-1');
    const bg2 = document.getElementById('features-bg-2');
    const cards = document.querySelectorAll('.feature-card');

    if (!bg1 || !bg2 || cards.length === 0) return;

    let activeLayer = 1;
    let currentImg = '';

    const observerOptions = {
        root: null,
        rootMargin: '-45% 0% -45% 0%',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bgColor = entry.target.getAttribute('data-bg');
                const bgImg = entry.target.getAttribute('data-img');
                const imgUrl = `url('${bgImg}')`;

                // Only trigger update if the image or color actually changes
                if (currentImg !== imgUrl) {
                    const nextLayer = activeLayer === 1 ? bg2 : bg1;
                    const currentLayer = activeLayer === 1 ? bg1 : bg2;

                    // Update the HIDDEN layer first
                    nextLayer.style.backgroundColor = bgColor;
                    nextLayer.style.backgroundImage = imgUrl;

                    // Swap opacities
                    nextLayer.style.opacity = '1';
                    nextLayer.style.zIndex = '10';
                    currentLayer.style.opacity = '0';
                    currentLayer.style.zIndex = '0';

                    activeLayer = activeLayer === 1 ? 2 : 1;
                    currentImg = imgUrl;
                }

                cards.forEach(card => card.classList.remove('feature-card-active'));
                entry.target.classList.add('feature-card-active');
            }
        });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));
}

function handleHeaderFooterIntersection() {
    const headerPill = document.getElementById('left-pill');
    const rightPill = document.getElementById('right-pill');
    const navContainer = document.getElementById('nav-container');
    const footer = document.querySelector('.footer-outer-container');

    if (!headerPill || !rightPill || !footer) return;

    const footerRect = footer.getBoundingClientRect();
    const headerHeight = 80; // Approximate header height for safe threshold

    // Trigger state when footer top comes near the header area
    if (footerRect.top <= headerHeight) {
        headerPill.classList.add('footer-active');
        rightPill.classList.add('footer-active');
        if (navContainer) navContainer.classList.add('footer-active');
    } else {
        headerPill.classList.remove('footer-active');
        rightPill.classList.remove('footer-active');
        if (navContainer) navContainer.classList.remove('footer-active');
    }
}

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const headerOffset = 90;

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1200; // Controlled autoscroll speed
                let start = null;

                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const percentage = Math.min(progress / duration, 1);

                    // Easing function (easeInOutCubic)
                    const easing = percentage < 0.5
                        ? 4 * percentage * percentage * percentage
                        : 1 - Math.pow(-2 * percentage + 2, 3) / 2;

                    window.scrollTo(0, startPosition + distance * easing);

                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    }
                }

                window.requestAnimationFrame(step);
            }
        });
    });
}

// ── High-End Manual Smooth Scroll (Inertial Scroll) ──
let targetY = window.scrollY;
let currentY = window.scrollY;
const lerpAmt = 0.075; // Adjust this to change the "weight" of the scroll

function initInertialScroll() {
    // Only apply to desktop/fine pointer devices to preserve native mobile feel
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('wheel', (e) => {
            // Check if we aren't in an input or something that needs native scroll
            if (e.target.closest('textarea') || e.target.closest('input')) return;

            e.preventDefault();
            targetY += e.deltaY;
            targetY = Math.max(0, Math.min(targetY, document.documentElement.scrollHeight - window.innerHeight));
        }, { passive: false });

        function scrollRAF() {
            // Smoothing calculation
            currentY += (targetY - currentY) * lerpAmt;

            // Apply the scroll
            window.scrollTo(0, currentY);

            requestAnimationFrame(scrollRAF);
        }

        requestAnimationFrame(scrollRAF);

        // Sync with external scrolls (like anchor links or JS calls)
        window.addEventListener('scroll', () => {
            if (Math.abs(window.scrollY - currentY) > 10) {
                targetY = window.scrollY;
                currentY = window.scrollY;
            }
        });
    }
}

// Consolidated initialization
window.addEventListener('load', () => {
    handleScrollAnimation();
    handlePillColorChange();
    initFeaturesScroll();
    handleHeaderFooterIntersection();
    initSmoothScroll();
    initInertialScroll();
});

// Optimized scroll listener
let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            handleScrollAnimation();
            handlePillColorChange();
            handleHeaderFooterIntersection();
            isScrolling = false;
        });
        isScrolling = true;
    }
});

function handlePillColorChange() {
    const rightPill = document.getElementById('right-pill');
    const headerLogo = document.getElementById('header-logo');
    const lightSections = document.querySelectorAll('.light-section');

    if (!headerLogo) return;

    const logoRect = headerLogo.getBoundingClientRect();
    const logoCenter = logoRect.top + logoRect.height / 2;

    let isOverLight = false;

    lightSections.forEach(section => {
        const sectionRect = section.getBoundingClientRect();
        if (logoCenter >= sectionRect.top && logoCenter <= sectionRect.bottom) {
            isOverLight = true;
        }
    });

    // Update Right Pill (if it exists and is visible)
    if (rightPill && !rightPill.classList.contains('footer-active')) {
        if (isOverLight) {
            rightPill.classList.add('pill-dark');
        } else {
            rightPill.classList.remove('pill-dark');
        }
    }

    // Update Logo (Always based on current background)
    if (isOverLight) {
        headerLogo.src = 'element/logo-scroll.svg';
    } else {
        headerLogo.src = 'element/logo.svg';
    }
}