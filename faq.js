document.addEventListener('DOMContentLoaded', function() {
    const accordionButtons = document.querySelectorAll('[data-accordion-target]');

    function toggleAccordion(button) {
        const targetId = button.getAttribute('data-accordion-target');
        const content = document.getElementById(targetId);
        const arrow = button.querySelector('svg');

        // Close all other accordion items
        document.querySelectorAll('[data-accordion-target]').forEach(btn => {
            if (btn !== button) {
                const otherId = btn.getAttribute('data-accordion-target');
                const otherContent = document.getElementById(otherId);
                const otherArrow = btn.querySelector('svg');
                
                otherContent.classList.add('hidden');
                otherArrow.classList.remove('rotate-180');
            }
        });

        // Toggle current accordion item
        content.classList.toggle('hidden');
        if (!content.classList.contains('hidden')) {
            arrow.classList.add('rotate-180');
            
            // Smooth scroll into view if the content is not fully visible
            const rect = content.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
            );

            if (!isVisible) {
                content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        } else {
            arrow.classList.remove('rotate-180');
        }
    }

    // Add click event listeners to all accordion buttons
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => toggleAccordion(button));
    });

    // Add keyboard accessibility
    accordionButtons.forEach(button => {
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleAccordion(button);
            }
        });
    });
});
