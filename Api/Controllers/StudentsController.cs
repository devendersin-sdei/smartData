using MicroservicesArchitecture.Application.Abstractions.Services.Students;
using MicroservicesArchitecture.Application.Dtos.Students;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentService _service;
        public StudentsController(IStudentService service)
        {
            _service = service;
        }

        /// <summary>
        /// Gets all students.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET api/students
        ///
        /// </remarks> 
        /// <returns>All records.</returns>
        /// <response code="200">Returns all the students.</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IList<StudentResponse>))]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        /// <summary>
        /// Gets specific student.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET api/students/1
        ///
        /// </remarks>
        /// <param name="id">Student id.</param>
        /// <returns>Returns the specific student.</returns>
        /// <response code="200">Returns the specific student.</response>
        /// <response code="404">If the student is not found.</response>      
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(StudentResponse))]
        public async Task<IActionResult> Get([FromRoute]int id)
        {
            var model = await _service.GetByIdAsync(id);
            if (model == null)
            {
                return NotFound();
            }

            return Ok(model);
        }

        /// <summary>
        /// Creates a student.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST api/students
        ///     {
        ///        "name": "Student 1",
        ///     }
        ///
        /// </remarks> 
        /// <param name="model"></param>
        /// <returns>A newly created student.</returns>
        /// <response code="201">Returns the newly created student.</response>
        /// <response code="400">If the student is invalid.</response>        
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> Post([FromBody] CreateStudentRequest model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdModel = await _service.CreateAsync(model);
            return CreatedAtAction(nameof(Get), new { createdModel.Id }, createdModel);
        }

        /// <summary>
        /// Updates an existing student.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     PUT api/students/1
        ///     {
        ///        "name": "Student 1",
        ///     }
        ///
        /// </remarks>
        /// <param name="id">Student id.</param>
        /// <param name="model"></param>
        /// <returns>Updated student.</returns>
        /// <response code="200">Returns the updated student.</response>
        /// <response code="400">If the student is invalid.</response>
        /// <response code="404">If the student is not found.</response>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Put([FromRoute]int id, [FromBody] UpdateStudentRequest model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedModel = await _service.UpdateAsync(id, model);
            if (updatedModel == null)
            {
                return NotFound();
            }

            return Ok(updatedModel);
        }


        /// <summary>
        /// Deletes a specific student.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     DELETE api/students/1
        ///
        /// </remarks>
        /// <param name="id">Student id.</param>
        /// <response code="204">Student deleted.</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Delete([FromRoute]int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }

    }
}