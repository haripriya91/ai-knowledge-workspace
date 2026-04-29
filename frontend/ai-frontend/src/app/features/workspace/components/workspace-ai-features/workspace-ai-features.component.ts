import { Component, Input, OnInit } from '@angular/core';
import { AiFeatureCardComponent } from '../../../ai/components/ai-feature-card/ai-feature-card.component';
import { AiService } from '../../../ai/ai.service';
import {
  AiAction, AiResult, ChatMessage, FlashCard, QuizItem
} from '../../../../shared/models/ai-feature.model'
import { Asset } from '../../../../shared/models/asset.model';
import { WorkspaceStore } from '../../workspace.store';

@Component({
  selector: 'app-workspace-ai-features',
  imports: [AiFeatureCardComponent],
  templateUrl: './workspace-ai-features.component.html',
  styleUrl: './workspace-ai-features.component.css'
})
export class WorkspaceAiFeaturesComponent {
  @Input() workspaceId!: string;

  loading = false;
  result: AiResult | null = null;
  question = '';
  error = '';

  // Chat state
  chatHistory: ChatMessage[] = [];
  chatInput = '';

  constructor(private aiService: AiService,
    private store: WorkspaceStore

  ) {}

  get selectedAsset() {
    return this.store.selectedAsset();
  }

  // Guard — show message if no asset selected yet
  get hasAsset(): boolean {
    return !!this.selectedAsset;
  }

  runAction(action: AiAction) {
    if (!this.selectedAsset) return;
    this.loading = true;
    this.result = null;
    this.error = '';

    this.aiService
      .processAsset(action, this.workspaceId, this.selectedAsset, this.question)
      .subscribe({
        next: (res) => { this.result = res; this.loading = false; },
        error: () => { this.error = 'AI request failed.'; this.loading = false; }
      });
  }

  sendChat() {
    if (!this.chatInput.trim() || !this.selectedAsset) return;

    this.chatHistory.push({ role: 'user', text: this.chatInput });
    this.loading = true;

    this.aiService
      .processAsset('chat', this.workspaceId, this.selectedAsset, this.chatInput, this.chatHistory)
      .subscribe({
        next: (res) => {
          this.chatHistory.push({ role: 'assistant', text: res.data as string });
          this.loading = false;
          this.chatInput = '';
        },
        error: () => { this.loading = false; }
      });
  }
}
