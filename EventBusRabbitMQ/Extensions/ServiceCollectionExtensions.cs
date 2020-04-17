using Autofac;
using MicroservicesArchitecture.EventBus;
using MicroservicesArchitecture.EventBus.Abstractions;
using MicroservicesArchitecture.EventBusRabbitMQ;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using System;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddEventBusRabbitMQ(this IServiceCollection services, IConfiguration configuration)
        {
            if (!Convert.ToBoolean(configuration["AzureServiceBusEnabled"]))
            {
                var rabbitMQConfig = configuration.GetSection("RabbitMQ");
                var subscriptionClientName = configuration["SubscriptionClientName"];

                services.AddSingleton<IRabbitMQPersistentConnection>(sp =>
                {
                    var logger = sp.GetRequiredService<ILogger<DefaultRabbitMQPersistentConnection>>();

                    var factory = new ConnectionFactory()
                    {
                        HostName = rabbitMQConfig["HostName"],
                        DispatchConsumersAsync = true
                    };

                    if (!string.IsNullOrEmpty(rabbitMQConfig["UserName"]))
                    {
                        factory.UserName = rabbitMQConfig["UserName"];
                    }

                    if (!string.IsNullOrEmpty(rabbitMQConfig["Password"]))
                    {
                        factory.Password = rabbitMQConfig["Password"];
                    }

                    var retryCount = 5;
                    if (!string.IsNullOrEmpty(configuration["EventBusRetryCount"]))
                    {
                        retryCount = int.Parse(configuration["EventBusRetryCount"]);
                    }

                    return new DefaultRabbitMQPersistentConnection(factory, logger, retryCount);
                });

                services.AddSingleton<IEventBus, EventBusRabbitMQ>(sp =>
                {
                    var rabbitMQPersistentConnection = sp.GetRequiredService<IRabbitMQPersistentConnection>();
                    var iLifetimeScope = sp.GetRequiredService<ILifetimeScope>();
                    var logger = sp.GetRequiredService<ILogger<EventBusRabbitMQ>>();
                    var eventBusSubcriptionsManager = sp.GetRequiredService<IEventBusSubscriptionsManager>();

                    var retryCount = 5;
                    if (!string.IsNullOrEmpty(configuration["EventBusRetryCount"]))
                    {
                        retryCount = int.Parse(configuration["EventBusRetryCount"]);
                    }

                    return new EventBusRabbitMQ(rabbitMQPersistentConnection, logger, iLifetimeScope, eventBusSubcriptionsManager, subscriptionClientName, retryCount);
                });
            }

            return services;
        }
    }
}
