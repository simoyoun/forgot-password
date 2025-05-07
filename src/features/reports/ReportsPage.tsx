import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../auth/firebase'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ReportData {
  name: string
  value: number
}

export function ReportsPage() {
  const [salesData, setSalesData] = useState<ReportData[]>([])
  const [inventoryData, setInventoryData] = useState<ReportData[]>([])
  const [timeRange, setTimeRange] = useState('week')

  useEffect(() => {
    const fetchReportData = async () => {
      // Mock data - in real app you would query Firestore
      setSalesData([
        { name: 'Mon', value: 4000 },
        { name: 'Tue', value: 3000 },
        { name: 'Wed', value: 2000 },
        { name: 'Thu', value: 2780 },
        { name: 'Fri', value: 1890 },
        { name: 'Sat', value: 2390 },
        { name: 'Sun', value: 3490 }
      ])

      setInventoryData([
        { name: 'Electronics', value: 400 },
        { name: 'Clothing', value: 300 },
        { name: 'Food', value: 200 },
        { name: 'Furniture', value: 278 }
      ])
    }
    fetchReportData()
  }, [timeRange])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Business Reports</h1>
      
      <div className="mb-6">
        <select 
          className="p-2 border rounded"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Sales Performance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Sales ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Inventory Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" name="Items" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
