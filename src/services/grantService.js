import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  getDoc,
  Timestamp,
  GeoPoint
} from 'firebase/firestore';

export async function getAllGrants() {
  try {
    const grantsCol = collection(db, 'grants');
    const grantSnapshot = await getDocs(grantsCol);
    
    return grantSnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id,
        name: data.name || 'Unnamed Grant',
        description: data.description || '',
        startDate: data.startDate?.toDate?.() || null,
        endDate: data.endDate?.toDate?.() || null,
        eligibility: data.eligibility || '',
        amount: data.amount || '',
        website: data.website || '',
        contactEmail: data.contactEmail || '',
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
        createdBy: data.createdBy || ''
      };
    });
  } catch (error) {
    console.error("Error fetching grants:", error);
    throw error;
  }
}

export async function addGrant(grantData) {
  const grantsCol = collection(db, 'grants');
  const processedData = {
    ...grantData,
    startDate: Timestamp.fromDate(new Date(grantData.startDate)),
    endDate: Timestamp.fromDate(new Date(grantData.endDate)),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  const docRef = await addDoc(grantsCol, processedData);
  console.log("Grant added with ID: ", docRef.id); // Debug log
  return docRef;
}

export async function getGrantById(grantId) {
  const grantDoc = doc(db, 'grants', grantId);
  const grantSnapshot = await getDoc(grantDoc);
  
  if (!grantSnapshot.exists()) return null;
  
  const data = grantSnapshot.data();
  return {
    id: grantSnapshot.id,
    ...data,
    // Safely convert Timestamp to Date objects
    startDate: data.startDate?.toDate?.() || null,
    endDate: data.endDate?.toDate?.() || null
  };
}

