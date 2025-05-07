import React, { useState, useEffect } from 'react'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../../auth/firebase'

interface InventoryItem {
  id?: string
  name: string
  quantity: number
  price: number
  category: string
}

export function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({ 
    name: '',
    quantity: 0,
    price: 0,
    category: ''
  })

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, 'inventory'))
      const itemsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as InventoryItem[]
      setItems(itemsData)
    }
    fetchItems()
  }, [])

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const docRef = await addDoc(collection(db, 'inventory'), newItem)
      setItems([...items, { ...newItem, id: docRef.id }])
      setNewItem({ name: '', quantity: 0, price: 0, category: '' })
    } catch (error) {
      console.error('Error adding item: ', error)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
          <form onSubmit={handleAddItem}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                className="w-full p-2 border rounded"
                value={newItem.price}
                onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Item
            </button>
          </form>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Current Inventory</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Qty</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Category</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.quantity}</td>
                    <td className="p-2">${item.price.toFixed(2)}</td>
                    <td className="p-2">{item.category}</td>
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
