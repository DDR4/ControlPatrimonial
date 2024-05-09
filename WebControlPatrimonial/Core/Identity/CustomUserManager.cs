using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity;
using System.Threading.Tasks;
using WebControlPatrimonial.Core.Identity;

namespace WebControlPatrimonial.Core.Identity
{
    public class CustomUserManager : UserManager<CustomApplicationUser>
    {
        public CustomUserManager() : base(new CustomUserStore<CustomApplicationUser>())
        {
        }

        public override Task<CustomApplicationUser> FindAsync(string dni, string clave)
        {
            var taskInvoke = Task<CustomApplicationUser>.Factory.StartNew(() =>
            {
                var credential = new CP.Entities.Usuario
                {
                    Dni = dni,
                    Clave = clave
                };

                var authBL = new CP.BusinessLogic.BLAuthorization();
                var result = authBL.Authorize(credential);

                return new CustomApplicationUser(result.Result);

            });

            return taskInvoke;
        }
    }
}