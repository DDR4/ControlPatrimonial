using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity;

namespace WebControlPatrimonial.Core.Identity
{
    public class CustomApplicationUser : IUser
    {
       
        public string Id { get; }
        public string UserName { get; set; }
        public string Usuario_Id { get; set; }

        public CP.Common.Response<CP.Entities.Usuario> Usuario { get; set; }

        public CustomApplicationUser() : this(new CP.Common.Response<CP.Entities.Usuario>(default(CP.Entities.Usuario)))
        {
        }


        public CustomApplicationUser(CP.Common.Response<CP.Entities.Usuario> usuario)
        {
            Usuario = usuario;

            if (usuario.InternalStatus == ControlPatrimonial.Common.EnumTypes.InternalStatus.Success)
            {
                Id = usuario.Data.Rol.Rol_Id.ToString();
                UserName = usuario.Data.Nombres;
                Usuario_Id = usuario.Data.Usuario_Id.ToString();
            }
            else
            {
                // Valores por defecto, lo cuales no tendran relevancia, puesto que la aplicación no iniciará sesión.
                Id = "1";
                UserName = "Usuario";
                Usuario_Id = "01";
            }
        }
    }
}