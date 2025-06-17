import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideStatisticsComponent } from './ride-statistics.component';

describe('RideStatisticsComponent', () => {
  let component: RideStatisticsComponent;
  let fixture: ComponentFixture<RideStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
