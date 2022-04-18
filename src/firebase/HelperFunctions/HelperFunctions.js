import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import uuid from 'react-native-uuid'
export async function saveData(collection, doc, jsonObject) {
    firestore()
        .collection(collection)
        .doc(doc)
        .set(jsonObject, { merge: true })
        .then(res => console.log(res))
        .catch(function (error) {
            console.log('Error writing document: ', error);
        });
}
export async function getData(collection, doc, objectKey) {
    // check if data exists on the given path
    if (objectKey === undefined) {
        return firestore()
            .collection(collection)
            .doc(doc)
            .get()
            .then(function (doc) {
                if (doc.exists) {
                    return doc.data();
                } else {
                    return false;
                }
            });
    } else {
        return firestore()
            .collection(collection)
            .doc(doc)
            .get()
            .then(function (doc) {
                if (doc.exists && doc.data()[objectKey] != undefined) {
                    return doc.data()[objectKey];
                } else {
                    return false;
                }
            });
    }
}
export async function getAllOfCollection(collection) {
    let data = [];
    let querySnapshot = await firestore().collection(collection)
    // .orderBy('lastUpdated', 'desc')
    .get();
    querySnapshot.forEach(function (doc) {
        if (doc.exists) {
            //console.log(doc.data());
            data.push(doc.data());
        } else {
            console.log('No document found!');
        }
    });
    return data;
}
export async function uploadImage(uri, path) {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const ref = storage().ref(path+uuid.v4());
        const task = ref.put(blob);
        return new Promise((resolve, reject) => {
            task.on(
                'state_changed',
                () => { },
                (err) => {
                    reject(err);
                },
                async () => {
                    const url = await task.snapshot.ref.getDownloadURL();
                    resolve(url);
                },
            );
        });
    } catch (err) {
        console.log('uploadImage error: ' + err.message);
    }
}
export const removeFromArray = async (collection, doc, array, index) => {
    let docRef = firestore().collection(collection).doc(doc);
    let docData = await docRef.get();
    if (docData.exists && docData.data()[array][index] != undefined) {
        docRef.update({

            [array]: firestore.FieldValue.arrayRemove(
                docData.data()[array][index],
            ),
        });
    }
};

