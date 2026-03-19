importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBrCc6J2IcUuPN-GQrpcXeht9QQPWoRvrQ",
    authDomain: "bloom-app-92ab9.firebaseapp.com",
    projectId: "bloom-app-92ab9",
    storageBucket: "bloom-app-92ab9.appspot.com",
    messagingSenderId: "679488612837",
    appId: "1:679488612837:web:2f625517fab8baa3cde70c",
    measurementId: "G-XQ8T0H1QXK"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});