using CP.Common;
using CP.DataAccess;
using CP.Entities;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CP.BusinessLogic
{
    public class BLTransferencia
    {
        private DATransferencia repository;
        private DABien repository2;

        public BLTransferencia()
        {
            repository = new DATransferencia();
            repository2 = new DABien();
        }

        public Response<IEnumerable<Proceso>> GetTransferencia(Proceso obj)
        {
            try
            {
                var result = repository.GetTransferencia(obj);
                List<Proceso> lstProcesos = new List<Proceso>();
                foreach (var item in result)
                {
                    var detalleProceso = item.DetalleProceso;
                    item.DetalleProceso.UnidadOrganica_Inicial_Descripcion =
                    string.Concat(detalleProceso.UnidadOrganica_Inicial_Descripcion, " - ",
                    detalleProceso.Sede_Inicial_Descripcion);
                    item.DetalleProceso.UnidadOrganica_Final_Descripcion =
                    string.Concat(detalleProceso.UnidadOrganica_Final_Descripcion, " - ",
                    detalleProceso.Sede_Final_Descripcion);
                    lstProcesos.Add(item);
                }

                return new Response<IEnumerable<Proceso>>(lstProcesos.AsEnumerable());
            }
            catch (Exception ex)
            {
                return new Response<IEnumerable<Proceso>>(ex);
            }
        }

        public Response<int?> InsertUpdateTransferencia(Proceso obj)
        {
            try
            {
                var result = repository.InsertUpdateTransferencia(obj);
                if (result > 0)
                {
                    Proceso proceso = new Proceso();
                    proceso.Proceso_Id = result;
                    proceso.Estado = new Estado();

                    if (string.IsNullOrEmpty(obj.Nombrearchivo))
                    {
                        proceso.Auditoria = new Auditoria
                        {
                            UsuarioCreacion = obj.Auditoria.UsuarioCreacion,
                            TipoUsuario = obj.Auditoria.TipoUsuario
                        };
                        proceso.Operacion = new Operacion
                        {
                            Inicio = 0,
                            Fin = 1
                        };
                        proceso = DescargarTransferencia(proceso).Data;
                    }
                    else
                    {
                        FileInfo file = new FileInfo(obj.Nombrearchivo);
                        proceso.Nombrearchivo = Path.GetFileNameWithoutExtension(file.Name);
                        proceso.Arraybytes = Convert.FromBase64String(obj.Base64);
                        proceso.Estado = new Estado()
                        {
                            Estado_Id = 3
                        };
                        ModificarTransferencia(proceso);
                    }
                    repository.RegistrarArchivoTransferencia(proceso);
                }
                return new Response<int?>(result);
            }
            catch (Exception ex)
            {
                return new Response<int?>(ex);
            }
        }

        public Response<int> ModificarTransferencia(Proceso obj)
        {
            try
            {
                var result = repository.ModificarTransferencia(obj);
                return new Response<int>(result);
            }
            catch (Exception ex)
            {
                return new Response<int>(ex);
            }
        }

        public Response<IEnumerable<Bien>> GetBienTransferencia(Proceso obj)
        {
            try
            {
                var result = repository.GetBienTransferencia(obj);
                return new Response<IEnumerable<Bien>>(result);
            }
            catch (Exception ex)
            {
                return new Response<IEnumerable<Bien>>(ex);
            }
        }

        public Response<Proceso> DescargarTransferencia(Proceso obj)
        {
            Proceso proceso = new Proceso();
            Bien bien = new Bien();
            IEnumerable<DetalleProceso> lstDetalleProceso = new List<DetalleProceso>();

            proceso = repository.GetTransferencia(obj).FirstOrDefault();
            proceso.Auditoria = new Auditoria()
            {
                UsuarioCreacion = obj.Auditoria.UsuarioCreacion
            };
            lstDetalleProceso = repository2.GetDetalle_Transferencia(bien, obj);

            byte[] arraybytes = CrearDetalleTransferencia(proceso, lstDetalleProceso.ToList());
            string nombrearchivo = "DetalleTrasferencia" + DateTime.Now;
            proceso.Arraybytes = arraybytes;
            proceso.Nombrearchivo = nombrearchivo;

            return new Response<Proceso>(proceso);
        }

        public byte[] CrearDetalleTransferencia(Proceso proceso, List<DetalleProceso> lstDetalleProceso)
        {
            Document doc = new Document(PageSize.LETTER);
            byte[] arraybytes = null;
            using (MemoryStream memoryStream = new MemoryStream())
            {
                PdfWriter writer = PdfWriter.GetInstance(doc, memoryStream);
                doc.Open();
                string tituloPestaña = "Detalle de Transferencia";
                doc.AddTitle(tituloPestaña);

                // Abrimos el archivo
                doc.Open();

                Font tituloFont = new Font(Font.FontFamily.HELVETICA, 5, Font.NORMAL, BaseColor.BLACK);
                Font tituloFont2 = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.BLACK);
                Font standardFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.BLACK);

                Paragraph titulo = ExtendedMethodsReport.AddParagraph("Transferencia de Bienes", Element.ALIGN_CENTER, tituloFont);
                doc.Add(new Paragraph(titulo));

                PdfPTable tblElementos = new PdfPTable(new float[] { 75, 25 });
                tblElementos.WidthPercentage = 100;

                string[] arrayElementos = {
                    "","Fecha Registro: " + proceso.FechaIngreso,
                    "","Usuario: " + proceso.Auditoria.UsuarioCreacion
                };

                for (int i = 0; i < arrayElementos.Length; i++)
                {
                    PdfPCell pdfPCell = ExtendedMethodsReport.AddPdfPCell(arrayElementos[i].ToString(), standardFont, 0, 0, 0, 0, Element.ALIGN_LEFT, BaseColor.WHITE);
                    tblElementos.AddCell(pdfPCell);
                }

                doc.Add(tblElementos);

                PdfPTable tblElementos2 = new PdfPTable(new float[] { 25, 25, 25, 25 });
                tblElementos2.WidthPercentage = 100;

                string[] arrayElementos2 = {
                    "Fecha Transferencia:"  , proceso.FechaIngreso, "N° Doc: " + proceso.Proceso_Id.ToString(), "",
                    "Funcionario Autoriza:", proceso.DetalleProceso.Funcionario.Nombre, "Usuario Final:", proceso.DetalleProceso.Usuario_Final_Descripcion,
                    "Usuario Inicial:", proceso.DetalleProceso.Usuario_Inicial_Descripcion,
                    "Unidad Orgánica:", proceso.DetalleProceso.UnidadOrganica_Final_Descripcion,
                    "Unidad Orgánica:", proceso.DetalleProceso.UnidadOrganica_Inicial_Descripcion,
                    "Sede:", proceso.DetalleProceso.Sede_Final_Descripcion,
                    "Sede:", proceso.DetalleProceso.Sede_Inicial_Descripcion, "", "",
                    "Motivo:", proceso.DetalleProceso.DetalleTransferencia.Motivo, "", "",
                    "Observaciones:", proceso.DetalleProceso.DetalleTransferencia.Descripcion, "", "",
                };

                int[] lstcolumnaIntermedia = { 2 };

                ExtendedMethodsReport.AgregarTablaDetalle(arrayElementos2, 4, lstcolumnaIntermedia.ToList(), 1, 1, false, tblElementos2, standardFont, Element.ALIGN_LEFT);

                doc.Add(tblElementos2);

                doc.Add(new Paragraph("\n"));

                PdfPTable tblElementos3 = new PdfPTable(new float[] { 15, 15, 15, 15, 15, 15 });
                tblElementos3.WidthPercentage = 100;

                List<string> listDetalleTransferencia = new List<string>();

                string[] arrayElementos3 = { "Código", "Tipo Bien", "Marca", "Modelo", "N° Serie", "Fecha Ven Garantia" };

                listDetalleTransferencia.AddRange(arrayElementos3);

                for (int i = 0; i < lstDetalleProceso.Count(); i++)
                {
                    DetalleProceso detalleProceso = new DetalleProceso();
                    detalleProceso = lstDetalleProceso[i];
                    string[] arrayTransferencia =
                    {
                        detalleProceso.Bien.Bien_Id.ToString(),
                        detalleProceso.Bien.TipoBien.Descripcion,
                        detalleProceso.Bien.Marca,
                        detalleProceso.Bien.Modelo,
                        detalleProceso.Bien.Serie,
                        detalleProceso.Bien.FechaVenGarantia
                    };
                    listDetalleTransferencia.AddRange(arrayTransferencia);
                }

                int[] lstcolumnaIntermedia2 = { 2, 3, 4, 5, 6 };

                ExtendedMethodsReport.AgregarTablaDetalle(listDetalleTransferencia.ToArray(), 6, lstcolumnaIntermedia2.ToList(), 1, 1, true, tblElementos3, standardFont, Element.ALIGN_LEFT);

                doc.Add(tblElementos3);

                doc.Add(new Paragraph("\n"));

                PdfPTable tblElementos4 = new PdfPTable(3);
                tblElementos4.WidthPercentage = 100;

                string[] arrayElementos4 =
                {
                    "Firma Autoriza", "Firma Usuario Entrega", "Firma Usuario Recibe", " ", " ", " ", " ", " ", " " ," " ," " ," "
                };

                int[] lstcolumnaIntermedia3 = { 2, 3 };

                ExtendedMethodsReport.AgregarTablaDetalle(arrayElementos4, 3, lstcolumnaIntermedia3.ToList(), 1, 1, true, tblElementos4, standardFont, Element.ALIGN_CENTER);

                doc.Add(tblElementos4);

                doc.Close();
                arraybytes = memoryStream.ToArray();
                memoryStream.Close();
            }

            return arraybytes;
        }

        public Response<DetalleTransferencia> GetDetalleTransferenciaArchivo(Proceso proceso)
        {
            try
            {
                var result = repository.GetDetalleTransferenciaArchivo(proceso);
                return new Response<DetalleTransferencia>(result);
            }
            catch (Exception ex)
            {
                return new Response<DetalleTransferencia>(ex);
            }
        }
    }
}
