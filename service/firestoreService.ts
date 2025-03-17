import { IProduct } from "@/interface/product.interface";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  doc,
  setDoc,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const fetchDataFromFirestore = async (
  collectionName: string,
  orderByField?: string,
  direction: "asc" | "desc" = "desc"
) => {
  const collectionRef = collection(db, collectionName);
  let q = query(collectionRef);

  if (orderByField) {
    q = query(q, orderBy(orderByField, direction));
  }

  try {
    const querySnapshot = await getDocs(q);

    const data: any[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    return data;
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    throw error;
  }
};

export const addDataToFirestore = async (collectionName: string, data: any) => {
  const result = await addDoc(collection(db, collectionName), data);
  return result.id;
};

export const updateDataToFirestore = async (
  collectionName: string,
  id: string,
  data: any
) => {
  const docRef = doc(db, collectionName, id);
  await setDoc(docRef, data, { merge: true });
  return true;
};

export const getAvailableProducts = async () => {
  const dataCollection = collection(db, "products");
  const q = query(dataCollection, where("isActive", "==", true));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as IProduct[];
};

export const getUserByEmail = async (email: string) => {
  const dataCollection = collection(db, "users");
  const q = query(dataCollection, where("email", "==", email), where("isActive", "==", true));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))[0];
};
