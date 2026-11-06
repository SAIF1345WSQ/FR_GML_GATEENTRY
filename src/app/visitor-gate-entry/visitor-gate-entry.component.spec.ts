import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorGateEntryComponent } from './visitor-gate-entry.component';

describe('VisitorGateEntryComponent', () => {
  let component: VisitorGateEntryComponent;
  let fixture: ComponentFixture<VisitorGateEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorGateEntryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisitorGateEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
