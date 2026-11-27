import { Component,inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourierService } from '../services/Courier/courier.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet,RouterModule, CommonModule,FormsModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
isSidebarOpen = true;

  constructor(private router: Router) {}
  private courierService = inject(CourierService);
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.router.navigate(['/login']);
  }
  selectModule(Type:any){
   this.courierService.setModule(Type);
  }
}
