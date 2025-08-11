import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';

export async function getUserApplications(userId) {
  const applicationsCol = collection(db, 'userApplications');
  const q = query(applicationsCol, where('userId', '==', userId));
  const applicationSnapshot = await getDocs(q);
  return applicationSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function applyForGrant(userId, grantId, notes = '') {
  const applicationsCol = collection(db, 'userApplications');
  return await addDoc(applicationsCol, {
    userId,
    grantId,
    status: 'pending',
    notes,
    appliedAt: Timestamp.now()
  });
}