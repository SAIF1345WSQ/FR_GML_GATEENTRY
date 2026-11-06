import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialOutwardComponent } from './material-outward.component';

describe('MaterialOutwardComponent', () => {
  let component: MaterialOutwardComponent;
  let fixture: ComponentFixture<MaterialOutwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialOutwardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaterialOutwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
