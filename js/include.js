document.addEventListener('DOMContentLoaded', async () => {
    const includes = document.querySelectorAll('[data-include]');
    for (const el of includes) {
        const url = el.getAttribute('data-include');
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to load ' + url);
            el.outerHTML = await res.text();
        } catch (err) {
            console.error(err);
        }
    }
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .dropdown-item').forEach(link => {
        if (link.getAttribute('href') === page) link.classList.add('active');
    });
    if (typeof WOW !== 'undefined') new WOW().init();
    if (typeof jQuery !== 'undefined') {
        if (jQuery.fn.counterUp) {
            jQuery('[data-toggle="counter-up"]').counterUp({ delay: 10, time: 2000 });
        }
        if (jQuery.fn.owlCarousel) {
            jQuery(".testimonial-carousel").owlCarousel({ autoplay: true, smartSpeed: 1500, dots: true, loop: true, center: true, responsive: { 0:{items:1}, 576:{items:1}, 768:{items:2}, 992:{items:3} } });
            jQuery('.vendor-carousel').owlCarousel({ loop: true, margin: 45, dots: false, autoplay: true, smartSpeed: 1000, responsive: { 0:{items:2}, 576:{items:4}, 768:{items:6}, 992:{items:8} } });
        }
    }
});
