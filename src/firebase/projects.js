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

/* =========================================================
   ADMIN — GET ALL NON-DELETED PROJECTS
========================================================= */

export async function getProjects() {
  const projectsQuery = query(
    projectsRef,
    where('deleted', '==', false),
    orderBy('createdAt', 'desc'),
  )

  const snapshot = await getDocs(projectsQuery)

  return snapshot.docs.map((projectDoc) => ({
    id: projectDoc.id,
    ...projectDoc.data(),
  }))
}

/* =========================================================
   PUBLIC — GET PUBLISHED PROJECTS
========================================================= */

export async function getPublishedProjects() {
  const projectsQuery = query(
    projectsRef,
    where('published', '==', true),
    where('deleted', '==', false),
    orderBy('createdAt', 'desc'),
  )

  const snapshot = await getDocs(projectsQuery)

  return snapshot.docs.map((projectDoc) => ({
    id: projectDoc.id,
    ...projectDoc.data(),
  }))
}

/* =========================================================
   CREATE
========================================================= */

export async function createProject(projectData) {
  const data = {
    ...projectData,

    published:
      projectData.published ?? false,

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

/* =========================================================
   UPDATE
========================================================= */

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

/* =========================================================
   PUBLISH / HIDE
========================================================= */

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

/* =========================================================
   DELETE
========================================================= */

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