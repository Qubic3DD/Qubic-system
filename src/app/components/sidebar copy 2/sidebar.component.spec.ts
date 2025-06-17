import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponentFleet } from './sidebar.component';

describe('SidebarComponentFleet', () => {
  let component: SidebarComponentFleet;
  let fixture: ComponentFixture<SidebarComponentFleet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponentFleet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComponentFleet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
