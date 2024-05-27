using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CP.Entities
{
    public class Funcionario
    {
        public int? Funcionario_Id { get; set; }
        public string Nombre { get; set; }
        public string Campo { get; set; }
        public UnidadOrganica UnidadOrganica { get; set; }
    }
}
