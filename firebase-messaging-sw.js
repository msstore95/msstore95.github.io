importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDakH4F8S6tmdSVTFENMXInk5oQABPSSVo",
  authDomain: "msstore-5c5f4.firebaseapp.com",
  projectId: "msstore-5c5f4",
  storageBucket: "msstore-5c5f4.appspot.com",
  messagingSenderId: "254756613602",
  appId: "1:254756613602:web:35825d0b88c3dae8545dbb"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("اشعار بالخلفية 👇", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon-192.png"
  });
});
