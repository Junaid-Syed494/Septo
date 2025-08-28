// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize QuickFix Customer App
    app = new QuickFixCustomerApp();
    
    // Register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('SW registered: ', registration);
                })
                .catch((registrationError) => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
});