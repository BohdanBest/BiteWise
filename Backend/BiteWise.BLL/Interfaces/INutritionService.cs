using System.Threading.Tasks;
using BiteWise.BLL.DTOs.Scan;

namespace BiteWise.BLL.Interfaces
{
    public interface INutritionService
    {
        Task<NutritionInfo> GetNutritionInfoAsync(string foodName);
    }
}
