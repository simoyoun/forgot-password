import React, { useState, useEffect } from 'react'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../../auth/firebase'

interface Customer {
  id?: string
  name: string
  email: string
  phone: string
  address: string
  loyaltyPoints: number
}

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({ 
    name: '',
    email: '',
    phone: '',
    address: '',
    loyaltyPoints: 0
  })

  useEffect(() => {
    const fetchCustomers = async () => {
      const querySnapshot = await getDocs(collection(db, 'customers'))
      const customersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Customer[]
      setCustomers(customersData)
    }
    fetchCustomers()
  }, [])

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const docRef = await addDoc(collection(db, 'customers'), newCustomer)
      setCustomers([...customers, { ...newCustomer, id: docRef.id }])
      setNewCustomer({ name: '', email: '', phone: '', address: '', loyaltyPoints: 0 })
    } catch (error) {
      console.error('Error adding customer: ', error)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
          <form onSubmit={handleAddCustomer}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                className="w-full p-2 border rounded"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea
                className="w-full p-2 border rounded"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Add Customer
            </button>
          </form>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Customer List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Phone</th>
                  <th className="text-left p-2">Loyalty</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b">
                    <td className="p-2">{customer.name}</td>
                    <td className="p-2">{customer.email}</td>
                    <td className="p-2">{customer.phone}</td>
                    <td className="p-2">{customer.loyaltyPoints} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
