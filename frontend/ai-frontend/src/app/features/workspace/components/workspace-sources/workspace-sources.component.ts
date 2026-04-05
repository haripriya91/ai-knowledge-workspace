import { Component, Input, OnInit } from '@angular/core';
import { SourceCardsComponent } from '../source-cards/source-cards.component';
import { AssetService } from '../../asset.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-workspace-sources',
  imports: [SourceCardsComponent],
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

  constructor(
    private assetService: AssetService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    this.workspaceId = this.route.snapshot.paramMap.get('id')!;
    this.loadAssets();
    console.log(this.assets)
  }

  loadAssets() {
    this.loading = true;
    console.log('Loading assets for workspace:', this.workspaceId, 'Public:', this.isPublicWorkspace);
    if (this.isPublicWorkspace) {
      this.assetService.getPublicAssets(this.workspaceId).subscribe({
        next: (data) => {
          this.assets = data || [];
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load assets';
          this.loading = false;
        }
      });
    } else {
      this.assetService.getMyAssets(this.workspaceId).subscribe({
        next: (data) => {
          this.assets = data || [];
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load assets';
          this.loading = false;
        }
      });
    }
  }


  toggleSources() {
    this.sourcesOpen = !this.sourcesOpen;
  }

  addWorkspaceSource() {
    const name = prompt('Enter asset name');
    if (!name) return;

    this.assetService.create(name).subscribe({
      next: () => this.loadAssets(),
      error: () => this.error = 'Failed to create asset'
    });
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
}
