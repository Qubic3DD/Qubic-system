import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesComponentAdvertiser } from './messages.component';

describe('MessagesComponentAdvertiser', () => {
  let component: MessagesComponentAdvertiser;
  let fixture: ComponentFixture<MessagesComponentAdvertiser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesComponentAdvertiser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesComponentAdvertiser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
