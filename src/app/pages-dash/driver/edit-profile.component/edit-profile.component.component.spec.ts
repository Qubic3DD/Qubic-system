import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileComponentDrive } from './edit-profile.component.component';

describe('EditProfileComponentDrive', () => {
  let component: EditProfileComponentDrive;
  let fixture: ComponentFixture<EditProfileComponentDrive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProfileComponentDrive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProfileComponentDrive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
