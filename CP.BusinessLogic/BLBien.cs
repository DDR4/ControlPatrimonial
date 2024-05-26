﻿using CP.Common;
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

            bien = repository.GetBien(obj).FirstOrDefault();
            bien.Auditoria = new Auditoria()
            {
                UsuarioCreacion = obj.Auditoria.UsuarioCreacion
            };
            byte[] arraybytes = CrearBoletaPago(bien);
            string nombrearchivo = "DetalleBien" + DateTime.Now;
            bien.Arraybytes = arraybytes;
            bien.Nombrearchivo = nombrearchivo;

            return new Response<Bien>(bien);
        }

        public byte[] CrearBoletaPago(Bien bien)
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
                int fila = 0;

                Font tituloFont = new Font(Font.FontFamily.HELVETICA, 5, Font.NORMAL, BaseColor.BLACK);
                Font tituloFont2 = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.BLACK);
                Font standardFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.BLACK);

                Paragraph titulo = AddParagraph("Sistema Control Patrimonial", Element.ALIGN_CENTER, tituloFont);
                doc.Add(new Paragraph(titulo));

                PdfPTable tblElementos = new PdfPTable(new float[] { 75, 25 });
                tblElementos.WidthPercentage = 100;

                string[] arrayElementos = { "","Fecha: " + DateTime.Now.ToString("dd/MM/yyyy"),
                    "Código: " + bien.Bien_Id,"Hora: " + DateTime.Now.ToString("hh:mm"),
                    "Tipo de Bien: " + bien.TipoBien.Descripcion,
                    "Usuario: " + bien.Auditoria.UsuarioCreacion };

                for (int i = 0; i < arrayElementos.Length; i++)
                {
                    PdfPCell pdfPCell = AddPdfPCell(arrayElementos[i].ToString(),standardFont, 0, 0, 0, Element.ALIGN_LEFT, BaseColor.WHITE);
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

                    PdfPCell pdfPCell = AddPdfPCell(arrayElementos2[i].ToString(), standardFont, 0, widthbottom, 0, Element.ALIGN_LEFT,BaseColor.WHITE);
                    tblElementos2.AddCell(pdfPCell);
                }

                doc.Add(tblElementos2);

                PdfPTable tblElementos3 = new PdfPTable(new float[] { 20, 20, 20, 20, 20 });
                tblElementos3.WidthPercentage = 100;

                string[] arrayElementos3 = 
                { 
                    "Fecha de Registro:", "", "", "Asignado a:", "",
                    "Orden de Compra:", bien.OrdenCompra, "", "Unidad Orgánica:", "",
                    "Proveedor:", bien.Proveedor, "", "Sede:", "",
                    "Marca:", bien.Marca, "", "", "",
                    "Modelo:", bien.Modelo, "", "", "",
                    "Marca:", bien.Marca, "", "", "",
                    "Número de Serie:", bien.Serie, "", "", "",
                    "FV Garantía:", bien.FechaVenGarantia, "", "", "",
                    "Componentes:", bien.Componentes, "", "", "",
                    "Estado de Bien:", bien.Estado.Descripcion, "", "", "",
                };

                for (int i = 0; i < arrayElementos3.Length; i++)
                {
                    PdfPCell pdfPCell = AddPdfPCell(arrayElementos3[i].ToString(), standardFont, 0, 0, 0, Element.ALIGN_LEFT, BaseColor.WHITE);
                    tblElementos3.AddCell(pdfPCell);
                }

                doc.Add(tblElementos3);

                Paragraph espacio = AddParagraph("________________________________________________________________________________", Element.ALIGN_LEFT, standardFont);
                doc.Add(new Paragraph(espacio));

                Paragraph ingresoSalida = AddParagraph("MOVIMIENTOS DE INGRESOS Y SALIDAS", Element.ALIGN_LEFT, tituloFont2);
                doc.Add(new Paragraph(ingresoSalida));

                PdfPTable tblElementos4 = new PdfPTable(new float[] { 10, 10, 10, 20, 20, 20, 10 });
                tblElementos4.WidthPercentage = 100;
                tblElementos4.SpacingBefore = 5;
                tblElementos4.SpacingAfter = 10;

                string[] arrayElementos4 = 
                { 
                    "Código", "Estado", "Fecha", "Nombre", "Sede", "Unidad Orgánica", "Motivo",
                    " ", " ", " ", " ", " ", "", " ",
                    " ", " ", " ", " ", " ", "", " ",
                    " ", " ", " ", " ", " ", "", " ",
                    " ", " ", " ", " ", " ", "", " ",
                    " ", " ", " ", " ", " ", "", " ",
                };

                for (int i = 0; i < arrayElementos4.Length; i++)
                {
                    float width = 1;
                    float widthbottom = 0;
                    float widthtop = 0;
                    BaseColor backgroundColor = BaseColor.WHITE;
                    
                    if (i == 0 || i < 7)
                    {
                        width = 1;
                        widthbottom = 0;
                        widthtop = 1;
                        backgroundColor = BaseColor.GRAY;
                    }
                    else
                    {
                        if (i % 7 == 0)
                        {
                            fila++;
                        }
                    }

                    if (fila > 0 && fila % 2 == 1)
                    {
                        backgroundColor = BaseColor.LIGHT_GRAY;
                    }

                    if (i > arrayElementos4.Length - 8)
                    {
                        widthbottom = 1;
                    }

                    PdfPCell pdfPCell = AddPdfPCell(arrayElementos4[i].ToString(), standardFont, width, widthbottom, widthtop, Element.ALIGN_LEFT, backgroundColor);
                    tblElementos4.AddCell(pdfPCell);
                }

                doc.Add(tblElementos4);

                Paragraph movimientos = AddParagraph("MOVITOS DE TRANSFERENCIA", Element.ALIGN_LEFT, tituloFont2);
                doc.Add(new Paragraph(movimientos));

                PdfPTable tblElementos5 = new PdfPTable(new float[] { 20, 20, 20, 40 });
                tblElementos5.WidthPercentage = 100;
                tblElementos5.SpacingBefore = 5;

                string[] arrayElementos5 =
                {
                    "Código", "Fecha", "Motivo", "Descripción",
                    " ", " ", " ", " ",
                    " ", " ", " ", " ",
                    " ", " ", " ", " ",
                    " ", " ", " ", " ",
                    " ", " ", " ", " ",
                };

                fila = 0;
                for (int i = 0; i < arrayElementos5.Length; i++)
                {
                    float width = 1;
                    float widthbottom = 0;
                    float widthtop = 0;
                    BaseColor backgroundColor = BaseColor.WHITE;

                    if (i == 0 || i < 4)
                    {
                        width = 1;
                        widthbottom = 0;
                        widthtop = 1;
                        backgroundColor = BaseColor.GRAY;
                    }
                    else
                    {
                        if (i % 4 == 0)
                        {
                            fila++;
                        }
                    }

                    if (fila > 0 && fila % 2 == 1)
                    {
                        backgroundColor = BaseColor.LIGHT_GRAY;
                    }


                    if (i > arrayElementos5.Length - 5)
                    {
                        widthbottom = 1;
                    }

                    PdfPCell pdfPCell = AddPdfPCell(arrayElementos5[i].ToString(), standardFont, width, widthbottom, widthtop, Element.ALIGN_LEFT, backgroundColor);
                    tblElementos5.AddCell(pdfPCell);
                }

                doc.Add(tblElementos5);

                doc.Close();
                arraybytes = memoryStream.ToArray();
                memoryStream.Close();
            }

            return arraybytes;
        }

        public Paragraph AddParagraph(string descripcion, int alineacion, Font font)
        {
            Paragraph paragraph = new Paragraph(descripcion);
            paragraph.Alignment = alineacion;
            paragraph.Font = font;
            return paragraph;
        }

        public PdfPCell AddPdfPCell(string descripcion, Font font, float width, float widthbottom, float widthtop, int alineacion, BaseColor backgroundColor)
        {
            PdfPCell pdfPCell = new PdfPCell(new Phrase(descripcion, font));
            pdfPCell.BorderWidth = width;
            pdfPCell.BorderWidthBottom = widthbottom;
            pdfPCell.BorderWidthTop = widthtop;
            pdfPCell.HorizontalAlignment = alineacion;
            pdfPCell.BackgroundColor = backgroundColor;
            return pdfPCell;
        }

    }
}
