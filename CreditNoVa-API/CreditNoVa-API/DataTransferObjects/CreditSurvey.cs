namespace CreditNoVa_API.DataTransferObjects
{
    public class CreditSurvey
    {
        // 🔹 Các field thông tin
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string IdentityNumber { get; set; }
        public string MaritalStatus { get; set; }
        public int NumberOfDependents { get; set; }
        public string EducationLevel { get; set; }
        public string Address { get; set; }
        public string Occupation { get; set; }
        public string CompanyName { get; set; }
        public string CompanyType { get; set; }
        public int YearsAtCurrentJob { get; set; }
        public decimal MonthlyIncome { get; set; }
        public string SalaryPaymentMethod { get; set; }

        // 🔹 File upload
        public IFormFile SalarySlipImage { get; set; }
        public IFormFile UtilityBillImage { get; set; }

        // 🔹 Liên hệ
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Facebook { get; set; }
    }
}
