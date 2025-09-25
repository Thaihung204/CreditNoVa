using System.Text;
using Azure;
using CreditNoVa_API.Models;
using CreditNoVa_API.Services.Interfaces;
using CreditNoVa_API.WebApp.Models;
using CreditNoVa_API.WebApp.Services.Interfaces;
using CreditNoVa_API.WebApp.Services.Services;
using Microsoft.EntityFrameworkCore;

namespace CreditNoVa_API.Services
{
    public class CreditSurveyService : BaseService,  ICreditSurveyService
    {
        public CreditSurveyService(IRepository repo) : base(repo)
        {
        }
   
        public async Task<IEnumerable<CreditSurvey>> GetAllAsync()
        {
            return await Repo.GetAllAsync<CreditSurvey>();
        }

        public async Task<CreditSurvey?> GetByIdAsync(Guid id)
        {
            return await Repo.GetByIdAsync<CreditSurvey>(id);
        }

        public async Task<CreditSurvey> CreateAsync(CreditNoVa_API.DataTransferObjects.CreditSurvey dto)
        {
            var survey = new CreditSurvey
            {
                Id = Guid.NewGuid(),
                FullName = dto.FullName,
                DateOfBirth = dto.DateOfBirth,
                Gender = dto.Gender,
                IdentityNumber = dto.IdentityNumber,
                MaritalStatus = dto.MaritalStatus,
                NumberOfDependents = dto.NumberOfDependents,
                EducationLevel = dto.EducationLevel,
                Address = dto.Address,
                Occupation = dto.Occupation,
                CompanyName = dto.CompanyName,
                CompanyType = dto.CompanyType,
                YearsAtCurrentJob = dto.YearsAtCurrentJob,
                MonthlyIncome = dto.MonthlyIncome,
                SalaryPaymentMethod = dto.SalaryPaymentMethod,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                Facebook = dto.Facebook
            };

            // Lưu file vào DB dưới dạng byte[]
            if (dto.SalarySlipImage != null)
            {
                using var ms = new MemoryStream();
                await dto.SalarySlipImage.CopyToAsync(ms);
                survey.SalarySlipImage = ms.ToArray();
            }

            if (dto.UtilityBillImage != null)
            {
                using var ms = new MemoryStream();
                await dto.UtilityBillImage.CopyToAsync(ms);
                survey.UtilityBillImage = ms.ToArray();
            }

            survey.CreditScore = CalculateCreditScore(survey);

            await Repo.CreateAsync(survey);
            await Repo.SaveAsync();

            return survey;
        }

        public async Task<CreditSurvey?> UpdateAsync(Guid id, CreditSurvey survey)
        {
            var existing = await Repo.GetByIdAsync<CreditSurvey>(id);
            if (existing == null) return null;
            existing.SalarySlipImage = survey.SalarySlipImage;
            Repo.Update(existing);
            await Repo.SaveAsync();

            return existing;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await Repo.GetByIdAsync<CreditSurvey>(id);
            if (entity == null) return false;

            Repo.Delete(entity);
            await Repo.SaveAsync();

            return true;
        }

        private async Task<int> CalculateCreditScoreAndSendAsync(CreditSurvey survey)
        {
            string salarySlipBase64 = survey.SalarySlipImage != null ? Convert.ToBase64String(survey.SalarySlipImage) : null;
            string utilityBillBase64 = survey.UtilityBillImage != null ? Convert.ToBase64String(survey.UtilityBillImage) : null;

            using (var client = new HttpClient())
            {
                var payload = new
                {
                    image = salarySlipBase64
                };

                var json = System.Text.Json.JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await client.PostAsync("https://dattien2703.app.n8n.cloud/webhook-test/cc9772a0-c0f9-49c5-850f-3942beceb49a", content);
                response.EnsureSuccessStatusCode();
                string responseString = await response.Content.ReadAsStringAsync();

                if (int.TryParse(responseString, out int score))
                {
                    return score;
                }
            }

            throw new Exception("Response không phải kiểu int: ");
        }

        private int CalculateCreditScore(CreditSurvey survey)
        {
            int score = 500;

            if (survey.MonthlyIncome > 20000000) score += 100;
            if (survey.CurrentOutstandingDebt == 0) score += 50;
            if (survey.HadPreviousLoans &&
                string.Equals(survey.LoanTerm, "Đúng hạn", StringComparison.OrdinalIgnoreCase))
                score += 50;

            return Math.Min(score, 850); // max 850
        }
    }
}
