importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyAn0y49jyaoLHyL6P7bce7IHcrsVNJ3ERM",
  authDomain: "msstore-5c5f4.firebaseapp.com",
  databaseURL: "https://msstore-5c5f4-default-rtdb.firebaseio.com",
  projectId: "msstore-5c5f4",
  storageBucket: "msstore-5c5f4.firebasestorage.app",
  messagingSenderId: "254756613602",
  appId: "1:254756613602:web:msstore"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const title = (payload.notification && payload.notification.title) || (payload.data && payload.data.title) || "متجر MS";
  const options = {
    body: (payload.notification && payload.notification.body) || (payload.data && payload.data.body) || "وصل إشعار جديد",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: { url: "/", ...(payload.data || {}) }
  };
  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
