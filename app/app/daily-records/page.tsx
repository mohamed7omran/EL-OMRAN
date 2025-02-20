"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { setItem, getItem } from "@/utils/storage"

interface Employee {
  id: number
  name: string
}

interface DailyRecord {
  id: number
  employeeId: number
  employeeName: string
  amount: number
  date: string
}

export default function DailyRecordsPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([])

  useEffect(() => {
    const savedEmployees = getItem("employees")
    if (savedEmployees) {
      setEmployees(savedEmployees)
    }
    const savedDailyRecords = getItem("dailyRecords")
    if (savedDailyRecords) {
      setDailyRecords(savedDailyRecords)
    }
  }, [])

  const recordEntry = () => {
    if (selectedEmployee && amount) {
      const employee = employees.find((e) => e.id.toString() === selectedEmployee)
      if (employee) {
        const newRecord = {
          id: dailyRecords.length + 1,
          employeeId: employee.id,
          employeeName: employee.name,
          amount: Number.parseFloat(amount),
          date: new Date().toISOString().split("T")[0],
        }
        const updatedRecords = [...dailyRecords, newRecord]
        setDailyRecords(updatedRecords)
        setItem("dailyRecords", updatedRecords)

        // Update employee's attendance days
        const updatedEmployees = employees.map((emp) =>
          emp.id === employee.id ? { ...emp, attendanceDays: emp.attendanceDays + 1 } : emp,
        )
        setEmployees(updatedEmployees)
        setItem("employees", updatedEmployees)

        setAmount("")
        setSelectedEmployee("")
      }
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Daily Records</h2>
      <div className="flex space-x-4">
        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Employee" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id.toString()}>
                {employee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Amount Received"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-[200px]"
        />
        <Button onClick={recordEntry}>Record Entry</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dailyRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.date}</TableCell>
              <TableCell>{record.employeeName}</TableCell>
              <TableCell>${record.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

