using System.Threading.Tasks;

namespace MicroservicesArchitecture.EventBus.Abstractions
{
    public interface IDynamicIntegrationEventHandler
    {
        Task Handle(dynamic eventData);
    }
}
