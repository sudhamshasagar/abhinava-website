import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from './config'


const projectsRef = collection(db, 'projects')


export async function getProjects() {
  const snapshot = await getDocs(projectsRef)

  return snapshot.docs
    .map((projectDoc) => ({
      id: projectDoc.id,
      ...projectDoc.data(),
    }))
    .filter((project) => project.deleted !== true)
    .sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0
      const bTime = b.createdAt?.seconds || 0

      return bTime - aTime
    })
}


export async function getPublishedProjects() {
  const projectsQuery = query(
    projectsRef,
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
  )

  const snapshot = await getDocs(projectsQuery)

  return snapshot.docs
    .map((projectDoc) => ({
      id: projectDoc.id,
      ...projectDoc.data(),
    }))
    .filter((project) => project.deleted !== true)
}


export async function createProject(projectData) {
  const data = {
    ...projectData,
    published: projectData.published ?? false,
    deleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  const projectDoc = await addDoc(
    projectsRef,
    data,
  )

  return {
    id: projectDoc.id,
  }
}


export async function updateProject(
  projectId,
  projectData,
) {
  const projectRef = doc(
    db,
    'projects',
    projectId,
  )

  await updateDoc(projectRef, {
    ...projectData,
    updatedAt: serverTimestamp(),
  })
}


export async function setProjectPublished(
  projectId,
  published,
) {
  const projectRef = doc(
    db,
    'projects',
    projectId,
  )

  await updateDoc(projectRef, {
    published,
    updatedAt: serverTimestamp(),
  })
}


export async function deleteProject(projectId) {
  const projectRef = doc(
    db,
    'projects',
    projectId,
  )

  await updateDoc(projectRef, {
    deleted: true,
    published: false,
    updatedAt: serverTimestamp(),
  })
}