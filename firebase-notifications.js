import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyDaK4F8S6tmdSVTFEMWXInk5oQABPSSVo",
  authDomain: "msstore-5c5f4.firebaseapp.com",
  projectId: "msstore-5c5f4",
  storageBucket: "msstore-5c5f4.appspot.com",
  messagingSenderId: "25475613602",
  appId: "1:25475613602:web:358250bb88c3dae8545dbb"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

async function startNotifications() {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("رفض الإشعارات ❌");
      return;
    }

    const registration = await navigator.serviceWorker.register("./firebase-messaging-sw.js");

    const token = await getToken(messaging, {
      vapidKey: "mCakom0QAk_6eaN6YuRC5saDooDt6BtmtM94tusIcE",
      serviceWorkerRegistration: registration
    });

    if (token) {
      console.log("FCM TOKEN ✅");
      console.log(token);
      alert("تم تفعيل الإشعارات ✅");
    } else {
      console.log("ماكو توكن ❌");
    }
  } catch (err) {
    console.log("خطأ بالإشعارات ❌", err);
  }
}

startNotifications();

onMessage(messaging, (payload) => {
  alert(payload.notification.title + "\n" + payload.notification.body);
});
