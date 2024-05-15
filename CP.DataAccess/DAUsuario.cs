using CP.Common;
using CP.Entities;
using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CP.DataAccess
{
    public class DAUsuario
    {
        public IEnumerable<Usuario> GetUsuario(Usuario obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Usuario_Id", obj.Usuario_Id);
                parm.Add("@Dni", obj.Dni);
                parm.Add("@Nombres", obj.Nombres);
                parm.Add("@Estado", obj.Estado.Estado_Id);
                parm.Add("@NumPagina", obj.Operacion.Inicio);
                parm.Add("@TamPagina", obj.Operacion.Fin);
                var result = connection.Query(
                     sql: "sp_Buscar_Usuario",
                     param: parm,
                     commandType: CommandType.StoredProcedure)
                     .Select(m => m as IDictionary<string, object>)
                     .Select(n => new Usuario
                     {
                         Usuario_Id = n.Single(d => d.Key.Equals("Usuario_Id")).Value.Parse<int>(),
                         Nombres = n.Single(d => d.Key.Equals("Usuario_Nombres")).Value.Parse<string>(),
                         Apellidos = n.Single(d => d.Key.Equals("Usuario_Apellidos")).Value.Parse<string>(),
                         Dni = n.Single(d => d.Key.Equals("Usuario_Dni")).Value.Parse<string>(),
                         Clave = n.Single(d => d.Key.Equals("Usuario_Clave")).Value.Parse<string>(),
                         Rol = new Rol 
                         { 
                             Rol_Id = n.Single(d => d.Key.Equals("Rol_Id")).Value.Parse<int>(),
                             Descripcion = n.Single(d => d.Key.Equals("Rol_Descripcion")).Value.Parse<string>(),
                         },
                         UnidadOrganica = new UnidadOrganica
                         {
                             UnidadOrganica_Id = n.Single(d => d.Key.Equals("UnidadOrganica_Id")).Value.Parse<int>(),
                             Descripcion = n.Single(d => d.Key.Equals("UnidadOrganica_Descripcion")).Value.Parse<string>(),
                         },
                         Sede = new Sede
                         {
                             Sede_Id = n.Single(d => d.Key.Equals("Sede_Id")).Value.Parse<int>(),
                             Descripcion = n.Single(d => d.Key.Equals("Sede_Descripcion")).Value.Parse<string>(),
                         },
                         Estado = new Estado
                         {
                             Estado_Id = n.Single(d => d.Key.Equals("Estado_Id")).Value.Parse<int>(),
                             Descripcion = n.Single(d => d.Key.Equals("Estado_Descripcion")).Value.Parse<string>(),
                         },
                         Auditoria = new Auditoria
                         {
                             TipoUsuario = obj.Auditoria.TipoUsuario,
                         },
                         Operacion = new Operacion
                         {
                             TotalRows = n.Single(d => d.Key.Equals("TotalRows")).Value.Parse<int>(),
                         }
                     });

                return result;
            }
        }

        public int InsertUpdateUsuario(Usuario obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Usuario_Id", obj.Usuario_Id);
                parm.Add("@Nombres", obj.Nombres);
                parm.Add("@Apellidos", obj.Apellidos);
                parm.Add("@Dni", obj.Dni);
                parm.Add("@Clave", obj.Clave);
                parm.Add("@Rol_Id", obj.Rol.Rol_Id);
                parm.Add("@UnidadOrganica_Id", obj.UnidadOrganica.UnidadOrganica_Id);
                parm.Add("@Sede_Id", obj.Sede.Sede_Id);
                parm.Add("@Estado_Id", obj.Estado.Estado_Id);
                parm.Add("@Usuario_Creacion", obj.Auditoria.UsuarioCreacion);
                var result = connection.Execute(
                    sql: "sp_Insertar_Usuario",
                    param: parm,
                    commandType: CommandType.StoredProcedure);

                return result;
            }
        }

        public int DeleteUsuario(Usuario obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Usuario_Id", obj.Usuario_Id);
                parm.Add("@Usuario_Creacion", obj.Auditoria.UsuarioCreacion);
                var result = connection.Execute(
                    sql: "sp_Eliminar_Usuario",
                    param: parm,
                    commandType: CommandType.StoredProcedure);

                return result;
            }
        }

        public bool ValidarDni(Usuario obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Usuario_Id", obj.Usuario_Id);
                parm.Add("@Dni", obj.Dni);
                var result = connection.Query(
                    sql: "sp_Validar_Dni",
                    param: parm,
                    commandType: CommandType.StoredProcedure)
                    .Select(m => m as IDictionary<string, object>)
                    .Select(n => new Usuario
                    {
                        DniExistente = n.Single(d => d.Key.Equals("ValidarDni")).Value.Parse<bool>()
                    });

                return result.FirstOrDefault().DniExistente;
            }
        }
    }
}
