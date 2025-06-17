import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponentAgency } from './dashboard.component';

describe('DashboardComponentAgency', () => {
  let component: DashboardComponentAgency;
  let fixture: ComponentFixture<DashboardComponentAgency>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponentAgency]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponentAgency);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
