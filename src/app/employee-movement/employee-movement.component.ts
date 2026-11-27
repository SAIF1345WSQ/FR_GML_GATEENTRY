
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmployeeService } from '../services/Employee/employee.service';

interface EmployeeMovement {
  srNo: number;
  empType: string;
  empIdNo: string;
  contractName: string;
  name: string;
  empName?: string;
  department: string;
  approvedByHod: string;
  approvedByHr: string;
  fromPlant: string;
  destination: string;
  outTime: string;
  inTime: string;
  securitySupervisorName: string;
  purpose: string;
}

@Component({
  selector: 'app-employee-movement',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatAutocompleteModule, MatFormFieldModule, MatInputModule
  ],
  templateUrl: './employee-movement.component.html',
  styleUrls: ['./employee-movement.component.css']
})
export class EmployeeMovementComponent {
  private readonly storageKey = 'employeeMovementRecords';

  empSearch = '';
  showEmpDropdown = false;
  filteredEmployees: any[] = [];
  private EmployeeSer = inject(EmployeeService);
  movement: EmployeeMovement = this.getEmptyMovement();
  movementList: EmployeeMovement[] = [];
  Department: any = [];
  employees: any[] = [];
  empMovList: any[] = [];
  searchText = '';
  empTypeOptions = ['STAFF', 'CONTRACT'];
  purposeOptions = ['OFFICIAL', 'PERSONAL'];

  constructor() {
    this.loadMovements();
  }
  ngOnInit(): void {
    this.GetEmployee();
  }
  GetEmployee() {
    this.EmployeeSer.GetEmployeeMov(this.movement.empType).subscribe(
      (data: any) => {
        this.filteredEmployees = data.empList;
        this.employees = data.empList;
        this.Department = data.departments;
        this.empMovList = data.empMovList;
      },
      (error: any) => {
        console.error('Error fetching suppliers:', error);
      }
    );
  }
  // SEARCH
  filterEmp(value: string): void {
    this.empSearch = value;
    const search = value.toLowerCase().trim();
    this.filteredEmployees = this.employees.filter(e =>
      e.employeeCode.toLowerCase().includes(search) ||
      e.employeeName.toLowerCase().includes(search)
    );
    this.showEmpDropdown = true;
  }
  // OPEN DROPDOWN
  openEmpDropdown(): void {
    this.filteredEmployees = [...this.employees];
    this.showEmpDropdown = true;
  }
  // SELECT EMPLOYEE
  selectEmployee(e: any): void {
    this.movement.empIdNo = e.employeeCode;
    this.movement.name = e.employeeName;
    this.movement.department = e.dept;
    this.empSearch = e.employeeCode;
    this.showEmpDropdown = false;
  }

  getEmptyMovement(): EmployeeMovement {
    return {
      srNo: 0,
      empType: 'STAFF',
      empIdNo: '',
      contractName: '',
      name: '',
      department: '',
      approvedByHod: '',
      approvedByHr: '',
      fromPlant: '',
      destination: '',
      outTime: '',
      inTime: '',
      securitySupervisorName: '',
      purpose: 'OFFICIAL'
    };
  }

  loadMovements(): void {
    try {
      this.movementList = JSON.parse(
        localStorage.getItem(this.storageKey) || '[]'
      );
    } catch {
      this.movementList = [];
    }
  }

  saveToStorage(): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.movementList)
    );
  }
  get filteredMovements(): EmployeeMovement[] {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.empMovList;
    }
    return this.empMovList.filter(item =>
      String(item.srNo).includes(search) ||
      item.empIdNo.toLowerCase().includes(search) ||
      item.name.toLowerCase().includes(search) ||
      item.contractName.toLowerCase().includes(search) ||
      item.department.toLowerCase().includes(search) ||
      item.destination.toLowerCase().includes(search)
    );
  }
  saveMovement(): void {
    if (
      !this.movement.empIdNo.trim() ||
      !this.movement.name.trim() ||
      !this.movement.fromPlant.trim() ||
      !this.movement.destination.trim() ||
      !this.movement.securitySupervisorName.trim()
    ) {
      alert(
        'Please fill Employee ID, Employee Name, From Plant, Destination and Security Supervisor Name.'
      );
    }

    const fintdep = this.Department.find((x: any) => x.code == this.movement.department);
    if (fintdep) {
      this.movement.department = fintdep.name;
    }
    this.EmployeeSer.SaveEmpMov(this.movement).subscribe(
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
    this.resetForm();
  }

  markOut(item: any, type: any): void {
    if (type == 'OUT') {
      item.outTime = new Date().toTimeString().substring(0, 5);
      item.inTime = '';
    }
    else {
      item.inTime = new Date().toTimeString().substring(0, 5);
    }
    this.EmployeeSer.markOut_In(type, item.srNo).subscribe(
      (data: any) => {
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

    this.saveToStorage();
  }

  markIn(item: EmployeeMovement): void {
    if (!item.outTime) {
      alert('Please record OUT time first.');
      return;
    }

    item.inTime = new Date().toTimeString().substring(0, 5);

    this.saveToStorage();
  }
  resetForm(): void {
    this.movement = this.getEmptyMovement();
  }
  deleteMovement(item: EmployeeMovement): void {
    const confirmDelete = confirm(
      `Are you sure you want to delete movement record ${item.srNo}?`
    );
    if (!confirmDelete) {
      return;
    }
    this.EmployeeSer.DelteteMov(item.srNo).subscribe(
      (data: any) => {
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



    this.saveToStorage();
  }
  isExpanded = true;

toggleExpand() {
  this.isExpanded = !this.isExpanded;
}
}
