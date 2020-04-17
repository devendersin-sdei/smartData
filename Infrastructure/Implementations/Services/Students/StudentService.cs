using MicroservicesArchitecture.Application.Abstractions.Repositories;
using MicroservicesArchitecture.Application.Abstractions.Services.Students;
using MicroservicesArchitecture.Application.Dtos.Students;
using MicroservicesArchitecture.Domain.Entities.Students;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MicroservicesArchitecture.Infrastructure.Implementations.Services.Students
{
    internal class StudentService : IStudentService
    {
        private readonly IStudentRepository _repository;

        public StudentService(IStudentRepository repository)
        {
            _repository = repository;
        }

        /// <inheritdoc/>
        public async Task<StudentResponse> CreateAsync(CreateStudentRequest model)
        {
            var now = DateTime.Now;

            var createdModel = new Student
            {
                Name = model.Name,
                CreatedBy = "",
                CreatedDate = now,
                ModifiedBy = "",
                ModifiedDate = now
            };

            createdModel = await _repository.CreateAsync(createdModel);
            return PrepareStudentResponse(createdModel);
        }

        /// <inheritdoc/>
        public async Task<IList<StudentResponse>> GetAllAsync()
        {
            var response = new List<StudentResponse>();

            var models = await _repository.GetAllAsync();
            foreach (var model in models)
            {
                response.Add(PrepareStudentResponse(model));
            }
            return response;
        }

        /// <inheritdoc/>
        public async Task<StudentResponse> GetByIdAsync(int id)
        {
            var model = await _repository.GetByIdAsync(id);
            if (model == null)
            {
                return null;
            }
            return PrepareStudentResponse(model);
        }

        /// <inheritdoc/>
        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

        /// <inheritdoc/>
        public async Task<StudentResponse> UpdateAsync(int id, UpdateStudentRequest model)
        {
            var existingModel = await _repository.GetByIdAsync(id);
            if (existingModel == null)
            {
                return null;
            }

            existingModel.Name = model.Name;
            existingModel.ModifiedDate = DateTime.Now;
            existingModel = await _repository.UpdateAsync(existingModel.Id, existingModel);
            return PrepareStudentResponse(existingModel);
        }

        /// <inheritdoc/>
        public async Task<bool> ExistAsync(int id)
        {
            return await _repository.ExistAsync(id);
        }

        private StudentResponse PrepareStudentResponse(Student model)
        {
            return new StudentResponse
            {
                Id = model.Id,
                Name = model.Name,
                CreatedBy = model.CreatedBy,
                CreatedDate = model.CreatedDate,
                ModifiedBy = model.ModifiedBy,
                ModifiedDate = model.ModifiedDate
            };
        }
    }
}
