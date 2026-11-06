import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface EmployeeMovement {
  srNo: number;
  empType: string;
  empIdNo: string;
  contractName: string;
  name: string;
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
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-movement.component.html',
  styleUrls: ['./employee-movement.component.css']
})
export class EmployeeMovementComponent {

  private readonly storageKey = 'employeeMovementRecords';

  movement: EmployeeMovement = this.getEmptyMovement();

  movementList: EmployeeMovement[] = [];

  searchText = '';

  empTypeOptions = ['STAFF', 'CONTRACT'];

  purposeOptions = ['OFFICIAL', 'PERSONAL'];

  constructor() {
    this.loadMovements();
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
      return this.movementList;
    }

    return this.movementList.filter(item =>
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
      return;
    }

    if (
      this.movement.empType === 'CONTRACT' &&
      !this.movement.contractName.trim()
    ) {
      alert('Please enter Contract Name.');
      return;
    }

    const nextSrNo =
      this.movementList.length > 0
        ? Math.max(...this.movementList.map(item => item.srNo || 0)) + 1
        : 1;

    const newMovement: EmployeeMovement = {
      ...this.movement,
      srNo: nextSrNo,
      outTime: this.movement.outTime ||
        new Date().toTimeString().substring(0, 5)
    };

    this.movementList.unshift(newMovement);

    try {
      this.saveToStorage();
    } catch {
      this.movementList.shift();
      alert('Unable to save movement record in browser storage.');
      return;
    }

    alert('Employee movement saved successfully.');

    this.resetForm();
  }

  markOut(item: EmployeeMovement): void {
    item.outTime = new Date().toTimeString().substring(0, 5);
    item.inTime = '';

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

    this.movementList = this.movementList.filter(
      record => record !== item
    );

    this.saveToStorage();
  }
}
