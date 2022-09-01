const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const functions = require("firebase-functions");
const admin = require('firebase-admin');
const uuid = require('uuid')
var serviceAccount = require("./spoilme-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const app = express();


app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
app.use(cors({ origin: true }));


app.post('/spoils',(req, res) => {
  const {body} =req;
  const id = uuid.v4();
  const data = {
    id,
    name:body.name,
    from:body.from,
    image:body.image,
    to:body.to,
    date: new Date(),
    relationId:-1,
  }
  db.collection("spoils").doc(id).set(data)
.then(() => {
    res.status(200).json({
      data:data,
      message:'Data saved',
      status:200
    })
})
.catch((error) => {
    console.error("Error writing document: ", error);
    res.status(500).json({
      data:data,
      message:'Something went wrong',
      status:500
    })
});

});


exports.api = functions.https.onRequest(app);
