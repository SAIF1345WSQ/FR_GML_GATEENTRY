import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardCourierComponent } from './inward-courier.component';

describe('InwardCourierComponent', () => {
  let component: InwardCourierComponent;
  let fixture: ComponentFixture<InwardCourierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InwardCourierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InwardCourierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
