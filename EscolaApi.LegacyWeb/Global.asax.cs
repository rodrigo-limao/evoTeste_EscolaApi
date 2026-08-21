using System;
using System.Web;
using System.Web.Http;
using EscolaApi.LegacyWeb;
using EscolaApi.LegacyWeb.Infrastructure;

namespace EscolApi.LegacyWeb
{
    public class WepApiApplication : HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);

            // Define a nossa Dependency Injection
            GlobalConfiguration.Configuration.DependencyResolver = 
                new CustomDependencyResolver();
        }
    }
}
