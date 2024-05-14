using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CP.Entities
{
    public class Auditoria
    {
        public int Usuario_Id { get; set; }
        public string UsuarioCreacion { get; set; }
        public string TipoUsuario { get; set; }
    }
}
