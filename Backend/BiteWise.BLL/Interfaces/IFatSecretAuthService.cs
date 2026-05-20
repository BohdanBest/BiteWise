using System.Threading.Tasks;

namespace BiteWise.BLL.Interfaces
{
    public interface IFatSecretAuthService
    {
        Task<string> GetAccessTokenAsync();
    }
}
