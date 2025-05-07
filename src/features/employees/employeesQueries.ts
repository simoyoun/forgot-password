import { db, employeesCollection } from '../../auth/firebase'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { Employee } from './employeesTypes'

export async function getAllEmployees(): Promise<Employee[]> {
  const snapshot = await getDocs(collection(db, employeesCollection))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee))
}

export async function getEmployeeById(employeeId: string): Promise<Employee | null> {
  const docSnap = await getDoc(doc(db, employeesCollection, employeeId))
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Employee : null
}

export async function updateEmployee(employeeId: string, updates: Partial<Employee>): Promise<void> {
  await updateDoc(doc(db, employeesCollection, employeeId), updates)
}
