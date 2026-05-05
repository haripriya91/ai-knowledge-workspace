// src/app/core/services/ai.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AiResult, AiAction, ChatMessage } from '../../shared/models/ai-feature.model';
import { Asset } from '../../shared/models/source.model';

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly API = 'http://localhost:3000/api/ai/process';

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

}