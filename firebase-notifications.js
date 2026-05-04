import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyDakH4F8S6tmdSVTFENMXInk5oQABPSSVo",
  authDomain: "msstore-5c5f4.firebaseapp.com",
  projectId: "msstore-5c5f4",
  storageBucket: "msstore-5c5f4.appspot.com",
  messagingSenderId: "254756613602",
  appId: "1:254756613602:web:35825d0b88c3dae8545dbb"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// اطلب اذن الاشعارات
Notification.requestPermission().then((permission) => {
  if (permission === "granted") {
    console.log("تم السماح بالاشعارات ✅");

    getToken(messaging, {
      vapidKey: "mCakon0QaK_8ea6NyURC5saDooOt6Btm8TM94tusIcE"
    }).then((currentToken) => {
      if (currentToken) {
        console.log("توكن الجهاز 👇");
        console.log(currentToken);

        // هنا تگدر تخزن التوكن بفirebase
      } else {
        console.log("ماكو توكن ❌");
      }
    });
  } else {
    console.log("تم رفض الاشعارات ❌");
  }
});

// استقبال الاشعارات اثناء فتح الموقع
onMessage(messaging, (payload) => {
  console.log("وصل اشعار 👇");
  console.log(payload);

  alert(payload.notification.title + "\n" + payload.notification.body);
});
