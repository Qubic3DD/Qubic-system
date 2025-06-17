import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesComponentDriver } from './messages.component';

describe('MessagesComponentDriver', () => {
  let component: MessagesComponentDriver;
  let fixture: ComponentFixture<MessagesComponentDriver>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesComponentDriver]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesComponentDriver);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
