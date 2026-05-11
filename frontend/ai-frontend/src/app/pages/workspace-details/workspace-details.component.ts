import { Component, effect, inject, signal } from '@angular/core';
import { WorkspaceHeaderComponent } from '../../features/workspace/components/workspace-header/workspace-header.component';
import { WorkspaceSourcesComponent } from '../../features/workspace/components/workspace-sources/workspace-sources.component';
import { WorkspaceAiFeaturesComponent } from '../../features/workspace/components/workspace-ai-features/workspace-ai-features.component';
import { WorkspaceService } from '../../features/workspace/workspace.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset } from '../../shared/models/asset.model';
import { WorkspaceStore } from '../../features/workspace/workspace.store';
import { AiService } from '../../features/ai/ai.service';
import { MarkdownComponent } from 'ngx-markdown';
import {
  AiAction, AiResult, ChatMessage, FlashCard, QuizItem
} from '../../shared/models/ai-feature.model';
import { ChatUIMessage } from '../../shared/models/chat.model';

type TabType = 'sources' | 'chat' | 'ai';


@Component({
  selector: 'app-workspace-details',
  imports: [ WorkspaceSourcesComponent,WorkspaceAiFeaturesComponent,MarkdownComponent],
  templateUrl: './workspace-details.component.html',
  styleUrl: './workspace-details.component.css'
})
export class WorkspaceDetailsComponent {
  private workspaceService = inject(WorkspaceService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  workspace: any;
   workspaceId!: string;
   workspaceName = '';
   loading = false;
   error = '';
   result: any = null;   
   private lastProcessedAssetId: string | null = null;
   activeTab = signal<TabType>('chat');
   chatMessages = signal<ChatUIMessage[]>([]);
   chatInput = signal<string>('');

   streaming = signal(false);
   streamingMessage = signal('');
  constructor(
    private store: WorkspaceStore,
    private aiService: AiService
  )  {
    effect(() => {
      const asset = this.store.selectedAsset();
  
      if (asset && asset._id !== this.lastProcessedAssetId) {
        this.lastProcessedAssetId = asset._id;
       // this.runInitialSummary(asset);
      }
    });
  }
  ngOnInit() {
    this.workspaceId = this.route.snapshot.paramMap.get('id')!;
    this.loadWorkspace();
  }

  loadWorkspace() {
    this.loading = true;
    this.workspaceService.getWorkspaceDetails(this.workspaceId).subscribe({
      next: (data) => {
        this.workspace = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load workspace';
        this.loading = false;

        if (err.status === 401) {
          this.router.navigate(['/dashboard']);
        }
      }
    });
  }
  
  onNameChange(newName: string) {
    if (this.workspaceId)
      this.workspaceService.update(this.workspaceId, newName).subscribe();
  }

  deleteWorkspace() {
    if (this.workspaceId) {
      this.workspaceService.delete(this.workspaceId).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }

  get isMobile() {
    return window.innerWidth < 768;
  }

  runInitialSummary(asset: Asset) {
    this.loading = true;
  
    this.aiService
      .processAsset('summary', this.workspaceId, asset)
      .subscribe({
        next: (res) => {
          this.result = res;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load summary';
          this.loading = false;
        }
      });
  }
  setTab(tab: TabType) {
    this.activeTab.set(tab);
  }
  setChatInput(value: string) {
    this.chatInput.set(value);
  }

  /*sendMessage() {
    const message = this.chatInput().trim();
    const asset = this.store.selectedAsset();

    if (!message || !asset) return;

    // user message
    this.chatMessages.update(list => [
      ...list,
      { role: 'user', text: message }
    ]);

    this.chatInput.set('');
    this.loading = true;

    this.aiService
      .processAsset('chat', this.workspaceId, asset, message, this.chatMessages())
      .subscribe({
        next: (res) => {
          this.chatMessages.update(list => [
            ...list,
            { role: 'assistant', text: res.data as string }
          ]);
          this.loading = false;
        },
        error: () => this.loading = false
      });
  } */

  sendMessage() {

    const message = this.chatInput().trim();
    const asset = this.store.selectedAsset();
    if (!message || !asset) return;
    // USER MESSAGE
    this.chatMessages.update(list => [
      ...list,
      {
        role: 'user',
        text: message,
      },
    ]);
  
    this.chatInput.set('');
  
    this.streaming.set(true);
  
    let aiText = '';
  
    // EMPTY AI MESSAGE
    this.chatMessages.update(list => [
      ...list,
      {
        role: 'assistant',
        text: '',
      },
    ]);
  
    const eventSource =
      this.aiService.streamChat(
        asset.filePath!,
        message,
        // CHUNK
        (chunk: string) => {
          aiText += chunk;
          this.chatMessages.update(list => {
            const updated = [...list];
            updated[updated.length - 1] = {
              role: 'assistant',
              text: aiText,
            };
            return updated;
          });
        },
        // COMPLETE
        () => {
          this.streaming.set(false);
          eventSource.close();
        },
        // ERROR
        () => {
          this.streaming.set(false);
          eventSource.close();
        },
      );
  }

  /*handleAiAction(action: any) {
    const asset = this.store.selectedAsset();
    if (!asset) return;

    this.loading = true;

    this.aiService.processAsset(action, this.workspaceId, asset)
      .subscribe({
        next: (res) => {

          this.chatMessages.update(list => [
            ...list,
            {
              role: 'user',
              text: action === 'summary'
                ? 'Summarize this document'
                : action
            },
            {
              role: 'assistant',
              text: res.data as string
            }
          ]);

          this.loading = false;
        },
        error: () => this.loading = false
      });
  }*/

  handleAiAction(action: any) {

    const asset = this.store.selectedAsset();

    if (!asset) return;

    this.streaming.set(true);

    let aiText = '';

    // USER ACTION MESSAGE
    this.chatMessages.update(list => [
      ...list,

      {
        role: 'user',
        text:
          action === 'summary'
            ? 'Summarize this document'
            : action,
      },

      {
        role: 'assistant',
        text: '',
      },
    ]);

    const eventSource =
      this.aiService.streamSummary(

        asset.filePath!,

        // CHUNK
        (chunk: string) => {

          aiText += chunk;

          this.chatMessages.update(list => {

            const updated = [...list];

            updated[updated.length - 1] = {
              role: 'assistant',
              text: aiText,
            };

            return updated;
          });
        },

        // COMPLETE
        () => {
          this.streaming.set(false);
          eventSource.close();
        },

        // ERROR
        () => {
          this.streaming.set(false);
          eventSource.close();
        },
      );
  }
}
