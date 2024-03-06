import admin from "firebase-admin";
const serviceAccount = require("../config/wish-firebase.json");

// const payload: admin.messaging.MessagingPayload = {
//     notification: {
//       title: 'Hello from Wish!',
//       body: 'This is a Firebase Cloud Messaging notification sent from Node.js',
//       to:"",
//     },
//   };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
});

export const sendNotification = (
  userfcmToken: string,
  payload: admin.messaging.MessagingPayload
) => {
  admin
    .messaging()
    .send({
      token: userfcmToken,
      notification: payload.notification,
      data: payload.data,
    })
    .then((response) => {
      console.log("Notification sent successfully:", response);
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
    });
};
