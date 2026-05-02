إصلاح إشعارات متجر MS

ارفع هذه الملفات إلى GitHub:

1) firebase-messaging-sw.js
استبدل القديم. لازم يكون بجانب index.html مباشرة.

2) firebase-notifications.js
ارفعه بجانب index.html.

3) main.tsx
إذا مشروعك React/Vite استبدل main.tsx بهذا الملف.
أو فقط أضف داخله:
import "./firebase-notifications.js";

إذا ما تريد تعدل main.tsx:
افتح index.html وأضف قبل </body>:
<script src="./firebase-notifications.js"></script>

بعد الرفع:
- احذف تطبيق MS من الهاتف.
- امسح بيانات موقع msstore95.github.io من Chrome.
- افتح الموقع من Chrome.
- اضغط تفعيل الإشعارات ووافق.
- جرّب إرسال إشعار من Firebase Messaging.
