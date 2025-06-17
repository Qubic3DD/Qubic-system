import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabletComponentFleet } from './tablet.component';

describe('TabletComponentFleet', () => {
  let component: TabletComponentFleet;
  let fixture: ComponentFixture<TabletComponentFleet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabletComponentFleet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabletComponentFleet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
