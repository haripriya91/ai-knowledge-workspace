import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceService } from '../../features/workspace/workspace.service';
import { WorkspaceStore } from '../../features/workspace/workspace.store';
import { AiService } from '../../features/ai/ai.service';
import { AiAction } from '../../shared/models/ai-feature.model';
import { ChatUIMessage } from '../../shared/models/chat.model';
import { Asset } from '../../shared/models/asset.model';

@Component({
  selector: 'app-workspace-details',
  templateUrl: './workspace-details.component.html',
})
export class WorkspaceDetailsComponent {

  private workspaceService = inject(WorkspaceService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(WorkspaceStore);
  private aiService = inject(AiService);

  workspace: any;
  workspaceId!: string;

  loading = signal(false);
  error = signal('');

  chatMessages = signal<ChatUIMessage[]>([]);
  chatInput = signal('');

  activeTab = signal<'sources' | 'chat' | 'ai'>('chat');

  private lastProcessedAssetId: string | null = null;

  constructor() {
    effect(() => {
      const asset = this.store.selectedAsset();

      if (asset && asset._id !== this.lastProcessedAssetId) {
        this.lastProcessedAssetId = asset._id;
        // optional: auto summary
      }
    });
  }

  ngOnInit() {
    this.workspaceId = this.route.snapshot.paramMap.get('id')!;
    this.loadWorkspace();
  }

  loadWorkspace() {
    this.loading.set(true);

    this.workspaceService.getWorkspaceDetails(this.workspaceId).subscribe({
      next: (data) => {
        this.workspace = data;
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load workspace');
        this.loading.set(false);

        if (err.status === 401) {
          this.router.navigate(['/dashboard']);
        }
      },
    });
  }

  // 🔥 AI ACTION (summary etc.)
  handleAiAction(action: AiAction) {
    const asset = this.store.selectedAsset();
    if (!asset) return;

    this.loading.set(true);

    this.aiService.processAsset(action, this.workspaceId, asset)
      .subscribe({
        next: (res) => {
          this.loading.set(false);

          if (action === 'summary') {
            this.chatMessages.update(msgs => [
              ...msgs,
              { role: 'user', text: 'Summarize this document' },
              { role: 'assistant', text: res.data as string }
            ]);
          }
        },
        error: () => this.loading.set(false),
      });
  }

  // 🔥 CHAT
  sendMessage() {
    const message = this.chatInput().trim();
    if (!message) return;

    const asset = this.store.selectedAsset();
    if (!asset) return;

    // push user
    this.chatMessages.update(msgs => [
      ...msgs,
      { role: 'user', text: message }
    ]);

    this.chatInput.set('');
    this.loading.set(true);

    this.aiService.processAsset(
      'chat',
      this.workspaceId,
      asset,
      message,
      this.chatMessages()
    ).subscribe({
      next: (res) => {
        this.chatMessages.update(msgs => [
          ...msgs,
          { role: 'assistant', text: res.data as string }
        ]);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}