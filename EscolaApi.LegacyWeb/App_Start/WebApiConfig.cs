using System.Web.Http;
using Newtonsoft.Json.Serialization;

namespace EscolaApi.LegacyWeb
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Habilita Roteamento por atributos
            config.MapHttpAttributeRoutes();

            // Ativa o detalhamento de erro por CLI
            config.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Always;

            // Obtém o formatador padrão baseado em Newtonsoft
            var jsonFormatter = config.Formatters.JsonFormatter;

            // Configurar o Newtonsoft para serializar em camelCase
            if (jsonFormatter != null)
            {
                jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

                // Remove suporte a XML
                config.Formatters.Remove(config.Formatters.XmlFormatter);
                jsonFormatter.SerializerSettings.Formatting = Newtonsoft.Json.Formatting.Indented;
            }

            // Rota padrão fallback
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
