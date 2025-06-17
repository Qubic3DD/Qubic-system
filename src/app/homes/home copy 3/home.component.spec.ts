import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponentAgency } from './home.component';

describe('HomeComponentAgency', () => {
  let component: HomeComponentAgency;
  let fixture: ComponentFixture<HomeComponentAgency>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponentAgency]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponentAgency);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
