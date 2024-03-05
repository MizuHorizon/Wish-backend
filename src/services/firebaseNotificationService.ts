import admin from 'firebase-admin';
const serviceAccount =require("../config/wish-firebase.json");

const payload: admin.messaging.MessagingPayload = {
    notification: {
      title: 'Hello from Node.js!',
      body: 'This is a Firebase Cloud Messaging notification sent from Node.js',
    },
  };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any)
});

export const sendNotification = ()=> {
admin.messaging().sendToDevice("fkrEcVT1QnSlwV9OrcyT0N:APA91bHYbxR-17998Ie1f1uz49ymRPt-fx8fi6ydc-YPsZ2k1jWTJaXJXSPPUmxw2mVGbHDw8rVHKnic8Ne-GT_OOVTSLy0ZrjJcsircXl5hTVfbwxofXpr4SXBj3dciIXt2NfcQGtLT",payload)
.then((response) => {
    console.log('Notification sent successfully:', response);
  })
  .catch((error) => {
    console.error('Error sending notification:', error);
  });

}

