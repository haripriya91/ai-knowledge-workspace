import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SourceCardsComponent } from '../source-cards/source-cards.component';
import { AssetService } from '../../asset.service';
import { ActivatedRoute } from '@angular/router';
import { UploadSourceComponent } from '../upload-source/upload-source.component';
import { Asset } from '../../../../shared/models/source.model';
import { WorkspaceStore } from '../../workspace.store';

@Component({
  selector: 'app-workspace-sources',
  imports: [SourceCardsComponent,UploadSourceComponent],
  templateUrl: './workspace-sources.component.html',
  styleUrl: './workspace-sources.component.css'
})
export class WorkspaceSourcesComponent {
  sourcesOpen = true;
  assets: any[] = [];
  @Input() workspaceId!: string;
  @Input() isPublicWorkspace!: boolean;

  loading = false;
  error = '';

  showUploadModal = false;

  constructor(
    private assetService: AssetService,
    private route: ActivatedRoute,
    private store: WorkspaceStore

  ) {}

  ngOnInit() {

    this.workspaceId = this.route.snapshot.paramMap.get('id')!;
    this.loadAssets();
  }

  loadAssets() {
    this.store.setLoading(true);

    const request$ = this.isPublicWorkspace
      ? this.assetService.getPublicAssets(this.workspaceId)
      : this.assetService.getMyAssets(this.workspaceId);
  
    request$.subscribe({
      next: (data) => {
        this.assets = data || [];
  
        this.store.setAssets(this.assets); // ✅ KEY LINE
  
        this.store.setLoading(false);
      },
      error: () => {
        this.error = 'Failed to load assets';
        this.store.setLoading(false);
      }
    });
  }


  toggleSources() {
    this.sourcesOpen = !this.sourcesOpen;
  }

  addWorkspaceSource() {
    this.showUploadModal = true;
  }


  deleteAsset(assetId: string) {
    if (!confirm('Delete this asset?')) return;

    this.assetService.delete(assetId).subscribe({
      next: () => {
        this.assets = this.assets.filter(a => a._id !== assetId);
      },
      error: () => this.error = 'Failed to delete asset'
    });
  }


openUpload() {
  this.showUploadModal = true;
}

closeUpload() {
  this.showUploadModal = false;
}

uploadFile(data: { file?: File; url?: string; name?: string }) {

  const formData = new FormData();

  formData.append('workspaceId', this.workspaceId);

  formData.append('name', data.name?.trim() || 'Untitled');

  if (data.url) {
    formData.append('url', data.url);
    formData.append('type', 'url');
  }

  if (data.file) {
    formData.append('file', data.file);
    formData.append('type', 'pdf'); // or detect dynamically
  }

  this.assetService.createAsset(formData).subscribe({
    next: () => {
      this.loadAssets();
      this.closeUpload();
    },
    error: (err) => {
      console.log(err);
      this.error = 'Failed to add source';
    }
  });
}

selectAsset(asset: Asset) {
  this.store.selectAsset(asset); 
}

}
