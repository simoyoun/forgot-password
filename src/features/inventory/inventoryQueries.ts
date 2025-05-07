import { db, inventoryCollection } from '../../auth/firebase'
import { collection, query, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore'
import { InventoryItem } from './inventoryTypes'

export async function getAllInventoryItems(): Promise<InventoryItem[]> {
  const snapshot = await getDocs(collection(db, inventoryCollection))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem))
}

export async function createInventoryItem(item: Omit<InventoryItem, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, inventoryCollection), item)
  return docRef.id
}

export async function updateInventoryItem(itemId: string, updates: Partial<InventoryItem>): Promise<void> {
  await updateDoc(doc(db, inventoryCollection, itemId), updates)
}
