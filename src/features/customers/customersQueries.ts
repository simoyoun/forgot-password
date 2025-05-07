import { db, customersCollection } from '../../auth/firebase'
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore'
import { Customer } from './customersTypes'

export async function getAllCustomers(): Promise<Customer[]> {
  const snapshot = await getDocs(collection(db, customersCollection))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer))
}

export async function searchCustomersByName(name: string): Promise<Customer[]> {
  const q = query(collection(db, customersCollection), where('name', '>=', name), where('name', '<=', name + '\uf8ff'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer))
}

export async function createCustomer(customer: Omit<Customer, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, customersCollection), customer)
  return docRef.id
}

export async function updateCustomer(customerId: string, updates: Partial<Customer>): Promise<void> {
  await updateDoc(doc(db, customersCollection, customerId), updates)
}
