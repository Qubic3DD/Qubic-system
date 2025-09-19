// src/app/messages/messages.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { finalize } from 'rxjs';

type MessageReport = {
  id: number;
  sender: string;
  senderAvatarUrl?: string;
  subject: string;
  content: string;
  timestamp: string;
  status: 'unread' | 'read' | 'flagged';
  isFlagged?: boolean;
  isUrgent?: boolean;
  expanded?: boolean;
};

type Filter = {
  id: string;
  label: string;
  active: boolean;
  count?: number;
};

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  allMessages: MessageReport[] = [];
  filteredMessages: MessageReport[] = [];
  searchQuery: string = '';
  activeFilter: string = 'all';
  isLoading = false;
  // KPI stats
  totalMessages = 0;
  unreadMessages = 0;
  readMessages = 0;
  flaggedMessages = 0;

  filters: Filter[] = [
    { id: 'all', label: 'All', active: true, count: 0 },
    { id: 'unread', label: 'Unread', active: false, count: 0 },
    { id: 'read', label: 'Read', active: false, count: 0 },
    { id: 'flagged', label: 'Flagged', active: false, count: 0 }
  ];

  selectedMessages: number[] = [];
  activeTags: string[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage = 10;

  defaultAvatar = 'https://www.gravatar.com/avatar/?d=mp&s=48';

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.fetchMessages();
    this.fetchMessageCounts();
  }

  fetchMessages(): void {
    this.isLoading = true;
    const status = this.activeFilter === 'all' ? undefined : this.activeFilter;
    
    this.messageService.getMessages(this.currentPage, status)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: { messages: MessageReport[]; totalCount: number; }) => {
          this.allMessages = response.messages;
          this.filteredMessages = [...this.allMessages];
          this.totalPages = Math.ceil(response.totalCount / this.itemsPerPage);
          this.applyTagFilters();
          this.updateKpis();
        },
        error: (err: any) => console.error('Failed to fetch messages', err)
      });
  }

  fetchMessageCounts(): void {
    this.messageService.getMessageCounts().subscribe({
      next: (counts: { all: number | undefined; unread: number | undefined; read: number | undefined; flagged: number | undefined; }) => {
        this.filters[0].count = counts.all;
        this.filters[1].count = counts.unread;
        this.filters[2].count = counts.read;
        this.filters[3].count = counts.flagged;
        // Use server counts to set KPIs if available
        this.totalMessages = counts.all ?? this.totalMessages;
        this.unreadMessages = counts.unread ?? this.unreadMessages;
        this.readMessages = counts.read ?? this.readMessages;
        this.flaggedMessages = counts.flagged ?? this.flaggedMessages;
      },
      error: (err: any) => console.error('Failed to fetch message counts', err)
    });
  }

  private updateKpis(): void {
    const all = this.allMessages || [];
    this.totalMessages = all.length;
    this.unreadMessages = all.filter(m => m.status === 'unread').length;
    this.readMessages = all.filter(m => m.status === 'read').length;
    this.flaggedMessages = all.filter(m => m.status === 'flagged' || m.isFlagged).length;
  }

  applyFilter(filterId: string): void {
    this.filters.forEach(f => f.active = f.id === filterId);
    this.activeFilter = filterId;
    this.currentPage = 1; // Reset to first page when filter changes
    this.fetchMessages();
  }

  applyTagFilters(): void {
    if (this.activeTags.length === 0) {
      this.filteredMessages = [...this.allMessages];
      return;
    }

    this.filteredMessages = this.allMessages.filter(msg => {
      for (const tag of this.activeTags) {
        if (tag === 'flagged' && !msg.isFlagged) return false;
        if (tag === 'urgent' && !msg.isUrgent) return false;
        if (tag === 'read' && msg.status !== 'read') return false;
        if (tag === 'unread' && msg.status !== 'unread') return false;
      }
      return true;
    });
  }

  searchMessages(): void {
    if (!this.searchQuery.trim()) {
      this.filteredMessages = [...this.allMessages];
      return;
    }

    this.messageService.searchMessages(this.searchQuery).subscribe({
      next: (messages: MessageReport[]) => {
        this.filteredMessages = messages;
      },
      error: (err: any) => console.error('Search failed', err)
    });
  }

  markAsRead(id: number): void {
    this.messageService.markAsRead(id).subscribe({
      next: (updatedMessage: MessageReport) => {
        const index = this.allMessages.findIndex(m => m.id === id);
        if (index !== -1) {
          this.allMessages[index] = updatedMessage;
          this.applyFilter(this.activeFilter);
        }
      },
      error: (err: any) => console.error('Failed to mark as read', err)
    });
  }

  deleteMessage(id: number): void {
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        this.allMessages = this.allMessages.filter(m => m.id !== id);
        this.applyFilter(this.activeFilter);
      },
      error: (err: any) => console.error('Failed to delete message', err)
    });
  }

  flagMessage(id: number): void {
    this.messageService.flagMessage(id).subscribe({
      next: (updatedMessage: MessageReport) => {
        const index = this.allMessages.findIndex(m => m.id === id);
        if (index !== -1) {
          this.allMessages[index] = updatedMessage;
          this.applyFilter(this.activeFilter);
        }
      },
      error: (err: any) => console.error('Failed to flag message', err)
    });
  }

  // Multi-select operations
  markSelectedAsRead(): void {
    if (this.selectedMessages.length === 0) return;
    
    this.messageService.markMultipleAsRead(this.selectedMessages).subscribe({
      next: () => {
        this.fetchMessages();
        this.clearSelection();
      },
      error: (err: any) => console.error('Failed to mark selected as read', err)
    });
  }

  flagSelected(): void {
    if (this.selectedMessages.length === 0) return;
    
    this.messageService.flagMultipleMessages(this.selectedMessages).subscribe({
      next: () => {
        this.fetchMessages();
        this.clearSelection();
      },
      error: (err: any) => console.error('Failed to flag selected messages', err)
    });
  }

  deleteSelected(): void {
    if (this.selectedMessages.length === 0) return;
    
    this.messageService.deleteMultipleMessages(this.selectedMessages).subscribe({
      next: () => {
        this.fetchMessages();
        this.clearSelection();
      },
      error: (err: any) => console.error('Failed to delete selected messages', err)
    });
  }

  toggleSelection(id: number): void {
    const index = this.selectedMessages.indexOf(id);
    if (index > -1) {
      this.selectedMessages.splice(index, 1);
    } else {
      this.selectedMessages.push(id);
    }
  }

  clearSelection(): void {
    this.selectedMessages = [];
  }

  toggleTag(tagId: string): void {
    const idx = this.activeTags.indexOf(tagId);
    if (idx > -1) {
      this.activeTags.splice(idx, 1);
    } else {
      this.activeTags.push(tagId);
    }
    this.applyTagFilters();
  }

  // Pagination
  loadNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchMessages();
    }
  }

  loadPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchMessages();
    }
  }

  composeMessage(): void {
    alert('Compose new message functionality to be implemented.');
  }
}