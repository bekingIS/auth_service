// firebase/config.js
const admin = require("firebase-admin");
const serviceAccount = require("C:/Users/bekza/Downloads/crowdfunding-dapp-c960f-firebase-adminsdk-fbsvc-014ec577d9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { admin, db };
