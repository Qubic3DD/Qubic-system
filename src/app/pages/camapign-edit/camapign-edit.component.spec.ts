import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamapignEditComponentPages } from './camapign-edit.component';

describe('CamapignEditComponentPages', () => {
  let component: CamapignEditComponentPages;
  let fixture: ComponentFixture<CamapignEditComponentPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CamapignEditComponentPages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CamapignEditComponentPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
