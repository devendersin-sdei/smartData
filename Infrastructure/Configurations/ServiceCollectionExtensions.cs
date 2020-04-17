using MicroservicesArchitecture.Application.Abstractions.Repositories;
using MicroservicesArchitecture.Application.Abstractions.Services.Students;
using MicroservicesArchitecture.Infrastructure.Implementations.Context;
using MicroservicesArchitecture.Infrastructure.Implementations.Repositories.Students;
using MicroservicesArchitecture.Infrastructure.Implementations.Services.Students;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<DBContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            return services;
        }

        public static IServiceCollection RegisterServices(this IServiceCollection services)
        {
            services.AddScoped<IStudentRepository, StudentRepository>();
            services.AddScoped<IStudentService, StudentService>();

            return services;
        }
    }
}
