// src/app/core/services/ai.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AiResult, AiAction, ChatMessage } from '../../shared/models/ai-feature.model';
import { Asset } from '../../shared/models/source.model';

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly API = 'http://localhost:3000/api/ai/process';
  private readonly STREAM_API = 'http://localhost:3000/api/ai';

  constructor(private http: HttpClient) {}

  processFile(
    action: AiAction,
    workspaceId: string,
    filePath: string,
    question?: string,
    history?: ChatMessage[]
  ): Observable<AiResult> {

    return this.http.post<AiResult>(this.API, {
      action,
      workspaceId,
      filePath,
      question,
      history,
    });
  }

  processAsset(
    action: AiAction,
    workspaceId: string,
    asset: Asset,
    question?: string,
    history?: ChatMessage[]
  ): Observable<AiResult> {

    const payload: any = {
      action,
      workspaceId,
      question,
      history,
    };

    if (asset.type === 'pdf' && asset.filePath) {
      payload.filePath = asset.filePath; 
    }

    if (asset.type === 'url' && asset.url) {
      payload.url = asset.url;
    }

    return this.http.post<AiResult>(this.API, payload);
  }

   // STREAM SUMMARY
   streamSummary(
    fileKey: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: () => void,
  ): EventSource {

    const eventSource = new EventSource(
      `${this.STREAM_API}/summary-stream?fileKey=${encodeURIComponent(fileKey)}`
    );

    eventSource.onmessage = (event) => {
      onChunk(event.data);
    };

    eventSource.onerror = () => {
      eventSource.close();
      onError();
    };

    return eventSource;
  }

  // STREAM CHAT
  streamChat(
    fileKey: string,
    message: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: () => void,
  ): EventSource {

    const eventSource = new EventSource(
      `${this.STREAM_API}/chat-stream?fileKey=${encodeURIComponent(fileKey)}&message=${encodeURIComponent(message)}`
    );

    eventSource.onmessage = (event) => {
      onChunk(event.data);
    };

    eventSource.onerror = () => {
      eventSource.close();
      onError();
    };

    return eventSource;
  }

}