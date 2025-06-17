import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignStatusComponent } from './campaign-status.component';

describe('CampaignStatusComponent', () => {
  let component: CampaignStatusComponent;
  let fixture: ComponentFixture<CampaignStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
