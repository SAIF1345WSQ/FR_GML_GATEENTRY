import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMovementComponent } from './employee-movement.component';

describe('EmployeeMovementComponent', () => {
  let component: EmployeeMovementComponent;
  let fixture: ComponentFixture<EmployeeMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeMovementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
