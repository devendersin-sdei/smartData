using MicroservicesArchitecture.Application.Dtos.Students;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MicroservicesArchitecture.Application.Abstractions.Services.Students
{
    public interface IStudentService
    {
        /// <summary>
        /// Create student.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<StudentResponse> CreateAsync(CreateStudentRequest model);
        Task<StudentResponse> UpdateAsync(int id, UpdateStudentRequest model);
        Task<IList<StudentResponse>> GetAllAsync();
        Task<StudentResponse> GetByIdAsync(int id);
        Task DeleteAsync(int id);
    }
}
