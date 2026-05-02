import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyDakH4F8s6tmdSVTFENXMInK5oQABPSSVo",
  authDomain: "msstore-5c5f4.firebaseapp.com",
  databaseURL: "https://msstore-5c5f4-default-rtdb.firebaseio.com",
  projectId: "msstore-5c5f4",
  storageBucket: "msstore-5c5f4.firebasestorage.app",
  messagingSenderId: "254756613602",
  appId: "1:254756613602:web:35825d0b88c3dae8545dbb",
  measurementId: "G-QCWRTL41RZ"
};

// 👇 هذا المفتاح اللي جبناه من Firebase
const VAPID_KEY = "BKx-21HHwArOX8ainGQK5Pe0y_1qi56tZl3P-wckQ1RBoTW5s8RZ0nWUcSw8Xu5vzv6bRJ0o8oJ-_rKU1RT7SyU";

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

async function startFCM() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    console.log("TOKEN:", token);
  } catch (err) {
    console.log(err);
  }
}

startFCM();

onMessage(messaging, (payload) => {
  new Notification(payload.notification.title, {
    body: payload.notification.body,
  });
});
