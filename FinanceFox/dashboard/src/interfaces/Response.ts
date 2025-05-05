export interface HttpResponse {
  success: boolean;
  errors: string[];
  data?: any;
  code?: 200 | 404 | 401 | 501;
}
