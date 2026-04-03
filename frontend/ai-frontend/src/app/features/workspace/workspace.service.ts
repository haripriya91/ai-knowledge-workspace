import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  private baseUrl = 'http://localhost:3000/api/workspaces';

  constructor(private http: HttpClient) {}

  create(name: string) {
    return this.http.post<any>('http://localhost:3000/api/workspaces', { name });
  }

  getWorkspace() {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  getPublicWorkspace() {
    return this.http.get<any>('http://localhost:3000/api/workspaces/publicWorkspaces');
  }

  update(id: string, name: string) {
    return this.http.patch(`${this.baseUrl}/${id}`, { name });
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}