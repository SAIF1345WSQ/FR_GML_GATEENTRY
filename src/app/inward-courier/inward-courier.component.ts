import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CourierService } from '../services/Courier/courier.service';



export interface CourierEntry {
  srNo?: string;
  docEntry?: string;
  date: string;
  from: string;
  to: string;
  qty: number;
  inTime: string;
  outTime:string;
  courierType: string;
  agencyName: string;
  docketNo: string;
  receiverName: string;
  department: string;
  securityPersonName: string;
  remarks: string;
  selectedModule?:string;
  materialDetails :string;
  approveBy:string;
  sendername:string;
}

@Component({
  selector: 'app-inward-courier',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatAutocompleteModule, MatFormFieldModule, MatInputModule
  ],
  templateUrl: './inward-courier.component.html',
  styleUrl: './inward-courier.component.css'
})
export class InwardCourierComponent {
  private CourierSer = inject(CourierService);

  courierTypeOptions = ['Document', 'Parcel', 'Cargo', 'Registered Post', 'Speed Post'];
  Department: any[] = [];
  couriers: CourierEntry[] = [];
  courier: CourierEntry = this.newEntry();
  isEdit = false;
  searchText = '';
  isExpanded = true;
  selectedModule = '';

  ngOnInit() {
    this.courier.selectedModule = this.CourierSer.getModule();
    this.GetCourList();
  }
  GetCourList() {
    this.CourierSer.GetCourier(this.courier.selectedModule).subscribe(
      (data: any) => {
        this.couriers = data.list;
        this.Department = data.departments;
        this.courier.srNo = data.courrier;
      },
      (error: any) => {
        console.error('Error:', error);
        const msg =
          error?.error?.message ||
          (typeof error?.error === 'string' ? error.error : null) ||
          error?.message ||
          'Unknown error';

        alert('Error: ' + msg);
      }
    )
  }
  newEntry(): CourierEntry {
    const now = new Date();
    return {
    date: now.toISOString().substring(0, 10),     // yyyy-MM-dd
    from: '',
    to: '',
    qty: 1,
    inTime: now.toTimeString().substring(0, 5),   // HH:mm
    outTime: '',
    courierType: '',
    agencyName: '',
    docketNo: '',
    receiverName: '',
    department: '',
    securityPersonName: '',
    remarks: '',
    materialDetails: '',
    approveBy: '',
    sendername: ''
  };
  }
  saveCourier(): void {
    var fileterdep = this.Department.find((x: any) => x.code = this.courier.department);
    if (fileterdep) {
      this.courier.department = fileterdep.name;
    }
    if (this.isEdit) {
      this.CourierSer.UpdateCourier(this.courier).subscribe(
        (data: any) => {
          alert("Update");
          
          this.GetCourList();
          this.resetForm();
        },
        (error: any) => {
          console.error('Error:', error);
          const msg =
            error?.error?.message ||
            (typeof error?.error === 'string' ? error.error : null) ||
            error?.message ||
            'Unknown error';

          alert('Error: ' + msg);
        }
      )
    } else {
      this.CourierSer.SaveCourier(this.courier).subscribe(
        (data: any) => {
          alert("Save")
          this.resetForm();
          this.GetCourList();
        },
        (error: any) => {
          console.error('Error:', error);
          const msg =
            error?.error?.message ||
            (typeof error?.error === 'string' ? error.error : null) ||
            error?.message ||
            'Unknown error';

          alert('Error: ' + msg);
        }
      )
    }
    this.resetForm();
  }
  editCourier(c: CourierEntry): void {
    this.isEdit = true;
    var filterdep = this.Department.find((x:any)=>x.name == c.department)
    if(filterdep){
       c.department =filterdep.code;
    }
    c.date =c.date.substring(0, 10);
    this.courier = { ...c };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  deleteCourier(c: CourierEntry): void {
    const confirmDelete = confirm(
      `Are you sure you want to delete these Courier  ${c.srNo}?`
    );
    if (!confirmDelete) {
      return;
    }
     this.CourierSer.DeleteCour(c.docEntry).subscribe(
        (data: any) => {
          alert("Record Deleted")
          this.GetCourList();
        },
        (error: any) => {
          console.error('Error:', error);
          const msg =
            error?.error?.message ||
            (typeof error?.error === 'string' ? error.error : null) ||
            error?.message ||
            'Unknown error';
          alert('Error: ' + msg);
        }
      )
  }
  resetForm(): void {
    this.courier = this.newEntry();
    this.isEdit = false;
  }
  get filteredCouriers(): CourierEntry[] {
    const t = this.searchText.toLowerCase().trim();
    if (!t) return this.couriers;
    return this.couriers.filter(c =>
      (c.docketNo + c.agencyName + c.receiverName + c.from + c.to).toLowerCase().includes(t));
  }
  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }
}
