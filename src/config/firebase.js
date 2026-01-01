// Configuración de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc, onSnapshot } from "firebase/firestore";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBTCXRaypz8WrcJ9LkHM0SbLYrgi-fhTt8",
  authDomain: "champip-1f1ac.firebaseapp.com",
  projectId: "champip-1f1ac",
  storageBucket: "champip-1f1ac.firebasestorage.app",
  messagingSenderId: "755364700190",
  appId: "1:755364700190:web:68e7eaa83db9c50679ce0f",
  measurementId: "G-3ZFS3J4J3Y"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ========== FOTOS ==========
export const photosCollection = collection(db, 'photos');

export const savePhoto = async (photo) => {
  try {
    await setDoc(doc(db, 'photos', String(photo.id)), photo);
    return true;
  } catch (error) {
    console.error('Error guardando foto:', error);
    throw error;
  }
};

export const getPhotos = async () => {
  try {
    const snapshot = await getDocs(photosCollection);
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error obteniendo fotos:', error);
    return [];
  }
};

export const deletePhoto = async (photoId) => {
  try {
    await deleteDoc(doc(db, 'photos', String(photoId)));
    return true;
  } catch (error) {
    console.error('Error eliminando foto:', error);
    throw error;
  }
};

// Escuchar cambios en tiempo real
export const subscribeToPhotos = (callback) => {
  return onSnapshot(photosCollection, (snapshot) => {
    const photos = snapshot.docs.map(doc => doc.data());
    callback(photos);
  });
};

// ========== FOTO PRINCIPAL (HERO) ==========
export const saveHeroPhoto = async (photo) => {
  try {
    await setDoc(doc(db, 'settings', 'heroPhoto'), { photo });
    return true;
  } catch (error) {
    console.error('Error guardando foto principal:', error);
    throw error;
  }
};

export const getHeroPhoto = async () => {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'heroPhoto'));
    return docSnap.exists() ? docSnap.data().photo : null;
  } catch (error) {
    console.error('Error obteniendo foto principal:', error);
    return null;
  }
};

export const subscribeToHeroPhoto = (callback) => {
  return onSnapshot(doc(db, 'settings', 'heroPhoto'), (docSnap) => {
    callback(docSnap.exists() ? docSnap.data().photo : null);
  });
};

// ========== LÍNEA DEL TIEMPO ==========
export const timelineCollection = collection(db, 'timeline');

export const saveTimelineEvent = async (event) => {
  try {
    await setDoc(doc(db, 'timeline', String(event.id)), event);
    return true;
  } catch (error) {
    console.error('Error guardando evento:', error);
    throw error;
  }
};

export const getTimelineEvents = async () => {
  try {
    const snapshot = await getDocs(timelineCollection);
    return snapshot.docs.map(doc => doc.data()).sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error('Error obteniendo timeline:', error);
    return [];
  }
};

export const deleteTimelineEvent = async (eventId) => {
  try {
    await deleteDoc(doc(db, 'timeline', String(eventId)));
    return true;
  } catch (error) {
    console.error('Error eliminando evento:', error);
    throw error;
  }
};

export const subscribeToTimeline = (callback) => {
  return onSnapshot(timelineCollection, (snapshot) => {
    const events = snapshot.docs.map(doc => doc.data()).sort((a, b) => new Date(a.date) - new Date(b.date));
    callback(events);
  });
};

export { db };
