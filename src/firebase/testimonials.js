import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'

const COLLECTION_NAME = 'testimonials'

// Fetch public testimonials (published only, ordered by priority or creation)
export async function getPublishedTestimonials() {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('published', '==', true),
      where('deleted', '==', false)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error fetching published testimonials:', error)
    return []
  }
}

// Fetch all testimonials for admin dashboard
export async function getAllTestimonials() {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME))
    return snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((item) => !item.deleted)
  } catch (error) {
    console.error('Error fetching admin testimonials:', error)
    throw error
  }
}

// Create new testimonial
export async function createTestimonial(data) {
  return await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    published: data.published ?? true,
    deleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

// Update existing testimonial
export async function updateTestimonial(id, data) {
  const docRef = doc(db, COLLECTION_NAME, id)
  return await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

// Toggle published status
export async function setTestimonialPublished(id, published) {
  const docRef = doc(db, COLLECTION_NAME, id)
  return await updateDoc(docRef, {
    published,
    updatedAt: serverTimestamp(),
  })
}

// Soft delete
export async function deleteTestimonial(id) {
  const docRef = doc(db, COLLECTION_NAME, id)
  return await updateDoc(docRef, {
    deleted: true,
    updatedAt: serverTimestamp(),
  })
}