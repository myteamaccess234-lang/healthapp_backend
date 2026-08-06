self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Securely store the auth token in Cache Storage
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SET_TOKEN') {
        // MUST use event.waitUntil so the worker doesn't shut down mid-write
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
    let payload = { title: 'Health App Alert', body: 'New notification received', id: null, actions: [] };
    
    if (event.data) {
        try {
            payload = event.data.json();
        } catch (e) {
            payload.body = event.data.text();
        }
    }

    const resolvedId = payload.id || payload._id || payload.notificationId;

    const options = {
        body: payload.body,
        icon: '/logo1.png', // Leading slash prevents relative path resolution issues
        badge: '/logo1.png',
        actions: payload.actions || [],
        data: {
            id: resolvedId,
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
    
    const action = event.action || 'yes'; 
    const notificationId = event.notification.data ? event.notification.data.id : null;

    event.waitUntil(
        (async function() {
            const token = await getStoredToken();

            // 1. Send feedback to backend if token and ID exist
            if (token && notificationId) {
                try {
                    // Tip: Avoid hardcoded localhost in production
                    const response = await fetch(`/api/notifications/${notificationId}/respond`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ response: action })
                    });
                    
                    if (!response.ok) {
                        console.error("Server responded with error:", response.status);
                    }
                } catch (err) {
                    console.error("Background fetch failed:", err);
                }
            } else {
                console.warn("Skipping background fetch: Missing token or notification ID.", { hasToken: !!token, notificationId });
            }

            // 2. Focus existing tab or open a new one
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
