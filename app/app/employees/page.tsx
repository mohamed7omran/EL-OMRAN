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

interface Employee {
  id: number;
  name: string;
  dailySalary: number;
  JobType: string;
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
  });
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const savedEmployees = getItem("employees");
    if (savedEmployees) {
      setEmployees(savedEmployees);
    }
  }, []);

  const addEmployee = () => {
    if (newEmployee.name && newEmployee.dailySalary > 0) {
      const employee: Employee = {
        id: employees.length + 1,
        ...newEmployee,
        attendanceDays: 0,
      };
      const updatedEmployees = [...employees, employee];
      setEmployees(updatedEmployees);
      setItem("employees", updatedEmployees);
      setNewEmployee({ name: "", dailySalary: 0, JobType: "نجار" });
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
    const updatedEmployees = employees.filter((emp) => emp.id !== id);
    setEmployees(updatedEmployees);
    setItem("employees", updatedEmployees);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Employees</h2>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Employee</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
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
                Daily Salary
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
                Job Type
              </Label>
              <select
                id="JobType"
                value={newEmployee.JobType}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, JobType: e.target.value })
                }
                className="col-span-3 p-2 border rounded-md"
              >
                {jobTypes.map((job) => (
                  <option key={job} value={job}>
                    {job}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" onClick={addEmployee}>
                Add Employee
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Daily Salary</TableHead>
            <TableHead>job type</TableHead>
            <TableHead>Attendance Days</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
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
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Employee</DialogTitle>
                    </DialogHeader>
                    {editingEmployee && (
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-name" className="text-right">
                            Name
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
                            Daily Salary
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
                            Job Type
                          </Label>
                          <select
                            id="edit-JobType"
                            value={editingEmployee.JobType}
                            onChange={(e) =>
                              setEditingEmployee({
                                ...editingEmployee,
                                JobType: e.target.value,
                              })
                            }
                            className="col-span-3 p-2 border rounded-md"
                          >
                            {jobTypes.map((job) => (
                              <option key={job} value={job}>
                                {job}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="submit" onClick={updateEmployee}>
                          Update Employee
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  onClick={() => deleteEmployee(employee.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
