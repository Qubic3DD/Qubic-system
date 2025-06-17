import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponentDriver } from './sidebar.component';

describe('SidebarComponentDriver', () => {
  let component: SidebarComponentDriver;
  let fixture: ComponentFixture<SidebarComponentDriver>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponentDriver]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComponentDriver);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
