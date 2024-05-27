using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CP.Entities
{
    public class DetalleSalida
    {
        public int? DetalleSalida_Id { get; set; }
        public string Antecedentes { get; set; }
        public string Analisis { get; set; }
        public string Conclusiones { get; set; }
        public string Recomendaciones { get; set; }
        public Asunto Asunto { get; set; }
    }
}
