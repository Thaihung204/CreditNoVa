// lib/api.ts
export interface CreditSurvey {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  gender: string
  maritalStatus: string
  companyName: string
  occupation: string
  companyType: string
  monthlyIncome: number
  salaryPaymentMethod: string
  salarySlipImage?: string
  utilityBillImage?: string
  createdAt: string
  updatedAt: string
  creditScore?: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// API Base URL - cập nhật theo server của bạn
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://116.105.30.238:7099/api'

// Generic fetch wrapper với error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      // Thêm credentials nếu cần thiết cho CORS
      credentials: 'include',
      ...options,
    }

    console.log('Making request to:', url)
    
    const response = await fetch(url, defaultOptions)
    
    // Kiểm tra network error
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      data: data,
    }
    
  } catch (error) {
    console.error('API Request Error:', error)
    
    let errorMessage = 'Không thể kết nối đến server'
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.'
    } else if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return {
      success: false,
      data: null as T,
      error: errorMessage,
    }
  }
}

// API functions for credit surveys
export const creditSurveyApi = {
  // Lấy tất cả surveys
  getAll: () => apiRequest<CreditSurvey[]>('/survey'),
  
  // Lấy survey theo ID
  getById: (id: string) => apiRequest<CreditSurvey>(`/survey/${id}`),
  
  // Tạo survey mới
  create: (survey: Omit<CreditSurvey, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiRequest<CreditSurvey>('/survey', {
      method: 'POST',
      body: JSON.stringify(survey),
    }),
  
  // Cập nhật survey
  update: (id: string, survey: Partial<CreditSurvey>) => 
    apiRequest<CreditSurvey>(`/survey/${id}`, {
      method: 'PUT',
      body: JSON.stringify(survey),
    }),
  
  // Xóa survey
  delete: (id: string) => 
    apiRequest<void>(`/survey/${id}`, {
      method: 'DELETE',
    }),
}

// Helper function để handle API errors
export const handleApiError = (error: string) => {
  if (error.includes('CORS')) {
    return 'Lỗi CORS: Vui lòng cấu hình server để cho phép truy cập từ domain này'
  }
  if (error.includes('404')) {
    return 'API endpoint không tồn tại'
  }
  if (error.includes('500')) {
    return 'Lỗi server nội bộ'
  }
  if (error.includes('kết nối')) {
    return 'Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không.'
  }
  return error
}