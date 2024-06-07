using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;

namespace CP.Entities
{
    public class Proceso
    {
        public int? Proceso_Id { get; set; }
        public string FechaIngreso { get; set; }
        public string FechaEliminacion { get; set; }
        public string Nombres { get; set; }
        public string Movimiento_Descripcion { get; set; }
        public List<Bien> Bienes { get; set; }
        public XDocument BienesXML { get; set; }
        public Estado Estado { get; set; }
        public DetalleProceso DetalleProceso { get; set; }
        public Auditoria Auditoria { get; set; }
        public Operacion Operacion { get; set; }
        public byte[] Arraybytes { get; set; }
        public string Base64 { get; set; }
        public string Nombrearchivo { get; set; }

    }
}
