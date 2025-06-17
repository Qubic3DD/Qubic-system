import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetOwnersComponent } from './fleet-owners.component';

describe('FleetOwnersComponent', () => {
  let component: FleetOwnersComponent;
  let fixture: ComponentFixture<FleetOwnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FleetOwnersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FleetOwnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
