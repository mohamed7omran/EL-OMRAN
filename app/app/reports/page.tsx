"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getItem } from "@/utils/storage";

interface Employee {
  id: number;
  name: string;
  dailySalary: number;
  JobType: string;
  attendanceDays: number;
  extraDays: number;
}

interface DailyRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  amount: number;
  date: string;
}

interface SalaryDetail {
  employeeId: number;
  employeeName: string;
  dailyWage: number;
  JobType: string;
  attendanceDays: number;
  extraDays: number;
  totalDays: number;
  totalWage: number;
  paidAmount: number;
  pendingSalary: number;
}

export default function ReportsPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [salaryDetails, setSalaryDetails] = useState<SalaryDetail[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalPendingSalaries, setTotalPendingSalaries] = useState(0);

  useEffect(() => {
    const savedEmployees = getItem("employees");
    const savedDailyRecords = getItem("dailyRecords");
    if (savedEmployees) setEmployees(savedEmployees);
    if (savedDailyRecords) setDailyRecords(savedDailyRecords);
  }, []);

  useEffect(() => {
    const details = employees.map((employee) => {
      const employeeRecords = dailyRecords.filter(
        (record) => record.employeeId === employee.id
      );
      const totalDays = employee.attendanceDays + employee.extraDays || 0;
      const totalWage = employee.dailySalary * totalDays;
      const paidAmount = employeeRecords.reduce(
        (sum, record) => sum + record.amount,
        0
      );
      const pendingSalary = totalWage - paidAmount;
      return {
        employeeId: employee.id,
        employeeName: employee.name,
        dailyWage: employee.dailySalary,
        JobType: employee.JobType,
        attendanceDays: employee.attendanceDays,
        extraDays: employee.extraDays,
        totalDays,
        totalWage,
        paidAmount,
        pendingSalary,
      };
    });
    setSalaryDetails(details);

    const expenses = details.reduce(
      (sum, detail) => sum + detail.paidAmount,
      0
    );
    setTotalExpenses(expenses);

    const pending = details.reduce(
      (sum, detail) => sum + detail.pendingSalary,
      0
    );
    setTotalPendingSalaries(pending);
  }, [employees, dailyRecords]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📊 التقارير</h2>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>اجمالي المصاريف</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalExpenses.toFixed(2)} EGP</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>اجمالي القبض</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {totalPendingSalaries.toFixed(2)} EGP
            </p>
          </CardContent>
        </Card>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>👤 الاسم</TableHead>
            <TableHead>💵 اليومية</TableHead>
            <TableHead>👨‍💼 النوع</TableHead>
            <TableHead>📅 الأيام</TableHead>
            <TableHead>➕ الإضافي</TableHead>
            <TableHead>الايام + الاضافي</TableHead>
            <TableHead>اجمالي القبض +المصاريف</TableHead>
            <TableHead>💸 المصاريف</TableHead>
            <TableHead>💰 اجمالي المستحق</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salaryDetails.map((detail) => (
            <TableRow key={detail.employeeId}>
              <TableCell>{detail.employeeName}</TableCell>
              <TableCell>{detail.dailyWage.toFixed(2)} EGP</TableCell>
              <TableCell>{detail.JobType}</TableCell>
              <TableCell>{detail.attendanceDays}</TableCell>
              <TableCell>{detail.extraDays}</TableCell>
              <TableCell>{detail.totalDays}</TableCell>
              <TableCell>{detail.totalWage.toFixed(2)} EGP</TableCell>
              <TableCell>{detail.paidAmount.toFixed(2)} EGP</TableCell>
              <TableCell>{detail.pendingSalary.toFixed(2)} EGP</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
