using iTextSharp.text;
using iTextSharp.text.pdf;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CP.Common
{
   public static class ExtendedMethodsReport
    {
        public static Paragraph AddParagraph(string descripcion, int alineacion, Font font)
        {
            Paragraph paragraph = new Paragraph(descripcion);
            paragraph.Alignment = alineacion;
            paragraph.Font = font;
            return paragraph;
        }

        public static PdfPCell AddPdfPCell(string descripcion, Font font, float widthleft, float widthright, float widthbottom, float widthtop, int alineacion, BaseColor backgroundColor)
        {
            PdfPCell pdfPCell = new PdfPCell(new Phrase(descripcion, font));
            pdfPCell.BorderWidthLeft = widthleft;
            pdfPCell.BorderWidthRight = widthright;
            pdfPCell.BorderWidthBottom = widthbottom;
            pdfPCell.BorderWidthTop = widthtop;
            pdfPCell.HorizontalAlignment = alineacion;
            pdfPCell.BackgroundColor = backgroundColor;
            return pdfPCell;
        }

        public static void AgregarTabla(List<string> listIngresoSalida, int columnas, PdfPTable tblElementos, Font font)
        {
            int fila = 0;
            for (int i = 0; i < listIngresoSalida.Count; i++)
            {
                float widthleft = 1;
                float widthright = 1;
                float widthbottom = 0;
                float widthtop = 0;
                BaseColor backgroundColor = BaseColor.WHITE;

                if (i == 0 || i < columnas)
                {
                    widthleft = 1;
                    widthright = 1;
                    widthbottom = 0;
                    widthtop = 1;
                    backgroundColor = BaseColor.GRAY;
                }
                else
                {
                    if (i % columnas == 0)
                    {
                        fila++;
                    }
                }

                if (fila > 0 && fila % 2 == 1)
                {
                    backgroundColor = BaseColor.LIGHT_GRAY;
                }

                if (i > listIngresoSalida.Count - (columnas + 1))
                {
                    widthbottom = 1;
                }

                PdfPCell pdfPCell = AddPdfPCell(listIngresoSalida[i].ToString(), font, widthleft, widthright, widthbottom, widthtop, Element.ALIGN_LEFT, backgroundColor);
                tblElementos.AddCell(pdfPCell);
            }

        }

        public static void AgregarTablaDetalle(string[] arrayElementos, int columnas, List<int> columnaIntermedia, int columnaInicial, int columna, bool cabecera, PdfPTable tblElementos, Font font, int alineacion)
        {
            int fila = 0;
            for (int i = 0; i < arrayElementos.Length; i++)
            {
                float widthleft = 0;
                float widthright = 0;
                float widthbottom = 0;
                float widthtop = 0;

                if (cabecera)
                {
                    widthleft = 1;
                    widthright = 1;
                    widthbottom = 1;
                    widthtop = 1;
                }

                if (i % columnas == 0)
                {
                    fila++;
                    columna = 1;
                }

                if (fila > 1)
                {
                    if (columna == columnaInicial)
                    {
                        if (cabecera)
                        {
                            widthbottom = 0;
                            widthtop = 0;
                        }
                        else
                        {
                            widthleft = 1;
                        }                       
                    }
                    else if (columnaIntermedia.Contains(columna) || columna == columnas)
                    {
                        if (cabecera)
                        {
                            widthleft = 0;
                            widthbottom = 0;
                            widthtop = 0;
                        }
                        else
                        {
                            widthright = 1;
                        }
                    }
                    columna++;
                }

                if (fila == 1 || fila == (arrayElementos.Length / columnas))
                {
                    widthbottom = 1;
                }

                PdfPCell pdfPCell = AddPdfPCell(arrayElementos[i].ToString(), font, widthleft, widthright, widthbottom, widthtop, alineacion, BaseColor.WHITE);
                tblElementos.AddCell(pdfPCell);
            }
        }
    }
}
