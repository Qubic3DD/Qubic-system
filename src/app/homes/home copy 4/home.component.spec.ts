import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponentAdvertiser } from './home.component';

describe('HomeComponentAdvertiser', () => {
  let component: HomeComponentAdvertiser;
  let fixture: ComponentFixture<HomeComponentAdvertiser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponentAdvertiser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponentAdvertiser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
