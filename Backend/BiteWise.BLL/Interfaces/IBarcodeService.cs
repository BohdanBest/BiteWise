using System.Threading.Tasks;
using BiteWise.BLL.DTOs.Scan;

namespace BiteWise.BLL.Interfaces
{
    public interface IBarcodeService
    {
        Task<ScanResultDto?> GetProductByBarcodeAsync(string barcode);
    }
}
