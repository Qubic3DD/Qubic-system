import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAgenciesComponent } from './add-advertiser.component';

describe('AddAgenciesComponent', () => {
  let component: AddAgenciesComponent;
  let fixture: ComponentFixture<AddAgenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAgenciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAgenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
