// src/app/core/services/ai.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AiResult, AiAction, ChatMessage } from '../../shared/models/ai-feature.model';
import { Asset } from '../../shared/models/source.model';

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly API = 'http://localhost:3000/ai/process';

  constructor(private http: HttpClient) {}

  // Called AFTER a file is already uploaded — pass the saved filePath from backend
  processFile(
    action: AiAction,
    workspaceId: string,
    filePath: string,           // path returned from your upload endpoint
    question?: string,
    history?: ChatMessage[]
  ): Observable<AiResult> {
    const form = new FormData();
    form.append('action', action);
    form.append('workspaceId', workspaceId);
    if (question) form.append('question', question);
    if (history) form.append('history', JSON.stringify(history));

    // Send filePath as text — backend resolves it from disk
    form.append('filePath', filePath);
    return this.http.post<AiResult>(this.API, form);
  }

  // Called with a URL instead of a file
  processAsset(
    action: AiAction,
    workspaceId: string,
    asset: Asset,
    question?: string,
    history?: ChatMessage[]
  ): Observable<AiResult> {
    const form = new FormData();
    form.append('action', action);
    form.append('workspaceId', workspaceId);

    // Backend decides which to use based on asset type
    if (asset.type === 'pdf' && asset.filePath) {
      form.append('filePath', asset.filePath);
    }
    if (asset.type === 'url' && asset.url) {
      form.append('url', asset.url);
    }

    if (question) form.append('question', question);
    if (history?.length) form.append('history', JSON.stringify(history));

    return this.http.post<AiResult>(this.API, form);
  }
}