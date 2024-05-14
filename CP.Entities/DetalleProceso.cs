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
        public int? Proceso_Id { get; set; }
        public int? Usuario_Inicial { get; set; }
        public string Usuario_Inicial_Descripcion { get; set; }
        public int? UnidadOrganica_Inicial { get; set; }
        public int? Sede_Inicial { get; set; }
        public int? Usuario_Final { get; set; }
        public string Usuario_Final_Descripcion { get; set; }
        public int? UnidadOrganica_Final { get; set; }
        public int? Sede_Final { get; set; }
        public int? Funcionario_Id { get; set; }
        public int? Bien_Id { get; set; }
        public int? DetalleTransferencia_Id { get; set; }
        public int? DetalleSalida_Id { get; set; }

    }
}
