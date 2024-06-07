using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CP.Entities
{
    public class DetalleTransferencia
    {
        public int? DetalleTransferencia_Id { get; set; }
        public string Motivo { get; set; }
        public string Descripcion { get; set; }
        public byte[] Arraybytes { get; set; }
        public string Base64 { get; set; }
        public string Nombrearchivo { get; set; }
    }
}
