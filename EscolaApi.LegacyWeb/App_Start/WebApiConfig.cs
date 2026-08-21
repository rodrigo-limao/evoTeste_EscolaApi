using System.Web.Http;

namespace EscolaApi.LegacyWeb
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Habilita Roteamento por atributos
            config.MapHttpAttributeRoutes();

            // Rota padrão fallback
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
