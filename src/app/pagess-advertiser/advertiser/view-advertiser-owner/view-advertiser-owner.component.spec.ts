import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAdvertiserComponentDetatils } from './view-advertiser-owner.component';

describe('ViewAdvertiserComponentDetatils', () => {
  let component: ViewAdvertiserComponentDetatils;
  let fixture: ComponentFixture<ViewAdvertiserComponentDetatils>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAdvertiserComponentDetatils]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAdvertiserComponentDetatils);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
