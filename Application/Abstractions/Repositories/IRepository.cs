using MicroservicesArchitecture.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MicroservicesArchitecture.Application.Abstractions.Repositories
{
    public interface IRepository<TEntity> where TEntity : BaseEntity
    {
        /// <summary>
        /// Get specific record by <paramref name="id"/>. 
        /// </summary>
        /// <param name="id">Record id.</param>
        /// <returns></returns>
        Task<TEntity> GetByIdAsync(int id);

        /// <summary>
        /// Get all records.
        /// </summary>
        /// <returns></returns>
        Task<IList<TEntity>> GetAllAsync();

        /// <summary>
        /// Create record.
        /// </summary>
        /// <param name="model">Record that need to create.</param>
        /// <returns>Newly created record.</returns>
        Task<TEntity> CreateAsync(TEntity model);

        /// <summary>
        /// Update existing record.
        /// </summary>
        /// <param name="id">Id of the record that need to update.</param>
        /// <param name="model">Record that need to update.</param>
        /// <returns>Updated record.</returns>
        Task<TEntity> UpdateAsync(int id, TEntity model);

        /// <summary>
        /// Delete specific record.
        /// </summary>
        /// <param name="id">Record id.</param>
        Task DeleteAsync(int id);

        /// <summary>
        /// Check if record exist or not.
        /// </summary>
        /// <param name="id">Record id.</param>
        /// <returns><c>true</c> if record exist, else <c>false</c>.</returns>
        Task<bool> ExistAsync(int id);
    }
}
