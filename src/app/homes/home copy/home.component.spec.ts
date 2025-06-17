import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponentDriver } from './home.component';

describe('HomeComponentDriver', () => {
  let component: HomeComponentDriver;
  let fixture: ComponentFixture<HomeComponentDriver>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponentDriver]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponentDriver);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
