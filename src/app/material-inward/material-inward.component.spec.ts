import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialInwardComponent } from './material-inward.component';

describe('MaterialInwardComponent', () => {
  let component: MaterialInwardComponent;
  let fixture: ComponentFixture<MaterialInwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialInwardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaterialInwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
