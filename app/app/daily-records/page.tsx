"use client";
// TODO search selected option
// TODO عند مسح المصاريف لا تمسح من التقارير
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { setItem, getItem } from "@/utils/storage";
import { Label } from "recharts";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Employee {
  id: number;
  name: string;
  JobType: string;
  attendanceDays?: number;
  extraDays: number;
}

interface DailyRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeJobType: string;
  amount: number;
  extraDays: number;
  date: string;
}

const jobTypes = [
  "نجار",
  "مساعد نجار",
  "حداد",
  "مساعد حداد",
  "كوماندا نجارين",
  "كوماندا حدادين",
];

export default function DailyRecordsPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [extraDays, setExtraDays] = useState<string>("");
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);

  useEffect(() => {
    const savedEmployees = getItem("employees");
    if (savedEmployees) {
      setEmployees(savedEmployees);
      console.log("Employees:", employees);
    }
    const savedDailyRecords = getItem("dailyRecords");
    if (savedDailyRecords) {
      setDailyRecords(savedDailyRecords);
    }
  }, []);
  useEffect(() => {
    if (employees.length > 0) {
      console.log("Updated Employees:", employees);
    }
  }, [employees]);

  const recordEntry = () => {
    if (selectedEmployee && amount) {
      const employee = employees.find(
        (e) => e.id.toString() === selectedEmployee
      );
      if (employee) {
        const newRecord = {
          id: dailyRecords.length + 1,
          employeeId: employee.id,
          employeeName: employee.name,
          employeeJobType: employee.JobType,
          amount: Number.parseFloat(amount || "0"),
          extraDays: Number.parseFloat(extraDays || "0"),
          date: new Date().toISOString().split("T")[0],
        };
        const updatedRecords = [...dailyRecords, newRecord];
        setDailyRecords(updatedRecords);
        setItem("dailyRecords", updatedRecords);

        const extraDaysNum = extraDays ? Number(extraDays) : 0;
        // Update employee's attendance days

        const updatedEmployees = employees.map((emp) =>
          emp.id === employee.id
            ? {
                ...emp,
                attendanceDays: emp.attendanceDays + 1,
                extraDays: (emp.extraDays || 0) + extraDaysNum,
              }
            : emp
        );

        setEmployees(updatedEmployees);
        setItem("employees", updatedEmployees);

        setAmount("");
        setExtraDays("");
        setSelectedEmployee("");
      }
    }
    if (!selectedEmployee || !amount) {
      alert("اختار الاسم والمصاريف يا معلم");
    }
  };

  const [editingRecord, setEditingRecord] = useState<DailyRecord | null>(null);

  const updateRecord = () => {
    if (editingRecord) {
      const updatedRecords = dailyRecords.map((record) =>
        record.id === editingRecord.id ? editingRecord : record
      );
      setDailyRecords(updatedRecords);
      setItem("dailyRecords", updatedRecords);

      const updatedEmployees = employees.map((emp) =>
        emp.id === editingRecord.employeeId
          ? {
              ...emp,
              extraDays:
                emp.extraDays -
                (dailyRecords.find((r) => r.id === editingRecord.id)
                  ?.extraDays || 0) +
                editingRecord.extraDays,
            }
          : emp
      );
      setEmployees(updatedEmployees);
      setItem("employees", updatedEmployees);
      setEditingRecord(null);
    }
  };

  const deleteRecord = (id: number) => {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف هذه المصاريف؟");
    if (!confirmDelete) return;
    const updatedEmployees = dailyRecords.filter((record) => record.id !== id);
    setDailyRecords(updatedEmployees);
    setItem("dailyRecords", updatedEmployees);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">حط المصاريف</h2>
      <div className="flex space-x-4">
        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="اختار الصنايعي" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id.toString()}>
                {employee.name} ({employee.JobType || "غير محدد"})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="المصاريف"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-[200px]"
        />
        <Input
          type="number"
          placeholder="الاضافي"
          value={extraDays}
          onChange={(e) => setExtraDays(e.target.value)}
          className="w-[200px]"
        />
        <Button onClick={recordEntry}>تأكيد</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>التاريخ</TableHead>
            <TableHead>الاسم</TableHead>
            <TableHead>النوع</TableHead>
            <TableHead>المصاريف</TableHead>
            <TableHead>الاضافي</TableHead>
            <TableHead>احذف او عدل</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dailyRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.date}</TableCell>
              <TableCell>{record.employeeName}</TableCell>
              <TableCell>{record.employeeJobType}</TableCell>
              <TableCell>${record.amount}</TableCell>
              <TableCell>{record.extraDays}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => setEditingRecord(record)}
                    >
                      تعديل
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>عدل الاضافي و المصاريف</DialogTitle>
                    </DialogHeader>
                    {editingRecord && (
                      <div className="grid gap-4 py-4" dir="rtl">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-name" className="text-right">
                            الاسم
                          </Label>
                          <Input
                            id="edit-name"
                            value={editingRecord.employeeName}
                            disabled
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="edit-dailySalary"
                            className="text-right"
                          >
                            المصاريف
                          </Label>
                          <Input
                            id="edit-dailySalary"
                            type="number"
                            value={editingRecord.amount}
                            onChange={(e) =>
                              setEditingRecord({
                                ...editingRecord,
                                amount: Number(e.target.value),
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-JobType" className="text-right">
                            الاضافي
                          </Label>
                          <Input
                            type="number"
                            value={editingRecord?.extraDays}
                            onChange={(e) =>
                              setEditingRecord({
                                ...editingRecord,
                                extraDays: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="submit" onClick={updateRecord}>
                          عدل الصنايعي
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  onClick={() => deleteRecord(record.id)}
                >
                  حذف
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
