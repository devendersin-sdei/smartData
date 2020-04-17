using MicroservicesArchitecture.Application.Abstractions.Repositories;
using MicroservicesArchitecture.Domain.Entities;
using MicroservicesArchitecture.Infrastructure.Implementations.Context;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MicroservicesArchitecture.Infrastructure.Implementations.Repositories
{
    internal class BaseRepository<TEntity> : IRepository<TEntity> where TEntity : BaseEntity
    {
        private readonly DBContext _dbContext;
        protected BaseRepository(DBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public virtual async Task<TEntity> CreateAsync(TEntity model)
        {
            await _dbContext.AddAsync<TEntity>(model);
            await _dbContext.SaveChangesAsync();

            return model;
        }

        public virtual async Task DeleteAsync(int id)
        {
            var model = await _dbContext.FindAsync<TEntity>(id);
            if (model != null)
            {
                _dbContext.Remove(model);
                await _dbContext.SaveChangesAsync();
            }
        }

        public virtual async Task<IList<TEntity>> GetAllAsync()
        {
            return await _dbContext.Set<TEntity>().AsNoTracking().ToListAsync();
        }

        public virtual async Task<TEntity> GetByIdAsync(int id)
        {
            return await _dbContext.FindAsync<TEntity>(id);
        }

        public virtual async Task<TEntity> UpdateAsync(int id, TEntity model)
        {
            if (!await ExistAsync(id))
            {
                return null;
            }

            model.Id = id;
            _dbContext.Set<TEntity>().Update(model);
            await _dbContext.SaveChangesAsync();

            return model;
        }

        public virtual async Task<bool> ExistAsync(int id)
        {
            return await _dbContext.Set<TEntity>().AsNoTracking().AnyAsync(x => x.Id == id);
        }
    }
}
