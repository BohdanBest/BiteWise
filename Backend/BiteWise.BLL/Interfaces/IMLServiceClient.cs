using System.IO;
using System.Threading.Tasks;
using BiteWise.BLL.DTOs.Scan;

namespace BiteWise.BLL.Interfaces
{
    public interface IMLServiceClient
    {
        Task<MLRecognitionResult> RecognizeImageAsync(Stream imageStream, string fileName, string contentType);
    }
}
