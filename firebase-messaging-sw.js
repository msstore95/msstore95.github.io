importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyDakH4F8S6tmdSVTFENXMINk5oQABPSSVo",
  authDomain: "msstore-5c5f4.firebaseapp.com",
  projectId: "msstore-5c5f4",
  messagingSenderId: "254756613602",
  appId: "1:254756613602:web:35825d0b88c3dae8545dbb"
});

const messaging = firebase.messaging();
