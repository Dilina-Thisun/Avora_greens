/**
 * ================================================================
 *   LUXURY HOTEL & CATERING SERVICE JAVASCRIPT LOGIC
 * ================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNavigation();
    initTextSplitting();
    initScrollEffects();
    initTestimonialSlider();
    initGallery();
    initBookingForm();
    initContactForm();
});

/**
 * Preloader Transition Handler
 */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) {
        // Trigger scroll reveals immediately if preloader is not present
        setTimeout(initScrollEffects, 100);
        return;
    }

    // Hide preloader when page finishes loading
    window.addEventListener('load', () => {
        fadeOutPreloader();
    });

    // Fallback: hide preloader after 3 seconds in case load event takes too long
    setTimeout(() => {
        if (!preloader.classList.contains('fade-out')) {
            fadeOutPreloader();
        }
    }, 3000);

    function fadeOutPreloader() {
        preloader.classList.add('fade-out');
        
        // Trigger scroll reveal for elements in viewport once the preloader transitions away
        setTimeout(() => {
            initScrollEffects();
            // Automatically reveal hero title and tags
            document.querySelectorAll('.hero .scroll-reveal, .hero .split-reveal, .hero [class*="reveal-"]').forEach(el => {
                el.classList.add('revealed');
            });
        }, 500);
    }
}

/**
 * Navigation Menu & Mobile Drawer
 */
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Scroll styling for Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Split text headers into words and characters for luxury reveals
 */
function initTextSplitting() {
    const targets = document.querySelectorAll('.split-reveal');
    
    targets.forEach(target => {
        // Only split if not already split and target has content
        if (target.querySelector('.word-wrapper') || !target.textContent.trim()) return;

        const text = target.textContent.trim();
        target.innerHTML = '';
        
        const words = text.split(/\s+/);
        let charIndex = 0;

        words.forEach((word, wordIdx) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word-wrapper';
            
            const chars = word.split('');
            chars.forEach(char => {
                const charContainer = document.createElement('span');
                charContainer.className = 'char-wrapper';
                
                const charSpan = document.createElement('span');
                charSpan.className = 'char';
                charSpan.textContent = char;
                charSpan.style.setProperty('--char-index', charIndex);
                charIndex++;
                
                charContainer.appendChild(charSpan);
                wordSpan.appendChild(charContainer);
            });
            
            target.appendChild(wordSpan);
            
            // Add spacing between words
            if (wordIdx < words.length - 1) {
                const space = document.createTextNode(' ');
                target.appendChild(space);
            }
        });
    });
}

/**
 * Scroll Reveal & Animations
 */
function initScrollEffects() {
    const reveals = document.querySelectorAll('.scroll-reveal, .reveal-slide-up, .reveal-slide-left, .reveal-slide-right, .reveal-scale, .split-reveal');
    
    if ('IntersectionObserver' in window && reveals.length > 0) {
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Reveal once
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null,
            threshold: 0.05,
            rootMargin: '0px 0px -30px 0px'
        });

        reveals.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        reveals.forEach(el => el.classList.add('revealed'));
    }
}


/**
 * Testimonials Slider Logic
 */
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.slider-controls');
    
    if (slides.length === 0) return;

    let currentSlide = 0;
    const dots = [];

    // Clear controls container first
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        // Create dots dynamically
        slides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(idx));
            dotsContainer.appendChild(dot);
            dots.push(dot);
        });
    }

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    // Auto rotate every 6 seconds
    setInterval(() => {
        let next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }, 6000);
}

/**
 * Gallery Filtering & Lightbox Modal
 */
function initGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    
    if (galleryItems.length === 0) return;

    // --- Part 1: Gallery Filtering ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400); // match style.css transitions
                }
            });
        });
    });

    // --- Part 2: Custom Lightbox Modal ---
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    let activeImages = [];
    let currentIndex = 0;

    // Open Lightbox
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Collect only currently visible images for slider navigation
            activeImages = Array.from(galleryItems).filter(el => el.style.display !== 'none');
            currentIndex = activeImages.indexOf(item);
            
            openLightbox();
            updateLightboxContent();
        });
    });

    function openLightbox() {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scroll
    }

    function updateLightboxContent() {
        if (activeImages.length === 0) return;
        const targetItem = activeImages[currentIndex];
        const img = targetItem.querySelector('img');
        const title = targetItem.querySelector('.gallery-overlay-title').textContent;
        const category = targetItem.querySelector('.gallery-overlay-cat').textContent;

        lightboxImg.src = img.src;
        lightboxCaption.innerHTML = `${title} <br><span style="font-size: 0.8rem; color: #c5a880; font-family: var(--font-body); letter-spacing: 1.5px; text-transform: uppercase;">${category}</span>`;
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + activeImages.length) % activeImages.length;
            updateLightboxContent();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % activeImages.length;
            updateLightboxContent();
        });
    }

    // Close on click outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    // Close on escape key, navigation with arrows
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
        if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    });
}

/**
 * Event Booking Page Logic & Dynamic Panel Summary
 */
function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    const summaryPanel = document.getElementById('bookingSummary');
    
    if (!bookingForm) return;

    // Elements in the form
    const inputName = document.getElementById('b_name');
    const inputPhone = document.getElementById('b_phone');
    const inputEmail = document.getElementById('b_email');
    const selectEvent = document.getElementById('b_event');
    const inputDate = document.getElementById('b_date');
    const inputGuests = document.getElementById('b_guests');
    const txtMessage = document.getElementById('b_message');

    // Set date input minimum value to today
    if (inputDate) {
        const today = new Date().toISOString().split('T')[0];
        inputDate.min = today;
    }

    // Pre-fill Event dropdown if service parameter is in URL
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam && selectEvent) {
        selectEvent.value = serviceParam;
    }

    // Live Summary event listeners
    const formFields = [inputName, selectEvent, inputDate, inputGuests];
    formFields.forEach(field => {
        if (field) {
            field.addEventListener('input', updateSummary);
            field.addEventListener('change', updateSummary);
        }
    });

    // Run initial update for pre-filled parameters
    updateSummary();

    function updateSummary() {
        if (!summaryPanel) return;

        // Elements in summary panel
        const sName = document.getElementById('s_name');
        const sEvent = document.getElementById('s_event');
        const sDate = document.getElementById('s_date');
        const sGuests = document.getElementById('s_guests');
        const sPrice = document.getElementById('s_price');

        if (sName && inputName) sName.textContent = inputName.value || 'Not specified';
        
        if (sEvent && selectEvent) {
            const eventVal = selectEvent.value;
            sEvent.textContent = eventVal ? selectEvent.options[selectEvent.selectedIndex].text : 'Select Event';
        }
        
        if (sDate && inputDate) {
            sDate.textContent = inputDate.value ? formatDate(inputDate.value) : 'Select Date';
        }
        
        if (sGuests && inputGuests) {
            sGuests.textContent = inputGuests.value ? `${inputGuests.value} Guests` : 'Not specified';
        }

        // Live mock pricing estimator
        if (sPrice && selectEvent && inputGuests) {
            const guestCount = parseInt(inputGuests.value) || 0;
            const eventType = selectEvent.value;
            let costPerGuest = 0;

            switch (eventType) {
                case 'wedding': costPerGuest = 1000; break;
                case 'catering': costPerGuest = 800; break;
                case 'corporate': costPerGuest = 500; break;
                case 'party': costPerGuest = 650; break;
                default: costPerGuest = 0;
            }

            if (costPerGuest > 0 && guestCount > 0) {
                const total = costPerGuest * guestCount;
                sPrice.textContent = `Rs ${total.toLocaleString()}`;
            } else {
                sPrice.textContent = 'Rs0';
            }
        }
    }

    // Helper date formatting
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Form Submit Handler
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Check validation
        if (!inputName.value || !inputPhone.value || !inputEmail.value || !selectEvent.value || !inputDate.value || !inputGuests.value) {
            alert('Please fill out all required fields.');
            return;
        }

        // Save booking to LocalStorage for persistence demonstration
        const bookingData = {
            name: inputName.value,
            phone: inputPhone.value,
            email: inputEmail.value,
            event: selectEvent.value,
            date: inputDate.value,
            guests: inputGuests.value,
            message: txtMessage.value,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('latest_booking', JSON.stringify(bookingData));

        // Show Success Modal
        showSuccessModal(
            'Inquiry Received',
            `Thank you, <strong>${bookingData.name}</strong>. Your luxury event booking inquiry is registered. A hospitality consultant will contact you via email (${bookingData.email}) within 24 hours to design your experience.`
        );

        // Reset Form
        bookingForm.reset();
        updateSummary();
    });
}

/**
 * Contact Form Logic
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('c_name').value;
        const email = document.getElementById('c_email').value;
        const message = document.getElementById('c_message').value;

        if (!name || !email || !message) {
            alert('Please complete all message fields.');
            return;
        }

        showSuccessModal(
            'Message Transmitted',
            `Thank you, <strong>${name}</strong>. Your message has been sent successfully. We will follow up shortly at <strong>${email}</strong>.`
        );

        contactForm.reset();
    });
}

/**
 * Custom Luxury Confirmation Modal
 */
function showSuccessModal(title, desc) {
    // Check if modal container exists or create it
    let modalOverlay = document.getElementById('successModal');
    
    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'successModal';
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal-box glass-panel text-center scroll-reveal revealed">
                <div class="modal-icon">✦</div>
                <h3 class="modal-title gold-text"></h3>
                <p class="modal-desc"></p>
                <button class="btn btn-primary modal-close-btn">Acknowledge</button>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        // Close button click listener
        modalOverlay.querySelector('.modal-close-btn').addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
        
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }

    // Populate contents
    modalOverlay.querySelector('.modal-title').innerHTML = title;
    modalOverlay.querySelector('.modal-desc').innerHTML = desc;

    // Show modal
    setTimeout(() => {
        modalOverlay.classList.add('active');
    }, 100);
}

