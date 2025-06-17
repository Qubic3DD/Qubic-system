import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponentFleet } from './home.component';

describe('HomeComponentFleet', () => {
  let component: HomeComponentFleet;
  let fixture: ComponentFixture<HomeComponentFleet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponentFleet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponentFleet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
