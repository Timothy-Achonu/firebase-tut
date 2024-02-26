import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
// NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA7YCmgU_AiWwsePxh5XOiq8gp-pkReHXA,
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=thoughttrace-7083f.firebaseapp.com,
// NEXT_PUBLIC_FIREBASE_PROJECT_ID=thoughttrace-7083f,
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=thoughttrace-7083f.appspot.com,
// NEXT_PUBLIC_FIREBASE_MESSENGING_SENDER_ID=666941405069,
// NEXT_PUBLIC_FIREBASE_APP_ID=1:666941405069:web:daaf57a545721f0bcc2fc4,
// NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-CKTRKCRN0F

const firebaseConfig = {
  apiKey: "AIzaSyA7YCmgU_AiWwsePxh5XOiq8gp-pkReHXA",
  authDomain: "thoughttrace-7083f.firebaseapp.com",
  projectId: "thoughttrace-7083f",
  storageBucket: "thoughttrace-7083f.appspot.com",
  messagingSenderId: "666941405069",
  appId: "1:666941405069:web:daaf57a545721f0bcc2fc4",
};
// const firebaseConfig = {
//   apiKey: "AIzaSyD_ockO2hvgJ3IhhR8ahSVtHABu00AQkxI",
//   authDomain: "fir-tut-8eb19.firebaseapp.com",
//   projectId: "fir-tut-8eb19",
//   storageBucket: "fir-tut-8eb19.appspot.com",
//   messagingSenderId: "727280019820",
//   appId: "1:727280019820:web:5b4aee3e3693e2b46feb49",
// };

//init firebase app
initializeApp(firebaseConfig);

//init services
const db = getFirestore();
const auth = getAuth();

const colRef = collection(db, "todos");

//queries

const q = query(colRef, orderBy("createdAt"));

function handleGetDocs() {
  getDocs(colRef)
    .then((snapshot) => {
      console.log(snapshot)
      let books = [];
      snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id });
      });
      console.log(books);
    })
    .catch((err) => {
      console.log(err.message);
    });
}
handleGetDocs();

//realtime collection
// onSnapshot(colRef, (snapshot) => {
//   let books = [];
//       snapshot.docs.forEach((doc) => {
//         books.push({ ...doc.data(), id: doc.id });
//       });
//       console.log(books);
// })

const unsubCol = onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log('here:', books);
});
// adding docs

const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then((response) => {
    console.log({ response });
    addBookForm.reset();
    // handleGetDocs();
  });
});

// deleting docs
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "todos", deleteBookForm.id.value);

  deleteDoc(docRef).then((response) => {
    console.log({ deleteResponse: response });
    deleteBookForm.reset();
    // handleGetDocs();
  });
});

//get a single document
const docRef = doc(db, "todos", "MwvdfMPhKrMQzU21H1Zb");

const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

// updateForm docs
const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "todos", updateForm.id.value);
  updateDoc(docRef, {
    title: "12 rules for life",
  }).then((response) => {
    updateForm.reset();
    // handleGetDocs();
  });
});

// signing users up
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("user created:", cred.user);
      signupForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// logging in and out
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then((response) => {
      console.log(response);
      console.log("user signed out");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    console.log("user logged inhhh:", cred.user);
  } catch (err) {
    console.log(err.message);
  } finally {
    loginForm.reset();
  }
});

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log("user status changed:", user);
});

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector(".unsub");

// unsubButton.addEventListener('click', () => {
//   console.log('unsubscribing')
//   unsubCol()
//   unsubDoc()
//   unsubAuth()
// })
