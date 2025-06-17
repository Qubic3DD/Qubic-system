import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignComponentAdvertiser } from './campaign.component';

describe('CampaignComponentAdvertiser', () => {
  let component: CampaignComponentAdvertiser;
  let fixture: ComponentFixture<CampaignComponentAdvertiser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignComponentAdvertiser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignComponentAdvertiser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
