import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFleetProfileComponentComponent } from './edit-profile.component.component';

describe('EditFleetProfileComponentComponent', () => {
  let component: EditFleetProfileComponentComponent;
  let fixture: ComponentFixture<EditFleetProfileComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFleetProfileComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFleetProfileComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
