import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponentAgency } from './sidebar.component';

describe('SidebarComponentAgency', () => {
  let component: SidebarComponentAgency;
  let fixture: ComponentFixture<SidebarComponentAgency>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponentAgency]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComponentAgency);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
