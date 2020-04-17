using MicroservicesArchitecture.Application.Abstractions.Repositories;
using MicroservicesArchitecture.Domain.Entities.Students;
using MicroservicesArchitecture.Infrastructure.Implementations.Context;

namespace MicroservicesArchitecture.Infrastructure.Implementations.Repositories.Students
{
    internal class StudentRepository : BaseRepository<Student>, IStudentRepository
    {
        public StudentRepository(DBContext dbContext)
            : base(dbContext)
        {
        }
    }
}
