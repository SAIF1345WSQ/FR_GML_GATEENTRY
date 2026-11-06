import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeMovementComponent } from './employee-movement/employee-movement.component';
import { MaterialInwardComponent } from './material-inward/material-inward.component';
import { MaterialOutwardComponent } from './material-outward/material-outward.component';
import { VisitorGateEntryComponent } from './visitor-gate-entry/visitor-gate-entry.component';

export const routes: Routes = [
 { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    {
        path: '', component: LayoutComponent, children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'employee', component: EmployeeComponent },
            { path: 'empMovmnt', component: EmployeeMovementComponent },
            { path: 'materialInward', component: MaterialInwardComponent },
            { path: 'materialOutward', component: MaterialOutwardComponent },
            { path: 'visitorGateEntry', component: VisitorGateEntryComponent }
        ]
    }
];
