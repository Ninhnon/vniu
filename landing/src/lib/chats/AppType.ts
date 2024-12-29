export interface SuccessResponse<Data> {
  message: string
  data: Data
}

export interface ErrorResponse {
  status: number
  error: string
}
