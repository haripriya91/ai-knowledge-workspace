export interface Asset {
    _id: string;
    name: string;
    type: string;
    url?: string;
    filePath?: string;
     userId?: string;
    workspaceId: string;
    isPublic: boolean;
    fileUrl?: string; 
  }