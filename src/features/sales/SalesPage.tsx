import React, { useState, useEffect } from 'react'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../auth/firebase'
import { useAuth } from '../../auth/AuthProvider'
import { Sale } from './salesTypes'

interface Item {
  id: string
  name: string
  price: number
  stock: number
}

interface Customer {
  id: string
  name: string
  email: string
}

export function SalesPage() {
  const { user } = useAuth()
  const [sales, setSales] = useState<Sale[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedItems, setSelectedItems] = useState<{id: string, quantity: number}[]>([])
  const [newSale, setNewSale] = useState<Omit<Sale, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    items: [],
    total: 0,
    customerId: '',
    userId: user?.id || '',
    status: 'pending',
    notes: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      // Fetch sales
      const salesQuery = query(collection(db, 'sales'), where('userId', '==', user?.id))
      const salesSnapshot = await getDocs(salesQuery)
      setSales(salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale)))

      // Fetch inventory items
      const itemsQuery = query(collection(db, 'inventory'), where('stock', '>', 0))
      const itemsSnapshot = await getDocs(itemsQuery)
      setItems(itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item)))

      // Fetch customers
      const customersSnapshot = await getDocs(collection(db, 'customers'))
      setCustomers(customersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer)))
    }

    if (user?.id) fetchData()
  }, [user])

  const handleAddItem = (itemId: string) => {
    const existingItem = selectedItems.find(item => item.id === itemId)
    const item = items.find(i => i.id === itemId)
    
    if (!item) return

    if (existingItem) {
      setSelectedItems(selectedItems.map(i => 
        i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
      ))
    } else {
      setSelectedItems([...selectedItems, { id: itemId, quantity: 1 }])
    }

    // Update total
    const total = selectedItems.reduce((sum, selected) => {
      const item = items.find(i => i.id === selected.id)
      return sum + (item?.price || 0) * selected.quantity
    }, item.price)

    setNewSale({
      ...newSale,
      items: selectedItems.map(selected => ({
        itemId: selected.id,
        quantity: selected.quantity,
        price: items.find(i => i.id === selected.id)?.price || 0
      })),
      total
    })
  }

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId))
    setNewSale({
      ...newSale,
      items: newSale.items.filter(item => item.itemId !== itemId),
      total: newSale.items
        .filter(item => item.itemId !== itemId)
        .reduce((sum, item) => sum + (item.price * item.quantity), 0)
    })
  }

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity < 1) return handleRemoveItem(itemId)
    
    setSelectedItems(selectedItems.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ))

    setNewSale({
      ...newSale,
      items: newSale.items.map(item => 
        item.itemId === itemId ? { ...item, quantity } : item
      ),
      total: newSale.items.reduce((sum, item) => {
        return sum + (item.price * (item.itemId === itemId ? quantity : item.quantity))
      }, 0)
    })
  }

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const docRef = await addDoc(collection(db, 'sales'), {
        ...newSale,
        userId: user?.id,
        status: 'completed',
        date: new Date().toISOString()
      })
      setSales([...sales, { ...newSale, id: docRef.id }])
      setNewSale({
        date: new Date().toISOString().split('T')[0],
        items: [],
        total: 0,
        customerId: '',
        userId: user?.id || '',
        status: 'pending',
        notes: ''
      })
      setSelectedItems([])
    } catch (error) {
      console.error('Error adding sale: ', error)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sales Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Record New Sale</h2>
          <form onSubmit={handleAddSale}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={newSale.date}
                  onChange={(e) => setNewSale({...newSale, date: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Customer</label>
                <select
                  className="w-full p-2 border rounded"
                  value={newSale.customerId}
                  onChange={(e) => setNewSale({...newSale, customerId: e.target.value})}
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Items</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                    <span>{item.name} (${item.price})</span>
                    <button
                      type="button"
                      onClick={() => handleAddItem(item.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {selectedItems.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">Selected Items</h3>
                <div className="space-y-2">
                  {selectedItems.map(selected => {
                    const item = items.find(i => i.id === selected.id)
                    return (
                      <div key={selected.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>{item?.name}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={selected.quantity}
                            onChange={(e) => handleQuantityChange(selected.id, parseInt(e.target.value))}
                            className="w-16 p-1 border rounded"
                          />
                          <span>${(item?.price || 0) * selected.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(selected.id)}
                            className="text-red-500"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                className="w-full p-2 border rounded"
                value={newSale.notes}
                onChange={(e) => setNewSale({...newSale, notes: e.target.value})}
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">
                Total: ${newSale.total.toFixed(2)}
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                disabled={newSale.items.length === 0 || !newSale.customerId}
              >
                Complete Sale
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Sales</h2>
          <div className="space-y-4">
            {sales.slice(0, 5).map(sale => {
              const customer = customers.find(c => c.id === sale.customerId)
              return (
                <div key={sale.id} className="border-b pb-4">
                  <div className="flex justify-between">
                    <span className="font-medium">{customer?.name || 'Unknown Customer'}</span>
                    <span className="text-green-600">${sale.total.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-500">{new Date(sale.date).toLocaleDateString()}</div>
                  <div className="text-sm mt-1">
                    {sale.items.length} items • {sale.status}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
