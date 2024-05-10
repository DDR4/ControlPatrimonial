using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using CP.Entities;
using CP.Common;

namespace CP.DataAccess
{
    public class DAAuthorization
    {
        public Task<Usuario> Authorize(Usuario obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();

                var parameter = new DynamicParameters();
                parameter.Add("@Dni", obj.Dni);
                parameter.Add("@Clave", obj.Clave);

                var result = connection.Query(
                    sql: "sp_Login",
                    param: parameter,
                    commandType: CommandType.StoredProcedure)
                    .Select(m => m as IDictionary<string, object>)
                    .Select(n => new Usuario
                    {
                        Usuario_Id = n.Single(d => d.Key.Equals("Usuario_Id")).Value.Parse<int>(),
                        Nombres = n.Single(d => d.Key.Equals("Usuario_Nombres")).Value.Parse<string>(),
                        Rol = new Rol
                        {
                            Rol_Id = n.Single(d => d.Key.Equals("Rol_Id")).Value.Parse<int>(),
                        },
                        Estado = new Estado
                        {
                            Estado_Id = n.Single(d => d.Key.Equals("Estado_Id")).Value.Parse<int>(),
                        }
                    });

                return Task.FromResult(result.FirstOrDefault());

            }


        }
    }
}
