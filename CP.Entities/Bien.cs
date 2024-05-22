using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CP.Entities
{
    public class Bien
    {
        public int? Bien_Id { get; set; }
        public string OrdenCompra { get; set; }
        public string Proveedor { get; set; }
        public string Marca { get; set; }
        public string Modelo { get; set; }
        public string Serie { get; set; }
        public string FechaVenGarantia { get; set; }
        public string Componentes { get; set; }
        public string DniUsuario { get; set; }
        public TipoBien TipoBien { get; set; }
        public Estado Estado { get; set; }
        public Auditoria Auditoria { get; set; }
        public Operacion Operacion { get; set; }

    }
}
