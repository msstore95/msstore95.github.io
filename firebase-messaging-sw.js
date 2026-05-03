importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyDakH4F856tmdSVTFENXMINk5oQABPSSVo",
  authDomain: "msstore-5c5f4.firebaseapp.com",
  databaseURL: "https://msstore-5c5f4-default-rtdb.firebaseio.com",
  projectId: "msstore-5c5f4",
  storageBucket: "msstore-5c5f4.appspot.com",
  messagingSenderId: "25475613602",
  appId: "1:25475613602:web:35825d0b88c3dae8545dbb"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const title =
    (payload.notification && payload.notification.title) ||
    (payload.data && payload.data.title) ||
    "إشعار جديد";

  const body =
    (payload.notification && payload.notification.body) ||
    (payload.data && payload.data.body) ||
    "وصل إشعار جديد";

  self.registration.showNotification(title, {
    body: body,
    icon: "/icon-192.png",
    badge: "/icon-192.png"
  });
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
