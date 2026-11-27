import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutWardCourierComponent } from './out-ward-courier.component';

describe('OutWardCourierComponent', () => {
  let component: OutWardCourierComponent;
  let fixture: ComponentFixture<OutWardCourierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutWardCourierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OutWardCourierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
