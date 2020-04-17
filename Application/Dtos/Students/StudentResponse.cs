using System;

namespace MicroservicesArchitecture.Application.Dtos.Students
{
    /// <summary>
    /// Response model for student entity.
    /// </summary>
    public class StudentResponse
    {
        /// <summary>
        /// Student id.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Name of the student.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Create date.
        /// </summary>
        public DateTime CreatedDate { get; set; }

        /// <summary>
        /// Created by.
        /// </summary>
        public string CreatedBy { get; set; }

        /// <summary>
        /// Modified date.
        /// </summary>
        public DateTime ModifiedDate { get; set; }

        /// <summary>
        /// Modified by.
        /// </summary>
        public string ModifiedBy { get; set; }
    }
}