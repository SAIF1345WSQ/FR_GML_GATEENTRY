import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../services/Employee/employee.service';
import { windowTime } from 'rxjs';

interface Employee {
  id: number;
  employeeCode: string;
  employeeName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  department: number;
  designation: string;
  unitName: string;
  companyName: string;
}
@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {

  searchText = '';
  showForm = false;
  isEdit = false;
  Department: any[] = [];
  User: any[] = [];
  filteredEmployees: any[] = [];
  private allEmployees: any[] = []; 
  employee: Employee = this.getEmptyEmployee();

  private EmployeeService = inject(EmployeeService);
  ngOnInit() {
    //this.loadSuppliers();
    this.GetEmployee();
  }
  GetEmployee() {
    this.EmployeeService.GetEmployee().subscribe({
      next: (data: any) => {
        this.employee.employeeCode = data.employeeCode;
        this.Department = data.departments;
        this.User = data.user;
        this.allEmployees = data.employe;
        this.filteredEmployees = data.employe;
        this.filteredEmployees.forEach(x => {
          x.employeeName = `${x.firstName} ${x.middleName} ${x.lastName}`;
          const finddep = this.Department.find(d => d.code === x.department);
          x.department = finddep ? finddep.name : '';
        });
      },
      error: (error: any) => {
        console.error('Error fetching employees:', error);
      }
    });
  }
  getEmptyEmployee(): Employee {
    return {
      id: 0,
      employeeCode: '',
      employeeName: '',
      firstName: '',
      middleName: '',
      lastName: '',
      department: 0,
      designation: '',
      unitName: '',
      companyName: ''
    };
  }
applyFilter() {
  const text = this.searchText.trim().toLowerCase();

  if (!text) {
    this.filteredEmployees = this.allEmployees;
    return;
  }

  this.filteredEmployees = this.allEmployees.filter(emp =>
    emp.employeeCode?.toString().toLowerCase().includes(text) ||
    emp.employeeName?.toLowerCase().includes(text) ||
    emp.department?.toLowerCase().includes(text) ||
    emp.designation?.toLowerCase().includes(text) ||
    emp.unitName?.toLowerCase().includes(text) ||
    emp.companyName?.toLowerCase().includes(text)
  );
}
  openAddForm() {
    this.employee = this.getEmptyEmployee();
    this.isEdit = false;
    this.showForm = true;
  }

  openEditForm(emp: Employee) {
   var filter = this.Department.find(x=>x.name == emp.department);
   if(filter){
      emp.department = filter.code;
   }
    emp.unitName = "1" ;
    this.employee = { ...emp };
    this.isEdit = true;
    this.showForm = true;
  }

  saveEmployee() {

    if (
      !this.employee.department
    ) {
      alert('Please fill all required fields');
      return;
    }
    if (this.isEdit) {
      this.EmployeeService.UpdateEmployee(this.employee).subscribe(
        (data: any) => {
          alert('Update successfully.');
         window.location.reload();
        },
        (error: any) => {
          console.error('Error saving Gate In:', error);
          const msg =
            error?.error?.message ||
            (typeof error?.error === 'string' ? error.error : null) ||
            error?.message ||
            'Unknown error';

          alert('Error saving Gate In: ' + msg);
        }
      )
      
    } else {
      this.EmployeeService.SaveEmployee(this.employee).subscribe(
        (data: any) => {
          alert('saved successfully.');
         window.location.reload();
        },
        (error: any) => {
          console.error('Error saving Gate In:', error);
          const msg =
            error?.error?.message ||
            (typeof error?.error === 'string' ? error.error : null) ||
            error?.message ||
            'Unknown error';

          alert('Error saving Gate In: ' + msg);
        }
      )
    }

    // this.closeForm();
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.filteredEmployees = this.filteredEmployees.filter(emp => emp.id !== id);
    }
  }

  closeForm() {
    this.showForm = false;
    this.employee = this.getEmptyEmployee();
  }
  cleanName(name: string): string {
  if (!name) return '';
  return name
    .split(/\s+/)
    .filter(p => p && p.toLowerCase() !== 'null' && p.toLowerCase() !== 'undefined')
    .join(' ');
}

// "Manish Kumar" -> "MK"
getInitials(name: string): string {
  const parts = this.cleanName(name).split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
}
