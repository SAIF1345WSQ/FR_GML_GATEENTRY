import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Employee {
  id: number;
  employeeCode: string;
  employeeName: string;
  department: string;
  designation: string;
  unitName: string;
  companyName: string;
}
@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {

  searchText = '';
  showForm = false;
  isEdit = false;

  employees: Employee[] = [
    {
      id: 1,
      employeeCode: 'EMP001',
      employeeName: 'Rahul Sharma',
      department: 'Production',
      designation: 'Supervisor',
      unitName: 'Unit 1',
      companyName: 'ABC Industries'
    },
    {
      id: 2,
      employeeCode: 'EMP002',
      employeeName: 'Amit Kumar',
      department: 'Security',
      designation: 'Security Guard',
      unitName: 'Unit 2',
      companyName: 'XYZ Contractors'
    },
    {
      id: 3,
      employeeCode: 'EMP003',
      employeeName: 'Priya Singh',
      department: 'HR',
      designation: 'HR Executive',
      unitName: 'Unit 1',
      companyName: 'ABC Industries'
    }
  ];

  employee: Employee = this.getEmptyEmployee();

  getEmptyEmployee(): Employee {
    return {
      id: 0,
      employeeCode: '',
      employeeName: '',
      department: '',
      designation: '',
      unitName: '',
      companyName: ''
    };
  }

  get filteredEmployees(): Employee[] {
    const search = this.searchText.toLowerCase();

    return this.employees.filter(emp =>
      emp.employeeCode.toLowerCase().includes(search) ||
      emp.employeeName.toLowerCase().includes(search) ||
      emp.department.toLowerCase().includes(search) ||
      emp.designation.toLowerCase().includes(search) ||
      emp.unitName.toLowerCase().includes(search) ||
      emp.companyName.toLowerCase().includes(search)
    );
  }

  openAddForm() {
    this.employee = this.getEmptyEmployee();
    this.isEdit = false;
    this.showForm = true;
  }

  openEditForm(emp: Employee) {
    this.employee = { ...emp };
    this.isEdit = true;
    this.showForm = true;
  }

  saveEmployee() {

    if (
      !this.employee.employeeCode ||
      !this.employee.employeeName ||
      !this.employee.department
    ) {
      alert('Please fill all required fields');
      return;
    }

    if (this.isEdit) {
      const index = this.employees.findIndex(
        x => x.id === this.employee.id
      );

      if (index !== -1) {
        this.employees[index] = { ...this.employee };
      }
    } else {
      this.employee.id = Math.max(
        0,
        ...this.employees.map(x => x.id)
      ) + 1;

      this.employees.push({ ...this.employee });
    }

    this.closeForm();
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employees = this.employees.filter(emp => emp.id !== id);
    }
  }

  closeForm() {
    this.showForm = false;
    this.employee = this.getEmptyEmployee();
  }
}
