import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponentAdvertiser } from './dashboard.component';

describe('DashboardComponentAdvertiser', () => {
  let component: DashboardComponentAdvertiser;
  let fixture: ComponentFixture<DashboardComponentAdvertiser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponentAdvertiser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponentAdvertiser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
