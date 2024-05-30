using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CP.Entities
{
    public class DetalleProceso
    {
        public int? DetalleProceso_Id { get; set; }
        public int? Usuario_Inicial { get; set; }
        public string Usuario_Inicial_Descripcion { get; set; }
        public int? UnidadOrganica_Inicial { get; set; }
        public string UnidadOrganica_Inicial_Descripcion { get; set; }
        public int? Sede_Inicial { get; set; }
        public string Sede_Inicial_Descripcion { get; set; }
        public int? Usuario_Final { get; set; }
        public string Usuario_Final_Descripcion { get; set; }
        public int? UnidadOrganica_Final { get; set; }
        public string UnidadOrganica_Final_Descripcion { get; set; }
        public int? Sede_Final { get; set; }
        public string Sede_Final_Descripcion { get; set; }
        public Funcionario Funcionario { get; set; }
        public Bien Bien { get; set; }
        public Proceso Proceso { get; set; }
        public DetalleTransferencia DetalleTransferencia { get; set; }
        public DetalleSalida DetalleSalida { get; set; }

    }
}
