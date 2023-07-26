// This imports loads the firebase namespace along with all its type information.
import firebase from 'firebase/app'

// These import load individual services into the firebase namespace.
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
// import 'firebase/functions'
// import {auth} from 'firebase'
import firebaseConfig from './firebaseConfig'

const app = firebase.initializeApp(firebaseConfig)

const db = app.firestore()
// const storage = app.storage()
const auth = app.auth()
// const functions = app.functions()
const usersCollection = db.collection('users');
const postsCollection = db.collection('posts');
const commentsCollection = db.collection('comments');
const likesCollection = db.collection('likes');


// functions.useFunctionsEmulator("http://localhost:5001");

export { db, auth, firebase, usersCollection,  postsCollection, commentsCollection, likesCollection}