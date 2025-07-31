document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showNotification(message, isSuccess = true) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg ${isSuccess ? 'bg-accent' : 'bg-red-500'} text-white z-50 transition-opacity duration-300`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Fade out and remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
