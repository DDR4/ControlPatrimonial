using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CP.Entities
{
    public class Usuario
    {
        public int? Usuario_Id { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string Dni { get; set; }
        public string Clave { get; set; }
        public Rol Rol { get; set; }
        public UnidadOrganica UnidadOrganica { get; set; }
        public Sede Sede { get; set; }
        public Estado Estado { get; set; }

    }
}
