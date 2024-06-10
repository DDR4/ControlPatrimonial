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
    public class BLBien
    {
        private DABien repository;

        public BLBien()
        {
            repository = new DABien();
        }

        public Response<IEnumerable<Bien>> GetBien(Bien obj)
        {
            try
            {
                var result = repository.GetBien(obj);
                return new Response<IEnumerable<Bien>>(result);
            }
            catch (Exception ex)
            {
                return new Response<IEnumerable<Bien>>(ex);
            }
        }

        public Response<int> InsertUpdateBien(Bien obj)
        {
            try
            {
                var result = repository.InsertUpdateBien(obj);
                return new Response<int>(result);
            }
            catch (Exception ex)
            {
                return new Response<int>(ex);
            }
        }

        public Response<int> DeleteBien(Bien obj)
        {
            try
            {
                var result = repository.DeleteBien(obj);
                return new Response<int>(result);
            }
            catch (Exception ex)
            {
                return new Response<int>(ex);
            }
        }

        public Response<bool> ValidarSerie(Bien obj)
        {
            try
            {
                var result = repository.ValidarSerie(obj);
                return new Response<bool>(result);
            }
            catch (Exception ex)
            {
                return new Response<bool>(ex);
            }
        }

        public Response<Bien> DescargarBien(Bien obj)
        {
            Bien bien = new Bien();
            Bien detalleProceso = new Bien();
            IEnumerable<Proceso> lstProceso = new List<Proceso>();
            IEnumerable<DetalleProceso> lstDetalleProceso = new List<DetalleProceso>();
            Proceso proceso = new Proceso();

            bien = repository.GetBien(obj).FirstOrDefault();
            detalleProceso = repository.GetDetalleBien(obj);
            lstProceso = repository.GetIngresoSalida(obj);
            lstDetalleProceso = repository.GetDetalle_Transferencia(obj, proceso);
            bien.Auditoria = new Auditoria()
            {
                UsuarioCreacion = obj.Auditoria.UsuarioCreacion,
                FechaCreacion = detalleProceso.Auditoria.FechaCreacion
            };
            bien.DetalleProceso = new DetalleProceso()
            {
                Usuario_Inicial_Descripcion = detalleProceso.DetalleProceso.Usuario_Inicial_Descripcion,
                UnidadOrganica_Inicial_Descripcion = detalleProceso.DetalleProceso.UnidadOrganica_Inicial_Descripcion,
                Sede_Inicial_Descripcion = detalleProceso.DetalleProceso.Sede_Inicial_Descripcion
            };

            byte[] arraybytes = CrearDetalleBien(bien,lstProceso.ToList(), lstDetalleProceso.ToList());
            string nombrearchivo = "DetalleBien" + DateTime.Now;
            bien.Arraybytes = arraybytes;
            bien.Nombrearchivo = nombrearchivo;

            return new Response<Bien>(bien);
        }

        public byte[] CrearDetalleBien(Bien bien, List<Proceso> lstProceso, List<DetalleProceso> lstDetalleProceso)
        {
            Document doc = new Document(PageSize.LETTER);
            byte[] arraybytes = null;
            using (MemoryStream memoryStream = new MemoryStream())
            {
                PdfWriter writer = PdfWriter.GetInstance(doc, memoryStream);
                doc.Open();
                string tituloPestaña = "Detalle de Bien_" + bien.Serie;
                doc.AddTitle(tituloPestaña);

                // Abrimos el archivo
                doc.Open();

                Font tituloFont = new Font(Font.FontFamily.HELVETICA, 5, Font.NORMAL, BaseColor.BLACK);
                Font tituloFont2 = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.BLACK);
                Font standardFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.BLACK);

                Paragraph titulo = ExtendedMethodsReport.AddParagraph("Sistema Control Patrimonial", Element.ALIGN_CENTER, tituloFont);
                doc.Add(new Paragraph(titulo));

                PdfPTable tblElementos = new PdfPTable(new float[] { 75, 25 });
                tblElementos.WidthPercentage = 100;

                string[] arrayElementos = { "","Fecha: " + DateTime.Now.ToString("dd/MM/yyyy"),
                    "Código: " + bien.Bien_Id,"Hora: " + DateTime.Now.ToString("hh:mm"),
                    "Tipo de Bien: " + bien.TipoBien.Descripcion,
                    "Usuario: " + bien.Auditoria.UsuarioCreacion };

                for (int i = 0; i < arrayElementos.Length; i++)
                {
                    PdfPCell pdfPCell = ExtendedMethodsReport.AddPdfPCell(arrayElementos[i].ToString(),standardFont, 0, 0, 0, 0, Element.ALIGN_LEFT, BaseColor.WHITE);
                    tblElementos.AddCell(pdfPCell);
                }

                doc.Add(tblElementos);

                doc.Add(new Paragraph("\n"));

                PdfPTable tblElementos2 = new PdfPTable(new float[] { 40, 20, 40 });
                tblElementos2.WidthPercentage = 100;

                string[] arrayElementos2 = { "DATOS DEL PRODUCTO", "", "DATOS GENERALES" };

                for (int i = 0; i < arrayElementos2.Length; i++)
                {
                    float widthbottom = 1;
                    if (i == 1)
                    {
                        widthbottom = 0;
                    }

                    PdfPCell pdfPCell = ExtendedMethodsReport.AddPdfPCell(arrayElementos2[i].ToString(), standardFont, 0, 0, widthbottom, 0, Element.ALIGN_LEFT,BaseColor.WHITE);
                    tblElementos2.AddCell(pdfPCell);
                }

                doc.Add(tblElementos2);

                PdfPTable tblElementos3 = new PdfPTable(new float[] { 20, 20, 20, 20, 20 });
                tblElementos3.WidthPercentage = 100;

                string[] arrayElementos3 = 
                { 
                    "Fecha de Registro:", bien.Auditoria.FechaCreacion, "", "Asignado a:", bien.DetalleProceso.Usuario_Inicial_Descripcion,
                    "Orden de Compra:", bien.OrdenCompra, "", "Unidad Orgánica:", bien.DetalleProceso.UnidadOrganica_Inicial_Descripcion,
                    "Proveedor:", bien.Proveedor, "", "Sede:", bien.DetalleProceso.Sede_Inicial_Descripcion,
                    "Marca:", bien.Marca, "", "", "",
                    "Modelo:", bien.Modelo, "", "", "",
                    "Número de Serie:", bien.Serie, "", "", "",
                    "FV Garantía:", bien.FechaVenGarantia, "", "", "",
                    "Componentes:", bien.Componentes, "", "", "",
                    "Estado de Bien:", bien.Estado.Descripcion, "", "", "",
                };

                for (int i = 0; i < arrayElementos3.Length; i++)
                {
                    PdfPCell pdfPCell = ExtendedMethodsReport.AddPdfPCell(arrayElementos3[i].ToString(), standardFont, 0, 0, 0, 0, Element.ALIGN_LEFT, BaseColor.WHITE);
                    tblElementos3.AddCell(pdfPCell);
                }

                doc.Add(tblElementos3);

                Paragraph espacio = ExtendedMethodsReport.AddParagraph("________________________________________________________________________________", Element.ALIGN_LEFT, standardFont);
                doc.Add(new Paragraph(espacio));

                Paragraph ingresoSalida = ExtendedMethodsReport.AddParagraph("MOVIMIENTOS DE INGRESOS Y SALIDAS", Element.ALIGN_LEFT, tituloFont2);
                doc.Add(new Paragraph(ingresoSalida));

                PdfPTable tblElementos4 = new PdfPTable(new float[] { 8, 12, 10, 20, 20, 20 });
                tblElementos4.WidthPercentage = 100;
                tblElementos4.SpacingBefore = 5;
                tblElementos4.SpacingAfter = 10;

                List<string> listIngresoSalida = new List<string>();

                string[] arrayElementos4 = 
                { 
                    "Código", "Estado", "Fecha", "Nombre", "Sede", "Unidad Orgánica",
                };

                listIngresoSalida.AddRange(arrayElementos4);

                for (int i = 0; i < lstProceso.Count(); i++)
                {
                    Proceso proceso = new Proceso();
                    proceso = lstProceso[i];
                    string[] arrayIngresoSalida = 
                    {
                        proceso.Proceso_Id.ToString(),
                        proceso.Movimiento_Descripcion.ToString(),
                        proceso.FechaIngreso,
                        proceso.Nombres,
                        proceso.DetalleProceso.Sede_Inicial_Descripcion,
                        proceso.DetalleProceso.UnidadOrganica_Inicial_Descripcion
                    };
                    listIngresoSalida.AddRange(arrayIngresoSalida);
                }

                ExtendedMethodsReport.AgregarTabla(listIngresoSalida, 6, tblElementos4, standardFont);

                doc.Add(tblElementos4);

                Paragraph movimientos = ExtendedMethodsReport.AddParagraph("MOTIVOS DE TRANSFERENCIA", Element.ALIGN_LEFT, tituloFont2);
                doc.Add(new Paragraph(movimientos));

                PdfPTable tblElementos5 = new PdfPTable(new float[] { 20, 20, 20, 40 });
                tblElementos5.WidthPercentage = 100;
                tblElementos5.SpacingBefore = 5;

                List<string> listTransferencia = new List<string>();

                string[] arrayElementos5 =
                {
                    "Código", "Fecha", "Motivo", "Descripción"
                };

                listTransferencia.AddRange(arrayElementos5);

                for (int i = 0; i < lstDetalleProceso.Count(); i++)
                {
                    DetalleProceso detalleProceso = new DetalleProceso();
                    detalleProceso = lstDetalleProceso[i];
                    string[] arrayTransferencia =
                    {
                        detalleProceso.Proceso.Proceso_Id.ToString(),
                        detalleProceso.Proceso.FechaIngreso.ToString(),
                        detalleProceso.DetalleTransferencia.Motivo,
                        detalleProceso.DetalleTransferencia.Descripcion
                    };
                    listTransferencia.AddRange(arrayTransferencia);
                }

                ExtendedMethodsReport.AgregarTabla(listTransferencia, 4, tblElementos5, standardFont);

                doc.Add(tblElementos5);

                doc.Close();
                arraybytes = memoryStream.ToArray();
                memoryStream.Close();
            }

            return arraybytes;
        }
    }
}
