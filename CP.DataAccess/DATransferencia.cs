﻿using CP.Common;
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
    public class DATransferencia
    {
        public IEnumerable<Proceso> GetTransferencia(Proceso obj)
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
                     sql: "sp_Buscar_Transferencia",
                     param: parm,
                     commandType: CommandType.StoredProcedure)
                     .Select(m => m as IDictionary<string, object>)
                     .Select(n => new Proceso
                     {
                         Proceso_Id = n.Single(d => d.Key.Equals("Proceso_Id")).Value.Parse<int>(),
                         FechaIngreso = n.Single(d => d.Key.Equals("Proceso_FechaIngreso")).Value.Parse<string>(),
                         FechaEliminacion = n.Single(d => d.Key.Equals("Proceso_FechaEliminacion")).Value.Parse<string>(),
                         DetalleProceso = new DetalleProceso 
                         {
                             Usuario_Inicial = n.Single(d => d.Key.Equals("Usuario_Inicial")).Value.Parse<int>(),
                             Usuario_Inicial_Descripcion = n.Single(d => d.Key.Equals("NombresUsuario_Inicial")).Value.Parse<string>(),
                             Usuario_Final = n.Single(d => d.Key.Equals("Usuario_Final")).Value.Parse<int>(),
                             Usuario_Final_Descripcion = n.Single(d => d.Key.Equals("NombresUsuario_Final")).Value.Parse<string>(),
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

        public int InsertUpdateTransferencia(Proceso obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Proceso_Id", obj.Proceso_Id);
                parm.Add("@Usuario_Inicial", obj.DetalleProceso.Usuario_Inicial);
                parm.Add("@Usuario_Final", obj.DetalleProceso.Usuario_Final);
                parm.Add("@BienesXML", obj.BienesXML);
                parm.Add("@Estado_Id", obj.Estado.Estado_Id);
                parm.Add("@Usuario_Id", obj.Auditoria.Usuario_Id);
                var result = connection.Execute(
                    sql: "sp_Insertar_Transferencia",
                    param: parm,
                    commandType: CommandType.StoredProcedure);

                return result;
            }
        }

        public int DeleteTransferencia(Proceso obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Proceso_Id", obj.Proceso_Id);
                var result = connection.Execute(
                    sql: "sp_Eliminar_Transferencia",
                    param: parm,
                    commandType: CommandType.StoredProcedure);

                return result;
            }
        }

        public IEnumerable<Bien> GetBienTransferencia(Proceso obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Proceso_Id", obj.Proceso_Id);
                var result = connection.Query(
                     sql: "sp_Obtener_Bien_Transferencia",
                     param: parm,
                     commandType: CommandType.StoredProcedure)
                     .Select(m => m as IDictionary<string, object>)
                     .Select(n => new Bien
                     {
                         Bien_Id = n.Single(d => d.Key.Equals("Bien_Id")).Value.Parse<int>(),
                         OrdenCompra = n.Single(d => d.Key.Equals("Bien_OrdenCompra")).Value.Parse<string>(),
                         Proveedor = n.Single(d => d.Key.Equals("Bien_Proveedor")).Value.Parse<string>(),
                         Marca = n.Single(d => d.Key.Equals("Bien_Marca")).Value.Parse<string>(),
                         Modelo = n.Single(d => d.Key.Equals("Bien_Modelo")).Value.Parse<string>(),
                         Serie = n.Single(d => d.Key.Equals("Bien_Serie")).Value.Parse<string>(),
                         FechaVenGarantia = n.Single(d => d.Key.Equals("Bien_FechaVenGarantia")).Value.Parse<string>(),
                         Componentes = n.Single(d => d.Key.Equals("Bien_Componentes")).Value.Parse<string>(),
                         TipoBien = new TipoBien
                         {
                             TipoBien_Id = n.Single(d => d.Key.Equals("TipoBien_Id")).Value.Parse<int>(),
                             Descripcion = n.Single(d => d.Key.Equals("TipoBien_Descripcion")).Value.Parse<string>(),
                         },
                         Estado = new Estado
                         {
                             Estado_Id = n.Single(d => d.Key.Equals("Estado_Id")).Value.Parse<int>(),
                             Descripcion = n.Single(d => d.Key.Equals("Estado_Descripcion")).Value.Parse<string>(),
                         },
                         Operacion = new Operacion
                         {
                             TotalRows = n.Single(d => d.Key.Equals("TotalRows")).Value.Parse<int>(),
                         }
                     });

                return result;
            }
        }
    }
}