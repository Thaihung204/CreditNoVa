using CreditNoVa_API.WebApp.Models;
using CreditNoVa_API.WebApp.Services.Interfaces;
using CreditNoVa_API.WebApp.Models;

namespace CreditNoVa_API.WebApp.Services.Services
{
    public class BaseService
    {
        public readonly IRepository Repo;

        public BaseService(IRepository repo)
        {
            this.Repo = repo;
        }
    }
}