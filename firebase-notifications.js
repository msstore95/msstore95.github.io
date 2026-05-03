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

const VAPID_KEY = "BFG_qDpx9U7LIRGfniUkhtPzs_72PNoaVpakCFcUuWmnwsL-SL-NKLNlbCQ_564AJUjGBURatxv3iT-PA7iMYco";
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

    if (!token) {
      alert("ما طلع Token. جرّب تحدث الصفحة أو امسح الكاش.");
      return;
    }

    localStorage.setItem("fcm_token", token);
    console.log("TOKEN:", token);
    alert("TOKEN: " + token);
  } catch (err) {
    console.error("FCM ERROR:", err);
    alert("FCM ERROR: " + (err && err.message ? err.message : err));
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
