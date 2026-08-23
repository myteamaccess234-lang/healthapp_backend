// ------------------- BACKGROUND NOTIFICATION SCHEDULER -------------------

// Runs every minute.
// Timezone is explicitly set to India (Asia/Kolkata).
cron.schedule('* * * * *', async () => {
    try {
        const now = new Date();

        // ==============================================================
        // 1. HANDLE SNOOZED NOTIFICATIONS
        // ==============================================================

        const dueNotifications = await Notification.find({
            status: 'Snoozed',
            snoozedUntil: { $lte: now }
        });

        for (const notification of dueNotifications) {
            const subscriptions = await Subscription.find({
                userId: notification.userId
            });

            const payload = JSON.stringify({
                title: `⏰ Reminder: ${notification.title || 'Health Alert'}`,
                body: notification.message || notification.body || 'You have a scheduled reminder!',
                _id: notification._id.toString(),
                category: notification.category || 'General',
                isInteractive: notification.isInteractive || false
            });

            for (const sub of subscriptions) {
                webpush.sendNotification(
                    {
                        endpoint: sub.endpoint,
                        keys: sub.keys
                    },
                    payload
                ).catch((err) =>
                    console.error("Cron Push Error:", err.message)
                );
            }

            notification.status = 'Unread';
            notification.snoozedUntil = null;
            await notification.save();
        }

        // ==============================================================
        // 2. INDIA TIME
        // ==============================================================

        const indiaTime = new Intl.DateTimeFormat('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).formatToParts(now);

        const hour = Number(
            indiaTime.find(part => part.type === 'hour').value
        );

        const minute = Number(
            indiaTime.find(part => part.type === 'minute').value
        );

        // ==============================================================
        // 3. CURRENT DATE IN INDIA
        // ==============================================================

        const indiaDate = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(now);

        // ==============================================================
        // 4. 10:15 PM — SLEEP NOTIFICATION
        // ==============================================================

        if (hour === 22 && minute === 15) {

            console.log(">>> 10:15 PM: Sending sleep notifications...");

            const users = await User.find({});

            for (const user of users) {

                // Prevent duplicate sleep notification
                const alreadySent = await Notification.findOne({
                    userId: user._id,
                    category: 'Sleep',
                    title: '🌙 Sleep Time',
                    createdAt: {
                        $gte: new Date(`${indiaDate}T00:00:00+05:30`)
                    }
                });

                if (alreadySent) {
                    continue;
                }

                const notification = await Notification.create({
                    userId: user._id,
                    category: 'Sleep',
                    title: '🌙 Sleep Time',
                    message: 'It is 10:15 PM. Are you going to sleep?',
                    isInteractive: true,
                    status: 'Unread'
                });

                const subscriptions = await Subscription.find({
                    userId: user._id
                });

                const payload = JSON.stringify({
                    title: '🌙 Sleep Time',
                    body: 'It is 10:15 PM. Are you going to sleep?',
                    _id: notification._id.toString(),
                    category: 'Sleep',
                    isInteractive: true,
                    actions: [
                        {
                            action: 'start-sleep',
                            title: 'Yes, I am going to sleep'
                        },
                        {
                            action: 'no',
                            title: 'No'
                        }
                    ]
                });

                for (const sub of subscriptions) {
                    webpush.sendNotification(
                        {
                            endpoint: sub.endpoint,
                            keys: sub.keys
                        },
                        payload
                    ).catch((err) =>
                        console.error("Sleep Push Error:", err.message)
                    );
                }
            }
        }

        // ==============================================================
        // 5. 6:45 AM — WAKE-UP NOTIFICATION
        // ==============================================================

        if (hour === 6 && minute === 45) {

            console.log(">>> 6:45 AM: Sending wake-up notifications...");

            const users = await User.find({});

            for (const user of users) {

                // Prevent duplicate wake-up notification
                const alreadySent = await Notification.findOne({
                    userId: user._id,
                    category: 'Sleep',
                    title: '🌅 Good Morning',
                    createdAt: {
                        $gte: new Date(`${indiaDate}T00:00:00+05:30`)
                    }
                });

                if (alreadySent) {
                    continue;
                }

                const notification = await Notification.create({
                    userId: user._id,
                    category: 'Sleep',
                    title: '🌅 Good Morning',
                    message: 'Good morning! Are you awake?',
                    isInteractive: true,
                    status: 'Unread'
                });

                const subscriptions = await Subscription.find({
                    userId: user._id
                });

                const payload = JSON.stringify({
                    title: '🌅 Good Morning',
                    body: 'Good morning! Are you awake?',
                    _id: notification._id.toString(),
                    category: 'Sleep',
                    isInteractive: true,
                    actions: [
                        {
                            action: 'wake-up',
                            title: 'Yes, I am awake'
                        },
                        {
                            action: 'no',
                            title: 'No'
                        }
                    ]
                });

                for (const sub of subscriptions) {
                    webpush.sendNotification(
                        {
                            endpoint: sub.endpoint,
                            keys: sub.keys
                        },
                        payload
                    ).catch((err) =>
                        console.error("Wake Push Error:", err.message)
                    );
                }
            }
        }

    } catch (err) {
        console.error(
            "Background notification scheduler error:",
            err.message
        );
    }
}, {
    timezone: 'Asia/Kolkata'
});
