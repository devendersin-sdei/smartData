using System.ComponentModel.DataAnnotations;

namespace MicroservicesArchitecture.Application.Dtos.Students
{
    /// <summary>
    /// Create student request model.
    /// </summary>
    public class CreateStudentRequest
    {
        /// <summary>
        /// Name of the student.
        /// </summary>
        [Required]
        public string Name { get; set; }
    }
}
