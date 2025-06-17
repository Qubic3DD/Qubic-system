import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAgenciesComponent } from './edit-profile.component.component';

describe('EditAgenciesComponent', () => {
  let component: EditAgenciesComponent;
  let fixture: ComponentFixture<EditAgenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAgenciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAgenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
