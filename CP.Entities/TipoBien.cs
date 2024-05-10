using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CP.Entities
{
    public class TipoBien
    {
        public int? TipoBien_Id { get; set; }
        public string Descripcion { get; set; }
        public Estado Estado { get; set; }
    }
}
