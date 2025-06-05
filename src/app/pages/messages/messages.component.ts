import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  count?: number;  // optional count property
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

  filters: Filter[] = [
    { id: 'all', label: 'All', active: true },
    { id: 'unread', label: 'Unread', active: false },
    { id: 'read', label: 'Read', active: false },
    { id: 'flagged', label: 'Flagged', active: false }
  ];

  // For multi-select message IDs
  selectedMessages: number[] = [];

  // For tag filters (flagged, urgent, read, unread)
  activeTags: string[] = [];

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1; // placeholder

  defaultAvatar = 'https://www.gravatar.com/avatar/?d=mp&s=48'; // generic avatar url

  ngOnInit(): void {
    this.fetchMessages();
  }

  fetchMessages() {
    // Mock data with some flags and urgent flags
    this.allMessages = [
      { id: 1, sender: 'John Doe', senderAvatarUrl: '', subject: 'Bug Report', content: 'Issue with app crashing on startup...', timestamp: '2025-06-04 12:20', status: 'unread', isFlagged: false, isUrgent: true },
      { id: 2, sender: 'Mary Jane', senderAvatarUrl: '', subject: 'Abuse Report', content: 'Someone is spamming inappropriate content.', timestamp: '2025-06-03 14:15', status: 'read', isFlagged: true, isUrgent: false },
      { id: 3, sender: 'Admin', senderAvatarUrl: '', subject: 'System Notice', content: 'System maintenance scheduled for tomorrow.', timestamp: '2025-06-02 10:00', status: 'flagged', isFlagged: true, isUrgent: false }
    ];
    this.applyFilter('all');
  }

  applyFilter(filterId: string): void {
    this.filters.forEach(f => f.active = f.id === filterId);
    this.activeFilter = filterId;

    if (filterId === 'all') {
      this.filteredMessages = [...this.allMessages];
    } else {
      this.filteredMessages = this.allMessages.filter(msg => msg.status === filterId);
    }

    this.applyTagFilters();

    if (this.searchQuery) {
      this.searchMessages();
    }

    this.clearSelection();
  }

  applyTagFilters(): void {
    if (this.activeTags.length === 0) return;

    this.filteredMessages = this.filteredMessages.filter(msg => {
      for (const tag of this.activeTags) {
        if (tag === 'flagged' && !msg.isFlagged) return false;
        if (tag === 'urgent' && !msg.isUrgent) return false;
        if (tag === 'read' && msg.status !== 'read') return false;
        if (tag === 'unread' && msg.status !== 'unread') return false;
      }
      return true;
    });
  }

  searchMessages() {
    const query = this.searchQuery.toLowerCase();
    this.filteredMessages = this.filteredMessages.filter(msg =>
      msg.subject.toLowerCase().includes(query) ||
      msg.sender.toLowerCase().includes(query) ||
      msg.content.toLowerCase().includes(query)
    );
  }
updateFilterCounts() {
  this.filters.forEach(filter => {
    if (filter.id === 'all') {
      filter.count = this.allMessages.length;
    } else {
      filter.count = this.allMessages.filter(msg => msg.status === filter.id).length;
    }
  });
}

  markAsRead(id: number) {
    const msg = this.allMessages.find(m => m.id === id);
    if (msg) {
      msg.status = 'read';
      this.applyFilter(this.activeFilter);
    }
  }

  deleteMessage(id: number) {
    this.allMessages = this.allMessages.filter(m => m.id !== id);
    this.applyFilter(this.activeFilter);
  }

  flagMessage(id: number) {
    const msg = this.allMessages.find(m => m.id === id);
    if (msg) {
      msg.status = 'flagged';
      msg.isFlagged = true;
      this.applyFilter(this.activeFilter);
    }
  }

  // Multi-select toggle
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

  // Batch operations
  markSelectedAsRead(): void {
    this.selectedMessages.forEach(id => {
      const msg = this.allMessages.find(m => m.id === id);
      if (msg) msg.status = 'read';
    });
    this.applyFilter(this.activeFilter);
    this.clearSelection();
  }

  flagSelected(): void {
    this.selectedMessages.forEach(id => {
      const msg = this.allMessages.find(m => m.id === id);
      if (msg) {
        msg.status = 'flagged';
        msg.isFlagged = true;
      }
    });
    this.applyFilter(this.activeFilter);
    this.clearSelection();
  }

  deleteSelected(): void {
    this.allMessages = this.allMessages.filter(m => !this.selectedMessages.includes(m.id));
    this.applyFilter(this.activeFilter);
    this.clearSelection();
  }

  // Tag toggling for sidebar tags
  toggleTag(tagId: string): void {
    const idx = this.activeTags.indexOf(tagId);
    if (idx > -1) {
      this.activeTags.splice(idx, 1);
    } else {
      this.activeTags.push(tagId);
    }
    this.applyFilter(this.activeFilter);
  }

  // Pagination placeholders
  loadNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      // Load next page data here (API call if needed)
    }
  }

  loadPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      // Load previous page data here (API call if needed)
    }
  }

  composeMessage(): void {
    alert('Compose new message functionality to be implemented.');
  }
  
}
