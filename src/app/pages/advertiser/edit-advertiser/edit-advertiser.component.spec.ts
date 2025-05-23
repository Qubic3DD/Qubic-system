import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdvertiserComponent } from './edit-advertiser.component';

describe('EditAdvertiserComponent', () => {
  let component: EditAdvertiserComponent;
  let fixture: ComponentFixture<EditAdvertiserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAdvertiserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAdvertiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
