import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  private baseUrl = 'http://localhost:3000/api/assets';

  constructor(private http: HttpClient) {}

  createAsset(formData: FormData) {
    return this.http.post<any>(
      'http://localhost:3000/api/assets',
      formData
    );
  }

  getMyAssets(workspaceId: string) {
    return this.http.get<any>(`${this.baseUrl}/${workspaceId}`);
  }

  getPublicAssets(workspaceId: string) {
    return this.http.get<any>(`http://localhost:3000/api/assets/publicAssets/${workspaceId}`);
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
