// src/app/services/message.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Message {
  id: number;
  sender: string;
  senderAvatarUrl?: string;
  subject: string;
  content: string;
  timestamp: string;
  status: 'unread' | 'read' | 'flagged';
  isFlagged?: boolean;
  isUrgent?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = '/api/messages';

  constructor(private http: HttpClient) {}

  getMessages(page: number = 1, status?: string): Observable<{messages: Message[], totalCount: number}> {
    let params = new HttpParams()
      .set('page', page.toString());
    
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<{content: Message[], totalElements: number}>(this.apiUrl, { params })
      .pipe(
        map(response => ({
          messages: response.content,
          totalCount: response.totalElements
        }))
      );
  }

  searchMessages(query: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/search`, { 
      params: { query } 
    });
  }

  markMultipleAsRead(ids: number[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/bulk/read`, { messageIds: ids });
  }

  flagMultipleMessages(ids: number[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/bulk/flag`, { messageIds: ids });
  }


  deleteMultipleMessages(ids: number[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/bulk`, { 
      body: { messageIds: ids } 
    });
  }

  getMessageCounts(): Observable<{all: number, unread: number, read: number, flagged: number}> {
    return this.http.get<{all: number, unread: number, read: number, flagged: number}>(`${this.apiUrl}/counts`);
  }

  
  getMessagesForUser(userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/user/${userId}`);
  }

  sendMessage(message: Partial<Message>): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, message);
  }

  markAsRead(messageId: number): Observable<Message> {
    return this.http.patch<Message>(`${this.apiUrl}/${messageId}/read`, {});
  }

  flagMessage(messageId: number): Observable<Message> {
    return this.http.patch<Message>(`${this.apiUrl}/${messageId}/flag`, {});
  }

  deleteMessage(messageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${messageId}`);
  }
}