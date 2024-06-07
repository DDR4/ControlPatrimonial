using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using CP.Common;
using CP.Entities;

namespace CP.DataAccess
{
    public class DACombos
    {
        public IEnumerable<Rol> GetRol()
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                var result = connection.Query(
                     sql: "sp_Obtener_Rol",
                     param: parm,
                     commandType: CommandType.StoredProcedure)
                     .Select(m => m as IDictionary<string, object>)
                     .Select(n => new Rol
                     {
                         Rol_Id = n.Single(d => d.Key.Equals("Rol_Id")).Value.Parse<int>(),
                         Descripcion = n.Single(d => d.Key.Equals("Rol_Descripcion")).Value.Parse<string>()                        
                     });

                return result;
            }
        }

        public IEnumerable<UnidadOrganica> GetUnidadOrganica()
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                var result = connection.Query(
                     sql: "sp_Obtener_UnidadOrganica",
                     param: parm,
                     commandType: CommandType.StoredProcedure)
                     .Select(m => m as IDictionary<string, object>)
                     .Select(n => new UnidadOrganica
                     {
                         UnidadOrganica_Id = n.Single(d => d.Key.Equals("UnidadOrganica_Id")).Value.Parse<int>(),
                         Descripcion = n.Single(d => d.Key.Equals("UnidadOrganica_Descripcion")).Value.Parse<string>()
                     });

                return result;
            }
        }

        public IEnumerable<Sede> GetSede()
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                var result = connection.Query(
                     sql: "sp_Obtener_Sede",
                     param: parm,
                     commandType: CommandType.StoredProcedure)
                     .Select(m => m as IDictionary<string, object>)
                     .Select(n => new Sede
                     {
                         Sede_Id = n.Single(d => d.Key.Equals("Sede_Id")).Value.Parse<int>(),
                         Descripcion = n.Single(d => d.Key.Equals("Sede_Descripcion")).Value.Parse<string>()
                     });

                return result;
            }
        }

        public IEnumerable<TipoBien> GetTipoBien()
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                var result = connection.Query(
                     sql: "sp_Obtener_TipoBien",
                     param: parm,
                     commandType: CommandType.StoredProcedure)
                     .Select(m => m as IDictionary<string, object>)
                     .Select(n => new TipoBien
                     {
                         TipoBien_Id = n.Single(d => d.Key.Equals("TipoBien_Id")).Value.Parse<int>(),
                         Descripcion = n.Single(d => d.Key.Equals("TipoBien_Descripcion")).Value.Parse<string>()
                     });

                return result;
            }
        }

        public IEnumerable<Usuario> GetUsuario()
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                var result = connection.Query(
                     sql: "sp_Obtener_Usuario",
                     param: parm,
                     commandType: CommandType.StoredProcedure)
                     .Select(m => m as IDictionary<string, object>)
                     .Select(n => new Usuario
                     {
                         Usuario_Id = n.Single(d => d.Key.Equals("Usuario_Id")).Value.Parse<int>(),
                         Nombres = n.Single(d => d.Key.Equals("Descripcion")).Value.Parse<string>()
                     });

                return result;
            }
        }

        public IEnumerable<Asunto> GetAsunto()
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                var result = connection.Query(
                     sql: "sp_Obtener_Asunto",
                     param: parm,
                     commandType: CommandType.StoredProcedure)
                     .Select(m => m as IDictionary<string, object>)
                     .Select(n => new Asunto
                     {
                         Asunto_Id = n.Single(d => d.Key.Equals("Asunto_Id")).Value.Parse<int>(),
                         Descripcion = n.Single(d => d.Key.Equals("Asunto_Nombre")).Value.Parse<string>()
                     });

                return result;
            }
        }

    }
}
