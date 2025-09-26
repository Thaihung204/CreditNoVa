"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CreditCard, ArrowLeft, Send, CalendarIcon, Plus, Trash2, Upload, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface CreditHistoryEntry {
  organization: string
  creditLimit: string
  currentDebt: string
  term: string
}

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://116.105.30.238:7099/api'

export default function GuestFormPage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [birthDate, setBirthDate] = useState<Date>()
  const [salarySlip, setSalarySlip] = useState<File | null>(null)
  const [utilityBills, setUtilityBills] = useState<File | null>(null)
  const [creditHistory, setCreditHistory] = useState<CreditHistoryEntry[]>([])
  const [commitment, setCommitment] = useState(false)
  const [formData, setFormData] = useState({
    // Nhóm 1: Thông tin cá nhân
    fullName: "",
    gender: "",
    idNumber: "",
    maritalStatus: "",
    dependents: "",
    education: "",
    permanentAddress: "",
    temporaryAddress: "",

    // Nhóm 2: Thông tin nghề nghiệp & thu nhập
    currentJob: "",
    companyName: "",
    companyType: "",
    businessField: "",
    workDuration: "",
    monthlyIncome: "",
    salaryMethod: "",

    // Nhóm 3: Thông tin tài sản & đảm bảo
    houseOwnership: "",
    carOwnership: "",
    savingsAccount: "",
    lifeInsurance: "",
    investments: "",

    // Nhóm 5: Thông tin liên hệ
    phoneNumber: "",
    email: "",
    facebook: "",
  })
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const userType = localStorage.getItem("userType")

    if (!isLoggedIn || userType !== "guest") {
      router.push("/login")
      return
    }

    setLoading(false)
  }, [router])

  // Function to create form data for API
  const createFormDataForAPI = () => {
    const formDataToSend = new FormData()
    
    // 🔹 Nhóm 1: Thông tin cá nhân
    formDataToSend.append("FullName", formData.fullName || "")
    if (birthDate) {
      formDataToSend.append("DateOfBirth", format(birthDate, "yyyy-MM-dd"))
    }
    formDataToSend.append("Gender", formData.gender || "")
    formDataToSend.append("IdentityNumber", formData.idNumber || "")
    formDataToSend.append("MaritalStatus", formData.maritalStatus || "")
    formDataToSend.append("NumberOfDependents", (parseInt(formData.dependents) || 0).toString())
    formDataToSend.append("EducationLevel", formData.education || "")
    formDataToSend.append("Address", formData.permanentAddress || "")
    
    // 🔹 Nhóm 2: Nghề nghiệp & thu nhập
    formDataToSend.append("Occupation", formData.currentJob || "")
    formDataToSend.append("CompanyName", formData.companyName || "")
    formDataToSend.append("CompanyType", formData.companyType || "")
    formDataToSend.append("YearsAtCurrentJob", (parseInt(formData.workDuration.replace(/\D/g, '')) || 0).toString())
    formDataToSend.append("MonthlyIncome", (parseFloat(formData.monthlyIncome.replace(/[,\s]/g, '')) || 0).toString())
    formDataToSend.append("SalaryPaymentMethod", formData.salaryMethod || "")
    
    // Upload file ảnh
    if (salarySlip) {
      formDataToSend.append("SalarySlipImage", salarySlip)
    }
    if (utilityBills) {
      formDataToSend.append("UtilityBillImage", utilityBills)
    }
    
    // 🔹 Nhóm 4: Tài sản & đảm bảo
    formDataToSend.append("OwnHouseOrLand", (formData.houseOwnership === "co").toString())
    formDataToSend.append("OwnCarOrValuableVehicle", (formData.carOwnership && formData.carOwnership.length > 0).toString())
    formDataToSend.append("HasSavingsAccount", (formData.savingsAccount && formData.savingsAccount.length > 0).toString())
    formDataToSend.append("LifeInsuranceValue", (parseFloat(formData.lifeInsurance.replace(/[,\s]/g, '')) || 0).toString())
    formDataToSend.append("Investments", formData.investments || "")
    
    // 🔹 Nhóm 5: Lịch sử tín dụng
    formDataToSend.append("HadPreviousLoans", (creditHistory.length > 0).toString())
    if (creditHistory.length > 0) {
      const latestLoan = creditHistory[0] // Lấy khoản vay đầu tiên
      formDataToSend.append("LoanInstitution", latestLoan.organization || "")
      formDataToSend.append("LoanLimit", (parseFloat(latestLoan.creditLimit.replace(/[,\s]/g, '')) || 0).toString())
      formDataToSend.append("CurrentOutstandingDebt", (parseFloat(latestLoan.currentDebt.replace(/[,\s]/g, '')) || 0).toString())
      formDataToSend.append("LoanTerm", latestLoan.term || "")
    } else {
      formDataToSend.append("LoanInstitution", "")
      formDataToSend.append("LoanLimit", "0")
      formDataToSend.append("CurrentOutstandingDebt", "0")
      formDataToSend.append("LoanTerm", "")
    }
    
    // 🔹 Nhóm 6: Liên hệ
    formDataToSend.append("PhoneNumber", formData.phoneNumber || "")
    formDataToSend.append("Email", formData.email || "")
    formDataToSend.append("Facebook", formData.facebook || "")
    
    return formDataToSend
  }

  // Function to upload files after survey creation
  const uploadFiles = async (surveyId: string) => {
    const uploadPromises = []
    
    if (salarySlip) {
      const salaryFormData = new FormData()
      salaryFormData.append("file", salarySlip)
      
      uploadPromises.push(
        fetch(`${API_BASE_URL}/survey/${surveyId}/upload-salary`, {
          method: 'POST',
          body: salaryFormData,
          mode: 'cors',
        })
      )
    }
    
    if (utilityBills) {
      const utilityFormData = new FormData()
      utilityFormData.append("file", utilityBills)
      
      uploadPromises.push(
        fetch(`${API_BASE_URL}/survey/${surveyId}/upload-utility`, {
          method: 'POST',
          body: utilityFormData,
          mode: 'cors',
        })
      )
    }
    
    if (uploadPromises.length > 0) {
      try {
        await Promise.all(uploadPromises)
        console.log("Files uploaded successfully")
      } catch (error) {
        console.error("Error uploading files:", error)
        // Don't throw error here as the main form was already submitted
        alert("Hồ sơ đã được gửi thành công nhưng có lỗi khi tải file. Bạn có thể liên hệ để gửi lại file.")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!commitment) {
      alert("Vui lòng xác nhận cam kết trước khi gửi hồ sơ!")
      return
    }

    setSubmitting(true)

    try {
      // Create the survey
      const formDataToSend = createFormDataForAPI()
      
      console.log("Sending data to:", `${API_BASE_URL}/survey`)
      
      const response = await fetch(`${API_BASE_URL}/survey`, {
        method: 'POST',
        body: formDataToSend,
        // Remove mode: 'cors' and let browser handle it naturally
      })

      console.log("Response status:", response.status)
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`
        try {
          const errorText = await response.text()
          errorMessage += `: ${errorText}`
        } catch (e) {
          // If can't read response text
        }
        throw new Error(errorMessage)
      }

      const createdSurvey = await response.json()
      console.log("Survey created:", createdSurvey)

      alert("Cảm ơn bạn đã gửi hồ sơ vay vốn! Chúng tôi sẽ xem xét và liên hệ sớm nhất.")
      
      // Reset form after successful submission
      setFormData({
        fullName: "",
        gender: "",
        idNumber: "",
        maritalStatus: "",
        dependents: "",
        education: "",
        permanentAddress: "",
        temporaryAddress: "",
        currentJob: "",
        companyName: "",
        companyType: "",
        businessField: "",
        workDuration: "",
        monthlyIncome: "",
        salaryMethod: "",
        houseOwnership: "",
        carOwnership: "",
        savingsAccount: "",
        lifeInsurance: "",
        investments: "",
        phoneNumber: "",
        email: "",
        facebook: "",
      })
      setBirthDate(undefined)
      setSalarySlip(null)
      setUtilityBills(null)
      setCreditHistory([])
      setCommitment(false)
      
    } catch (error) {
      console.error("Error submitting form:", error)
      
      // More specific error handling
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const errorName = error instanceof Error ? error.name : 'Error'
      
      if (errorMessage.includes('400')) {
        alert("Dữ liệu gửi lên không hợp lệ. Vui lòng kiểm tra lại thông tin và thử lại.")
      } else if (errorMessage.includes('CORS') || errorMessage.includes('cross-origin')) {
        alert("Lỗi CORS. Server chưa được cấu hình để nhận request từ trang web này.")
      } else if (errorName === 'TypeError' && errorMessage.includes('fetch')) {
        alert("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.")
      } else {
        alert(`Có lỗi xảy ra: ${errorMessage}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userType")
    router.push("/login")
  }

  const addCreditHistoryEntry = () => {
    setCreditHistory([...creditHistory, { organization: "", creditLimit: "", currentDebt: "", term: "" }])
  }

  const removeCreditHistoryEntry = (index: number) => {
    setCreditHistory(creditHistory.filter((_, i) => i !== index))
  }

  const updateCreditHistoryEntry = (index: number, field: keyof CreditHistoryEntry, value: string) => {
    const updated = creditHistory.map((entry, i) => (i === index ? { ...entry, [field]: value } : entry))
    setCreditHistory(updated)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File quá lớn. Vui lòng chọn file dưới 5MB.")
        return
      }
      setSalarySlip(file)
    }
  }

  const handleUtilityBillsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File quá lớn. Vui lòng chọn file dưới 5MB.")
        return
      }
      setUtilityBills(file)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Đang tải form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CreditNova</h1>
              <p className="text-sm text-gray-600">Hồ sơ đăng ký vay vốn</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            Đăng xuất
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Nhóm 1: Thông tin cá nhân */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-orange-600">Nhóm 1: Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên *</Label>
                  <Input
                    id="fullName"
                    placeholder="Nhập họ và tên đầy đủ"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ngày sinh *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {birthDate ? format(birthDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày sinh"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={birthDate} onSelect={setBirthDate} initialFocus locale={vi} />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Giới tính *</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nam">Nam</SelectItem>
                      <SelectItem value="nu">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idNumber">Số CMND/CCCD/Hộ chiếu *</Label>
                  <Input
                    id="idNumber"
                    placeholder="Nhập số giấy tờ tùy thân"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tình trạng hôn nhân *</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tình trạng hôn nhân" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doc-than">Độc thân</SelectItem>
                      <SelectItem value="ket-hon">Kết hôn</SelectItem>
                      <SelectItem value="ly-hon">Ly hôn</SelectItem>
                      <SelectItem value="goa">Góa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dependents">Số người phụ thuộc</Label>
                  <Input
                    id="dependents"
                    type="number"
                    placeholder="Nhập số người phụ thuộc"
                    value={formData.dependents}
                    onChange={(e) => setFormData({ ...formData, dependents: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2 lg:col-span-1">
                  <Label>Trình độ học vấn *</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, education: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trình độ học vấn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tren-dai-hoc">Trên đại học</SelectItem>
                      <SelectItem value="dai-hoc">Đại học</SelectItem>
                      <SelectItem value="cao-dang">Cao đẳng/tương đương</SelectItem>
                      <SelectItem value="trung-cap">Trung cấp/tương đương</SelectItem>
                      <SelectItem value="duoi-trung-cap">Dưới trung cấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="permanentAddress">Địa chỉ thường trú *</Label>
                  <Textarea
                    id="permanentAddress"
                    placeholder="Nhập địa chỉ thường trú"
                    value={formData.permanentAddress}
                    onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temporaryAddress">Địa chỉ tạm trú</Label>
                  <Textarea
                    id="temporaryAddress"
                    placeholder="Nhập địa chỉ tạm trú (nếu khác địa chỉ thường trú)"
                    value={formData.temporaryAddress}
                    onChange={(e) => setFormData({ ...formData, temporaryAddress: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nhóm 2: Thông tin nghề nghiệp & thu nhập */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-orange-600">Nhóm 2: Thông tin nghề nghiệp & thu nhập</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentJob">Nghề nghiệp hiện tại *</Label>
                  <Input
                    id="currentJob"
                    placeholder="VD: Kỹ sư phần mềm"
                    value={formData.currentJob}
                    onChange={(e) => setFormData({ ...formData, currentJob: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Tên công ty/tổ chức làm việc *</Label>
                  <Input
                    id="companyName"
                    placeholder="VD: Công ty TNHH ABC"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Loại hình công ty *</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, companyType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại hình công ty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nha-nuoc">Nhà nước</SelectItem>
                      <SelectItem value="tu-nhan">Tư nhân</SelectItem>
                      <SelectItem value="nuoc-ngoai">Nước ngoài</SelectItem>
                      <SelectItem value="tu-kinh-doanh">Tự kinh doanh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessField">Lĩnh vực kinh doanh *</Label>
                  <Input
                    id="businessField"
                    placeholder="VD: Công nghệ thông tin"
                    value={formData.businessField}
                    onChange={(e) => setFormData({ ...formData, businessField: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workDuration">Thời gian làm việc tại đơn vị hiện tại *</Label>
                  <Input
                    id="workDuration"
                    placeholder="VD: 2 năm 6 tháng"
                    value={formData.workDuration}
                    onChange={(e) => setFormData({ ...formData, workDuration: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome">Thu nhập hàng tháng (VND) *</Label>
                  <Input
                    id="monthlyIncome"
                    placeholder="VD: 20,000,000"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utilityBills">Hóa đơn điện, nước (hình ảnh) *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="utilityBills"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleUtilityBillsUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("utilityBills")?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {utilityBills ? utilityBills.name : "Tải lên hóa đơn điện, nước"}
                    </Button>
                    {utilityBills && <span className="text-sm text-green-600">✓ Đã tải lên</span>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Hình thức nhận lương *</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, salaryMethod: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn hình thức nhận lương" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tien-mat">Tiền mặt</SelectItem>
                      <SelectItem value="chuyen-khoan">Chuyển khoản</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="salarySlip">Bảng lương (hình ảnh) *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="salarySlip"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("salarySlip")?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {salarySlip ? salarySlip.name : "Tải lên bảng lương"}
                    </Button>
                    {salarySlip && <span className="text-sm text-green-600">✓ Đã tải lên</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nhóm 3: Thông tin tài sản & đảm bảo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-orange-600">Nhóm 3: Thông tin tài sản & đảm bảo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Sở hữu nhà/đất</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, houseOwnership: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tình trạng sở hữu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="co">Có</SelectItem>
                      <SelectItem value="khong">Không</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carOwnership">Sở hữu ô tô/xe giá trị lớn</Label>
                  <Input
                    id="carOwnership"
                    placeholder="VD: Honda City 2020"
                    value={formData.carOwnership}
                    onChange={(e) => setFormData({ ...formData, carOwnership: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="savingsAccount">Tài khoản tiết kiệm (VND)</Label>
                  <Input
                    id="savingsAccount"
                    placeholder="VD: 50,000,000"
                    value={formData.savingsAccount}
                    onChange={(e) => setFormData({ ...formData, savingsAccount: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lifeInsurance">Giá trị Bảo hiểm nhân thọ (VND)</Label>
                  <Input
                    id="lifeInsurance"
                    placeholder="VD: 100,000,000"
                    value={formData.lifeInsurance}
                    onChange={(e) => setFormData({ ...formData, lifeInsurance: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="investments">Cổ phiếu/trái phiếu/đầu tư khác</Label>
                  <Input
                    id="investments"
                    placeholder="VD: Cổ phiếu VCB, trái phiếu chính phủ"
                    value={formData.investments}
                    onChange={(e) => setFormData({ ...formData, investments: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nhóm 4: Lịch sử tín dụng */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-orange-600">Nhóm 4: Lịch sử tín dụng</CardTitle>
              <p className="text-sm text-gray-600">Đã từng vay vốn trước đây chưa?</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Thông tin các khoản vay trước đây</h4>
                <Button
                  type="button"
                  onClick={addCreditHistoryEntry}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Plus className="w-4 h-4" />
                  Thêm khoản vay
                </Button>
              </div>

              {creditHistory.length > 0 && (
                <div className="space-y-4">
                  {creditHistory.map((entry, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h5 className="font-medium">Khoản vay #{index + 1}</h5>
                        <Button
                          type="button"
                          onClick={() => removeCreditHistoryEntry(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>Tên tổ chức vay</Label>
                          <Input
                            placeholder="VD: Ngân hàng ABC"
                            value={entry.organization}
                            onChange={(e) => updateCreditHistoryEntry(index, "organization", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Hạn mức vay (VND)</Label>
                          <Input
                            placeholder="VD: 100,000,000"
                            value={entry.creditLimit}
                            onChange={(e) => updateCreditHistoryEntry(index, "creditLimit", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Dư nợ hiện tại (VND)</Label>
                          <Input
                            placeholder="VD: 50,000,000"
                            value={entry.currentDebt}
                            onChange={(e) => updateCreditHistoryEntry(index, "currentDebt", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Thời hạn</Label>
                          <Input
                            placeholder="VD: 5 năm"
                            value={entry.term}
                            onChange={(e) => updateCreditHistoryEntry(index, "term", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {creditHistory.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Chưa có thông tin khoản vay nào. Nhấn "Thêm khoản vay" nếu bạn đã từng vay trước đây.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Nhóm 5: Thông tin liên hệ */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-orange-600">Nhóm 5: Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Số điện thoại chính *</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="0123456789"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook">Mạng xã hội (Facebook)</Label>
                  <Input
                    id="facebook"
                    placeholder="https://facebook.com/username"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nhóm 6: CAM KẾT */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-orange-600">Nhóm 6: CAM KẾT CỦA NGƯỜI ĐỀ NGHỊ VAY VỐN</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Tôi cam kết rằng tất cả thông tin đã cung cấp trong hồ sơ này là chính xác và trung thực. Tôi hiểu
                    rằng việc cung cấp thông tin sai lệch có thể dẫn đến việc từ chối hồ sơ vay vốn và chịu trách nhiệm
                    pháp lý theo quy định. Tôi đồng ý cho phép CreditNova xác minh thông tin và sử dụng dữ liệu cá nhân
                    để xử lý hồ sơ vay vốn.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="commitment"
                    checked={commitment}
                    onCheckedChange={(checked) => setCommitment(checked as boolean)}
                  />
                  <Label htmlFor="commitment" className="text-sm font-medium">
                    Tôi cam kết và đồng ý với các điều khoản trên *
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pb-8">
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
              disabled={!commitment || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Gửi hồ sơ vay vốn
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}