import { Injectable, signal, computed } from '@angular/core';
import { Asset } from '../../shared/models/asset.model';

@Injectable({ providedIn: 'root' })
export class WorkspaceStore {
  // STATE
  private _assets = signal<Asset[]>([]);
  private _selectedAsset = signal<Asset | null>(null);
  private _loading = signal(false);

  // SELECTORS
  assets = computed(() => this._assets());
  selectedAsset = computed(() => this._selectedAsset());
  loading = computed(() => this._loading());

  // ACTIONS
  setAssets(assets: Asset[]) {
    this._assets.set(assets);

    // 👉 auto-select first asset (IMPORTANT FIX)
    if (assets.length > 0 && !this._selectedAsset()) {
      this._selectedAsset.set(assets[0]);
    }
  }

  selectAsset(asset: Asset) {
    this._selectedAsset.set(asset);
  }

  setLoading(val: boolean) {
    this._loading.set(val);
  }

  clear() {
    this._assets.set([]);
    this._selectedAsset.set(null);
  }
}