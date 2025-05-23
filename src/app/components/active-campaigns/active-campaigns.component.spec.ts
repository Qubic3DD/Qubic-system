import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveCampaignsComponent } from './active-campaigns.component';

describe('ActiveCampaignsComponent', () => {
  let component: ActiveCampaignsComponent;
  let fixture: ComponentFixture<ActiveCampaignsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveCampaignsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
