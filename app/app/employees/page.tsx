// TODO: make select right
// TODO:عند مسح الموظف من صفحة الموظفين يبقي موجود في  المصاريف بس بيتمسح من التقارير

"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { setItem, getItem } from "@/utils/storage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Employee {
  id: number;
  name: string;
  JobType: string;
  dailySalary: number;
  extraDays: number;
  attendanceDays: number;
}

const jobTypes = [
  "نجار",
  "مساعد نجار",
  "حداد",
  "مساعد حداد",
  "كوماندا نجارين",
  "كوماندا حدادين",
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState<
    Omit<Employee, "id" | "attendanceDays">
  >({
    name: "",
    JobType: "نجار",
    dailySalary: 0,
    extraDays: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.includes(searchQuery) ||
      employee.JobType.includes(searchQuery)
  );
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const savedEmployees = getItem("employees");
    if (savedEmployees) {
      setEmployees(savedEmployees);
    }
  }, []);

  const addEmployee = () => {
    const trimmedName = newEmployee.name.trim();
    const isDuplicateEmployee = employees.some(
      (emp) => emp.name === trimmedName && emp.JobType === newEmployee.JobType
    );

    if (isDuplicateEmployee) {
      alert(`هذا الصنايعي مسجل بالفعل!`);
      return;
    }

    if (newEmployee.name && newEmployee.dailySalary > 0) {
      const employee: Employee = {
        id: employees.length + 1,
        ...newEmployee,
        attendanceDays: 0,
      };
      const updatedEmployees = [...employees, employee];
      setEmployees(updatedEmployees);
      setItem("employees", updatedEmployees);
      setNewEmployee({
        name: "",
        dailySalary: 0,
        extraDays: 0,
        JobType: "نجار",
      });
    }
  };

  const updateEmployee = () => {
    if (editingEmployee) {
      const updatedEmployees = employees.map((emp) =>
        emp.id === editingEmployee.id ? editingEmployee : emp
      );
      setEmployees(updatedEmployees);
      setItem("employees", updatedEmployees);
      setEditingEmployee(null);
    }
  };

  const deleteEmployee = (id: number) => {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف هذا الموظف؟");
    if (!confirmDelete) return;
    const updatedEmployees = employees.filter((emp) => emp.id !== id);
    setEmployees(updatedEmployees);
    setItem("employees", updatedEmployees);
  };

  return (
    <div className="space-y-6">
      <h2 className=" w-full text-center text-3xl font-semibold">الصنايعية</h2>
      <Dialog>
        <div className="w-full p-2 flex justify-between items-center text-center">
          <Input
            type="text"
            placeholder="ابحث عن الموظف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[500px] p-2 border rounded-md"
          />
          <DialogTrigger asChild>
            <Button>اضافة صنايعي +</Button>
          </DialogTrigger>
        </div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حط الصنايعي بتاعك</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4" dir="rtl">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                الاسم
              </Label>
              <Input
                id="name"
                value={newEmployee.name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dailySalary" className="text-right">
                اليومية
              </Label>
              <Input
                id="dailySalary"
                type="number"
                value={newEmployee.dailySalary}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    dailySalary: Number(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="JobType" className="text-right">
                النوع
              </Label>
              <Select
                value={newEmployee?.JobType}
                onValueChange={(value) =>
                  setNewEmployee({ ...newEmployee, JobType: value })
                }
              >
                <SelectTrigger className="col-span-3 p-2 border rounded-md text-right">
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((job) => (
                    <SelectItem key={job} value={job} className="text-right">
                      {job}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" onClick={addEmployee}>
                اضافة صنايعي
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>اليومية</TableHead>
            <TableHead>النوع</TableHead>
            <TableHead>الايام</TableHead>
            <TableHead>احذف او عدل</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEmployees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.name}</TableCell>
              <TableCell>${employee.dailySalary.toFixed(2)}</TableCell>
              <TableCell>{employee.JobType}</TableCell>
              <TableCell>{employee.attendanceDays}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => setEditingEmployee(employee)}
                    >
                      تعديل
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>عدل الصنايعي</DialogTitle>
                    </DialogHeader>
                    {editingEmployee && (
                      <div className="grid gap-4 py-4" dir="rtl">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-name" className="text-right">
                            الاسم
                          </Label>
                          <Input
                            id="edit-name"
                            value={editingEmployee.name}
                            onChange={(e) =>
                              setEditingEmployee({
                                ...editingEmployee,
                                name: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="edit-dailySalary"
                            className="text-right"
                          >
                            اليوميه
                          </Label>
                          <Input
                            id="edit-dailySalary"
                            type="number"
                            value={editingEmployee.dailySalary}
                            onChange={(e) =>
                              setEditingEmployee({
                                ...editingEmployee,
                                dailySalary: Number(e.target.value),
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-JobType" className="text-right">
                            النوع
                          </Label>
                          <Select
                            value={editingEmployee?.JobType}
                            onValueChange={(value) =>
                              setEditingEmployee({
                                ...editingEmployee,
                                JobType: value,
                              })
                            }
                          >
                            <SelectTrigger className="col-span-3 p-2 border rounded-md">
                              <SelectValue placeholder="اختر النوع" />
                            </SelectTrigger>
                            <SelectContent>
                              {jobTypes.map((job) => (
                                <SelectItem key={job} value={job}>
                                  {job}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="submit" onClick={updateEmployee}>
                          عدل الصنايعي
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  onClick={() => deleteEmployee(employee.id)}
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
