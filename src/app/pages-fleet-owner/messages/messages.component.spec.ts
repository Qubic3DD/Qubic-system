import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesComponentFleet } from './messages.component';

describe('MessagesComponentFleet', () => {
  let component: MessagesComponentFleet;
  let fixture: ComponentFixture<MessagesComponentFleet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesComponentFleet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesComponentFleet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
