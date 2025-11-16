// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Initialize Firebase (config for NSS push notifications)
const firebaseConfig = {
    apiKey: "AIzaSyDWPP4KxT5pBiKhlcisWlp7146Nq0yoMb4",
    authDomain: "nssnotify-efe66.firebaseapp.com",
    projectId: "nssnotify-efe66",
    storageBucket: "nssnotify-efe66.firebasestorage.app",
    messagingSenderId: "869691422272",
    appId: "1:869691422272:web:4dd1eebe5c24bf714811a5"
};

// Initialize Firebase in service worker
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const messaging = firebase.messaging();

// Handle background message
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'NSS Portal';
    const notificationOptions = {
        body: payload.notification?.body || 'You have a new notification',
        icon: '/logo-nss.png',
        badge: '/logo-nss.png',
        tag: 'nss-portal-notification',
        requireInteraction: false,
        data: payload.data || {},
        vibrate: [200, 100, 200],
        actions: [
            { action: 'open', title: 'Open', icon: '/logo-nss.png' },
            { action: 'close', title: 'Close', icon: '/logo-nss.png' }
        ]
    };

    // Show notification
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification clicked:', event.notification);

    event.notification.close();

    // Get notification data
    const data = event.notification.data || {};

    // Open or focus window with appropriate URL
    let urlToOpen = '/student/dashboard';

    if (data.type === 'new-event') {
        urlToOpen = '/student/events';
    } else if (data.type === 'participation-approved' || data.type === 'participation-rejected') {
        urlToOpen = '/student/my-events';
    } else if (data.type === 'contribution-verified' || data.type === 'certificate-issued') {
        urlToOpen = '/student/dashboard';
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Check if there's already a window open
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if ('focus' in client) {
                    client.focus();
                    client.navigate(urlToOpen);
                    return;
                }
            }
            // If not, open a new window
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
    console.log('[firebase-messaging-sw.js] Notification closed:', event.notification);
});

// Keep service worker alive
setInterval(() => {
    console.log('[firebase-messaging-sw.js] Service Worker is running...');
}, 60000);
