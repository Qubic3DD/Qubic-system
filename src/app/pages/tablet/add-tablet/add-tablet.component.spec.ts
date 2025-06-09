import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTabletComponent } from './add-tablet.component';

describe('AddTabletComponent', () => {
  let component: AddTabletComponent;
  let fixture: ComponentFixture<AddTabletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTabletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTabletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
