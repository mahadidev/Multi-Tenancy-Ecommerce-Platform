export interface FileManagement {
  id: number;
  user_id: number;
  name: string;
  type: 'image' | 'pdf' | 'document' | 'video';
  response_type: 'url' | 'path';
  width?: number;
  height?: number;
  alternate_text?: string;
  tags: string[];
  location: string;
  url: string;
  size?: number;
  mime_type?: string;
  created_at: string;
  updated_at: string;
}

export interface FileFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'image' | 'pdf' | 'document' | 'video';
  sort_by?: 'name' | 'created_at' | 'size';
  sort_order?: 'asc' | 'desc';
}

export interface FileUploadData {
  file: File;
  type?: string;
  alternate_text?: string;
  tags?: string;
  response_type?: 'url' | 'path';
}

export interface ImageCropData {
  image: HTMLImageElement;
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// API Response Types
export interface FilesResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    files: FileManagement[];
  };
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface FileResponse {
  success: boolean;
  message?: string;
  status: number;
  data: {
    file: FileManagement;
  };
}

// Payload Types
export interface UploadFilePayload {
  type?: string;
  file: any;
  response_type?: string;
  alternate_text?: string;
  tags?: string;
  user_id?: string;
}

export interface UpdateFilePayload {
  id: number;
  type?: string;
  file?: any;
  response_type?: string;
  alternate_text?: string;
  tags?: string;
}

export interface DeleteFilePayload {
  id: number;
}

export interface FetchFilesPayload {
  filters?: FileFilters;
}