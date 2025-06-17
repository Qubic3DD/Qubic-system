import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponentAdvertiser } from './sidebar.component';

describe('SidebarComponentAdvertiser', () => {
  let component: SidebarComponentAdvertiser;
  let fixture: ComponentFixture<SidebarComponentAdvertiser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponentAdvertiser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComponentAdvertiser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
