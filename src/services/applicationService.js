import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';

export async function getUserApplications(userId) {
  const applicationsCol = collection(db, 'userApplications');
  const q = query(applicationsCol, where('userId', '==', userId));
  const applicationSnapshot = await getDocs(q);
  return applicationSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getUserApplicationsForGrant(userId, grantId) {
  const applicationsCol = collection(db, 'userApplications');
  const qu = query(applicationsCol, where('userId', '==', userId));
  const q = query(qu, where('grantId', '==', grantId))
  const applicationSnapshot = await getDocs(q);
  return applicationSnapshot.docs.map(doc => { 
    const data = doc.data();
      return { 
        id: doc.id,
        appliedAt: data.appliedAt || null,
        grantId: data.grantId || '',
        notes: data.notes || '',
        status: data.status || '',
        userId: data.userId || ''
      };
   });
}

export async function applyForGrant(userId, grantId, status = 'pending',notes = '') {
  const applicationsCol = collection(db, 'userApplications');
  return await addDoc(applicationsCol, {
    userId,
    grantId,
    status,
    notes,
    appliedAt: Timestamp.now()
  });
}