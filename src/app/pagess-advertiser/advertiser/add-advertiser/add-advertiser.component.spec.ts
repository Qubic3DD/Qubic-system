import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdvertiserComponent } from './add-advertiser.component';

describe('AddAdvertiserComponent', () => {
  let component: AddAdvertiserComponent;
  let fixture: ComponentFixture<AddAdvertiserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAdvertiserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAdvertiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
