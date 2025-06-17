// src/app/components/messages/messages.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Message, MessageService } from '../../services/message.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
   imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
     
  ],
    providers: [DatePipe],
})
export class MessagesComponentDriver implements OnInit {
getStatusClass(arg0: string) {
throw new Error('Method not implemented.');
}
  messageForm: FormGroup;
  messages: Message[] = [];
  isLoading = false;
  isSending = false;
  darkMode = false;

  // User information
  senderId: number | null = null;
  userEmail: string | null = null;
  recipientId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
    this.messageForm = this.fb.group({
      subject: ['', [Validators.required, Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.maxLength(1000)]],
      urgent: [false]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.senderId = params['senderId'] ? +params['senderId'] : null;
      this.userEmail = params['userEmail'] || null;
      this.recipientId = params['recipientId'] ? +params['recipientId'] : null;
      
      this.checkDarkModePreference();
      this.loadMessages();
    });
  }

  checkDarkModePreference(): void {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const userPref = localStorage.getItem('darkMode');
    this.darkMode = userPref ? JSON.parse(userPref) : prefersDark;
    this.updateDarkModeClass();
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', JSON.stringify(this.darkMode));
    this.updateDarkModeClass();
  }

  updateDarkModeClass(): void {
    document.documentElement.classList.toggle('dark', this.darkMode);
  }

  loadMessages(): void {
    if (!this.senderId) return;

    this.isLoading = true;
    this.messageService.getMessagesForUser(this.senderId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading messages', error);
        this.isLoading = false;
      }
    });
  }

  sendMessage(): void {
    if (this.messageForm.invalid || !this.senderId || !this.recipientId) return;

    this.isSending = true;
    const message: Partial<Message> = {
      subject: this.messageForm.value.subject,
      content: this.messageForm.value.content,
      isUrgent: this.messageForm.value.urgent,
      sender: this.userEmail || 'Unknown',
      id: this.recipientId
    };

    this.messageService.sendMessage(message).subscribe({
      next: (newMessage) => {
        this.messages.unshift(newMessage);
        this.messageForm.reset();
        this.isSending = false;
      },
      error: (error) => {
        console.error('Error sending message', error);
        this.isSending = false;
      }
    });
  }

  markAsRead(messageId: number): void {
    this.messageService.markAsRead(messageId).subscribe({
      next: (updatedMessage) => this.updateLocalMessage(updatedMessage),
      error: (error) => console.error('Error marking message as read', error)
    });
  }

  flagMessage(messageId: number): void {
    this.messageService.flagMessage(messageId).subscribe({
      next: (updatedMessage) => this.updateLocalMessage(updatedMessage),
      error: (error) => console.error('Error flagging message', error)
    });
  }

  deleteMessage(messageId: number): void {
    if (confirm('Are you sure you want to delete this message?')) {
      this.messageService.deleteMessage(messageId).subscribe({
        next: () => {
          this.messages = this.messages.filter(m => m.id !== messageId);
        },
        error: (error) => console.error('Error deleting message', error)
      });
    }
  }

  private updateLocalMessage(updatedMessage: Message): void {
    const index = this.messages.findIndex(m => m.id === updatedMessage.id);
    if (index !== -1) {
      this.messages[index] = updatedMessage;
    }
  }
}