import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBreakdownComponent } from './user-breakdown.component';

describe('UserBreakdownComponent', () => {
  let component: UserBreakdownComponent;
  let fixture: ComponentFixture<UserBreakdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBreakdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
