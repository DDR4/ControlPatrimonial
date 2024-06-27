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
    public class DASalida
    {
        public IEnumerable<Proceso> GetSalida(Proceso obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Proceso_Id", obj.Proceso_Id);
                parm.Add("@Estado", obj.Estado.Estado_Id);
                parm.Add("@NumPagina", obj.Operacion.Inicio);
                parm.Add("@TamPagina", obj.Operacion.Fin);
                var result = connection.Query(
                     sql: "sp_Buscar_Salida",
                     param: parm,
                     commandType: CommandType.StoredProcedure)
                     .Select(m => m as IDictionary<string, object>)
                     .Select(n => new Proceso
                     {
                         Proceso_Id = n.Single(d => d.Key.Equals("Proceso_Id")).Value.Parse<int>(),
                         DetalleProceso = new DetalleProceso 
                         {
                             DetalleSalida = new DetalleSalida 
                             {
                                 Asunto = new Asunto 
                                 {
                                     Asunto_Id = n.Single(d => d.Key.Equals("Asunto_Id")).Value.Parse<int>(),
                                     Descripcion = n.Single(d => d.Key.Equals("Asunto_Nombre")).Value.Parse<string>(),
                                 },
                                 Antecedentes = n.Single(d => d.Key.Equals("DetalleSalida_Antecedentes")).Value.Parse<string>(),
                                 Analisis = n.Single(d => d.Key.Equals("DetalleSalida_Analisis")).Value.Parse<string>(),
                                 Conclusiones = n.Single(d => d.Key.Equals("DetalleSalida_Conclusiones")).Value.Parse<string>(),
                                 Recomendaciones = n.Single(d => d.Key.Equals("DetalleSalida_Recomendaciones")).Value.Parse<string>(),
                             },
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

        public int InsertUpdateSalida(Proceso obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Proceso_Id", obj.Proceso_Id);
                parm.Add("@Asunto_Id", obj.DetalleProceso.DetalleSalida.Asunto.Asunto_Id);
                parm.Add("@Antecedentes", obj.DetalleProceso.DetalleSalida.Antecedentes);
                parm.Add("@Analisis", obj.DetalleProceso.DetalleSalida.Analisis);
                parm.Add("@Conclusiones", obj.DetalleProceso.DetalleSalida.Conclusiones);
                parm.Add("@Recomendaciones", obj.DetalleProceso.DetalleSalida.Recomendaciones);
                parm.Add("@BienesXML", obj.BienesXML);
                parm.Add("@Estado_Id", obj.Estado.Estado_Id);
                parm.Add("@Usuario_Id", obj.Auditoria.Usuario_Id);
                var result = connection.Execute(
                    sql: "sp_Insertar_Salida",
                    param: parm,
                    commandType: CommandType.StoredProcedure);

                return result;
            }
        }

        public int DeleteSalida(Proceso obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Proceso_Id", obj.Proceso_Id);
                var result = connection.Execute(
                    sql: "sp_Eliminar_Salida",
                    param: parm,
                    commandType: CommandType.StoredProcedure);

                return result;
            }
        }
    }
}
