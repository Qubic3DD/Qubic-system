import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDriverProfile } from './view-fleet-owner.component';

describe('ViewDriverProfile', () => {
  let component: ViewDriverProfile;
  let fixture: ComponentFixture<ViewDriverProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDriverProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDriverProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
