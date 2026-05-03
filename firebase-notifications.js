import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyDakH4F856tmdSVTFENXMINk5oQABPSSVo",
  authDomain: "msstore-5c5f4.firebaseapp.com",
  databaseURL: "https://msstore-5c5f4-default-rtdb.firebaseio.com",
  projectId: "msstore-5c5f4",
  storageBucket: "msstore-5c5f4.appspot.com",
  messagingSenderId: "25475613602",
  appId: "1:25475613602:web:35825d0b88c3dae8545dbb",
  measurementId: "G-QCWRTL41RZ"
};

const VAPID_KEY = "BKx-21HwArOX8aiNGQK5PeOy_1qi56tZ13P-wcKQ1RBoTW5sRZOmlwCsW8Xu5vz6ybRJO8oJ-_rKUlRT7SYU";

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

async function startFCM() {
  try {
    if (!("Notification" in window)) {
      alert("هذا المتصفح لا يدعم الإشعارات");
      return;
    }

    if (!("serviceWorker" in navigator)) {
      alert("هذا المتصفح لا يدعم Service Worker");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      alert("لازم تضغط سماح حتى تشتغل الإشعارات");
      return;
    }

    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    alert("TOKEN: " + token);
    localStorage.setItem("fcm_token", token);

  } catch (err) {
    alert("FCM ERROR: " + err.message);
    console.error("FCM ERROR:", err);
  }
}

startFCM();

onMessage(messaging, (payload) => {
  const title =
    payload.notification?.title ||
    payload.data?.title ||
    "إشعار جديد";

  const body =
    payload.notification?.body ||
    payload.data?.body ||
    "وصل إشعار جديد";

  new Notification(title, {
    body: body,
    icon: "/icon-192.png",
    badge: "/icon-192.png"
  });
});
