import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPassengerComponent } from './view-fleet-owner.component';

describe('ViewPassengerComponent', () => {
  let component: ViewPassengerComponent;
  let fixture: ComponentFixture<ViewPassengerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPassengerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPassengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
