import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTabletComponent } from './assign-tablet.component';

describe('AssignTabletComponent', () => {
  let component: AssignTabletComponent;
  let fixture: ComponentFixture<AssignTabletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignTabletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignTabletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
