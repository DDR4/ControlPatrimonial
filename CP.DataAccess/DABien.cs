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
    public class DABien
    {
        public IEnumerable<Bien> GetBien(Bien obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Bien_Id", obj.Bien_Id);
                parm.Add("@TipoBien_Id", obj.TipoBien.TipoBien_Id);
                parm.Add("@DniUsuario", obj.DniUsuario);
                parm.Add("@Estado", obj.Estado.Estado_Id);
                parm.Add("@Usuario_Id", obj.Auditoria.Usuario_Id);
                parm.Add("@NumPagina", obj.Operacion.Inicio);
                parm.Add("@TamPagina", obj.Operacion.Fin);
                var result = connection.Query(
                     sql: "sp_Buscar_Bien",
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

        public int InsertUpdateBien(Bien obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Bien_Id", obj.Bien_Id);
                parm.Add("@OrdenCompra", obj.OrdenCompra);
                parm.Add("@Proveedor", obj.Proveedor);
                parm.Add("@Marca", obj.Marca);
                parm.Add("@Modelo", obj.Modelo);
                parm.Add("@Serie", obj.Serie);
                parm.Add("@FechaVenGarantia", obj.FechaVenGarantia);
                parm.Add("@Componentes", obj.Componentes);
                parm.Add("@TipoBien_Id", obj.TipoBien.TipoBien_Id);
                parm.Add("@Estado_Id", obj.Estado.Estado_Id);
                parm.Add("@Usuario_Creacion", obj.Auditoria.UsuarioCreacion);
                parm.Add("@Usuario_Id", obj.Auditoria.Usuario_Id);
                var result = connection.Execute(
                    sql: "sp_Insertar_Bien",
                    param: parm,
                    commandType: CommandType.StoredProcedure);

                return result;
            }
        }

        public int DeleteBien(Bien obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Bien_Id", obj.Bien_Id);
                parm.Add("@Usuario_Creacion", obj.Auditoria.UsuarioCreacion);
                var result = connection.Execute(
                    sql: "sp_Eliminar_Bien",
                    param: parm,
                    commandType: CommandType.StoredProcedure);

                return result;
            }
        }

        public bool ValidarSerie(Bien obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Bien_Id", obj.Bien_Id);
                parm.Add("@Serie", obj.Serie);
                var result = connection.Query(
                    sql: "sp_Validar_Serie",
                    param: parm,
                    commandType: CommandType.StoredProcedure)
                    .Select(m => m as IDictionary<string, object>)
                    .Select(n => new Bien
                    {
                        BienExistente = n.Single(d => d.Key.Equals("ValidarSerie")).Value.Parse<bool>()
                    });

                return result.FirstOrDefault().BienExistente;
            }
        }

        public Bien GetDetalleBien(Bien obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Bien_Id", obj.Bien_Id);
                var result = connection.Query(
                     sql: "sp_Obtener_Detalle_Bien",
                     param: parm,
                     commandType: CommandType.StoredProcedure)
                     .Select(m => m as IDictionary<string, object>)
                     .Select(n => new Bien
                     {
                         Auditoria = new Auditoria
                         {
                             FechaCreacion = n.Single(d => d.Key.Equals("Fecha_Creacion")).Value.Parse<string>(),
                         },
                         DetalleProceso = new DetalleProceso
                         {
                             Usuario_Inicial_Descripcion = n.Single(d => d.Key.Equals("Usuario_Nombres")).Value.Parse<string>(),
                             UnidadOrganica_Inicial_Descripcion = n.Single(d => d.Key.Equals("UnidadOrganica_Descripcion")).Value.Parse<string>(),
                             Sede_Inicial_Descripcion = n.Single(d => d.Key.Equals("Sede_Descripcion")).Value.Parse<string>()
                         }
                     });

                return result.FirstOrDefault();
            }
        }

        public IEnumerable<Proceso> GetIngresoSalida(Bien obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Bien_Id", obj.Bien_Id);
                var result = connection.Query(
                     sql: "sp_Obtener_Ingresos_Salidad",
                     param: parm,
                     commandType: CommandType.StoredProcedure)
                     .Select(m => m as IDictionary<string, object>)
                     .Select(n => new Proceso
                     {

                         Proceso_Id = n.Single(d => d.Key.Equals("Proceso_Id")).Value.Parse<int>(),
                         Movimiento_Descripcion = n.Single(d => d.Key.Equals("Movimiento_Descripcion")).Value.Parse<string>(),
                         FechaIngreso = n.Single(d => d.Key.Equals("Proceso_FechaIngreso")).Value.Parse<string>(),
                         Nombres = n.Single(d => d.Key.Equals("Usuario_Nombres")).Value.Parse<string>(),
                         DetalleProceso = new DetalleProceso
                         {
                             Sede_Inicial_Descripcion = n.Single(d => d.Key.Equals("Sede_Descripcion")).Value.Parse<string>(),
                             UnidadOrganica_Inicial_Descripcion = n.Single(d => d.Key.Equals("UnidadOrganica_Descripcion")).Value.Parse<string>(),
                         }
                     });

                return result;
            }
        }

        public IEnumerable<DetalleProceso> GetDetalle_Transferencia(Bien bien,Proceso proceso)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Bien_Id", bien.Bien_Id);
                parm.Add("@Proceso_Id", proceso.Proceso_Id);
                var result = connection.Query(
                     sql: "sp_Obtener_Detalle_Transferencia",
                     param: parm,
                     commandType: CommandType.StoredProcedure)
                     .Select(m => m as IDictionary<string, object>)
                     .Select(n => new DetalleProceso
                     {
                         Proceso = new Proceso
                         {
                             Proceso_Id = n.Single(d => d.Key.Equals("Proceso_Id")).Value.Parse<int>(),
                             FechaIngreso = n.Single(d => d.Key.Equals("Proceso_FechaIngreso")).Value.Parse<string>(),
                         },
                         Bien = new Bien 
                         {
                             Marca = n.Single(d => d.Key.Equals("Bien_Marca")).Value.Parse<string>(),
                             Modelo = n.Single(d => d.Key.Equals("Bien_Modelo")).Value.Parse<string>(),
                             Serie = n.Single(d => d.Key.Equals("Bien_Serie")).Value.Parse<string>(),
                         },
                         DetalleTransferencia = new DetalleTransferencia
                         {
                             Motivo = n.Single(d => d.Key.Equals("DetalleTransferencia_Motivo")).Value.Parse<string>(),
                             Descripcion = n.Single(d => d.Key.Equals("DetalleTransferencia_Descripcion")).Value.Parse<string>(),
                             Arraybytes = n.Single(d => d.Key.Equals("DetalleTransferencia_BinarioArchivo")).Value.Parse<byte[]>(),
                             Nombrearchivo = n.Single(d => d.Key.Equals("DetalleTransferencia_NombreArchivo")).Value.Parse<string>(),
                         }
                     });

                return result;
            }
        }
    }
}
