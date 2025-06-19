import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamapignEditComponent } from './camapign-edit.component';

describe('CamapignEditComponent', () => {
  let component: CamapignEditComponent;
  let fixture: ComponentFixture<CamapignEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CamapignEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CamapignEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
