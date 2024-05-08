using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebControlPatrimonial
{
    public class AppConfig
    {

        public static string UriBase
        {
            get
            {
                return VirtualPathUtility.ToAbsolute("~/");
            }
        }
    }
}