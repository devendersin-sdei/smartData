using System.ComponentModel.DataAnnotations;

namespace MicroservicesArchitecture.Application.Dtos.Students
{
    /// <summary>
    /// Update student request model.
    /// </summary>
    public class UpdateStudentRequest
    {
        /// <summary>
        /// Name of the student.
        /// </summary>
        [Required]
        public string Name { get; set; }
    }
}
