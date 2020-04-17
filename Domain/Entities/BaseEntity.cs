using System;

namespace MicroservicesArchitecture.Domain.Entities
{
    public abstract class BaseEntity
    {
        public virtual int Id { get; set; }
        public virtual DateTime CreatedDate { get; set; }
        public virtual string CreatedBy { get; set; }
        public virtual DateTime ModifiedDate { get; set; }
        public virtual string ModifiedBy { get; set; }
    }
}
