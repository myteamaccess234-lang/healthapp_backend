self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Securely store the auth token in Cache Storage
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SET_TOKEN') {
        event.waitUntil(
            (async () => {
                const cache = await caches.open('auth-cache-v1');
                await cache.put('jwt-token', new Response(event.data.token));
            })()
        );
    }
});

async function getStoredToken() {
    try {
        const cache = await caches.open('auth-cache-v1');
        const response = await cache.match('jwt-token');
        if (response) {
            return await response.text();
        }
    } catch (err) {
        console.error("Failed to retrieve token from cache:", err);
    }
    return null;
}

// HANDLE INCOMING PUSH NOTIFICATIONS
self.addEventListener('push', function(event) {
    let payload = { 
        title: 'Health App Alert', 
        body: 'New notification received', 
        id: null, 
        category: 'Hydration',
        actions: [] 
    };
    
    if (event.data) {
        try {
            payload = event.data.json();
        } catch (e) {
            payload.body = event.data.text();
        }
    }

    const resolvedId = payload.id || payload._id || payload.notificationId;

    // Dynamically inject default quick-action push buttons if none provided
    let notificationActions = payload.actions || [];
    if (notificationActions.length === 0) {
        if (payload.category === 'Meals') {
            notificationActions = [
                { action: 'yes-food', title: 'Meal Logged 🍲' },
                { action: 'no-forgot', title: 'No, I forgot ⏰' }
            ];
        } else {
            notificationActions = [
                { action: 'yes-water', title: 'Drank Water (+0.5L) 💧' },
                { action: 'no-forgot', title: 'No, I forgot ⏰' }
            ];
        }
    }

    const options = {
        body: payload.body || payload.message,
        icon: '/logo1.png',
        badge: '/logo1.png',
        actions: notificationActions,
        data: {
            id: resolvedId,
            category: payload.category,
            actionPayload: payload
        }
    };

    event.waitUntil(
        self.registration.showNotification(payload.title, options)
    );
});

// HANDLE NOTIFICATION CLICK ACTIONS
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    const action = event.action || 'yes-water'; 
    const notificationId = event.notification.data ? event.notification.data.id : null;

    event.waitUntil(
        (async function() {
            const token = await getStoredToken();

            if (token) {
                try {
                    // 1. Log Quick Actions (Water / Meal) directly to Activity Router
                    if (action === 'yes-water' || action === 'yes-food' || action === 'log-meal') {
                        await fetch('/api/activities/log-hydration', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ action: action })
                        });
                    }

                    // 2. Log Snooze (20-min repeat) or general responses to Notification Router
                    if (notificationId) {
                        await fetch(`/api/notifications/${notificationId}/respond`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ action: action, response: action })
                        });
                    }
                } catch (err) {
                    console.error("Background action processing failed:", err);
                }
            } else {
                console.warn("Skipping background fetch: Missing auth token in Cache Storage.");
            }

            // 3. Focus or open app window
            const windowClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
            
            for (let client of windowClients) {
                if (client.url.includes('notes.html') && 'focus' in client) {
                    client.postMessage({ type: 'REFRESH_ACTIVITY', action: action });
                    return client.focus();
                }
            }

            for (let client of windowClients) {
                if ('focus' in client) {
                    client.postMessage({ type: 'REFRESH_ACTIVITY', action: action });
                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow('/notes.html');
            }
        })()
    );
});
