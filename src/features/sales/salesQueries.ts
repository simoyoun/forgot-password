import { db, salesCollection } from '../../auth/firebase'
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore'
import { Sale } from './salesTypes'

export async function getSalesByUser(userId: string): Promise<Sale[]> {
  const q = query(collection(db, salesCollection), where('userId', '==', userId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale))
}

export async function createSale(sale: Omit<Sale, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, salesCollection), sale)
  return docRef.id
}

export async function updateSale(saleId: string, updates: Partial<Sale>): Promise<void> {
  await updateDoc(doc(db, salesCollection, saleId), updates)
}
