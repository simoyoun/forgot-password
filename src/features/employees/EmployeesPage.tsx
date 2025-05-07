import React, { useState, useEffect } from 'react'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../../auth/firebase'

interface Employee {
  id?: string
  name: string
  email: string
  phone: string
  position: string
  hireDate: string
  salary: number
}

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id'>>({ 
    name: '',
    email: '',
    phone: '',
    position: '',
    hireDate: new Date().toISOString().split('T')[0],
    salary: 0
  })

  useEffect(() => {
    const fetchEmployees = async () => {
      const querySnapshot = await getDocs(collection(db, 'employees'))
      const employeesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[]
      setEmployees(employeesData)
    }
    fetchEmployees()
  }, [])

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const docRef = await addDoc(collection(db, 'employees'), newEmployee)
      setEmployees([...employees, { ...newEmployee, id: docRef.id }])
      setNewEmployee({ 
        name: '', 
        email: '', 
        phone: '', 
        position: '', 
        hireDate: new Date().toISOString().split('T')[0], 
        salary: 0 
      })
    } catch (error) {
      console.error('Error adding employee: ', error)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Employee Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>
          <form onSubmit={handleAddEmployee}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Position</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Salary</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={newEmployee.salary}
                onChange={(e) => setNewEmployee({...newEmployee, salary: Number(e.target.value)})}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              Add Employee
            </button>
          </form>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Employee Directory</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Position</th>
                  <th className="text-left p-2">Hire Date</th>
                  <th className="text-left p-2">Salary</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-b">
                    <td className="p-2">{employee.name}</td>
                    <td className="p-2">{employee.position}</td>
                    <td className="p-2">{employee.hireDate}</td>
                    <td className="p-2">${employee.salary.toFixed(2)}</td>
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
