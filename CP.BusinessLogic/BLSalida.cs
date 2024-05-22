using CP.Common;
using CP.DataAccess;
using CP.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CP.BusinessLogic
{
    public class BLSalida
    {
        private DASalida repository;

        public BLSalida()
        {
            repository = new DASalida();
        }

        public Response<IEnumerable<Proceso>> GetSalida(Proceso obj)
        {
            try
            {
                var result = repository.GetSalida(obj);
                return new Response<IEnumerable<Proceso>>(result);
            }
            catch (Exception ex)
            {
                return new Response<IEnumerable<Proceso>>(ex);
            }
        }

        public Response<int> InsertUpdateSalida(Proceso obj)
        {
            try
            {
                var result = repository.InsertUpdateSalida(obj);
                return new Response<int>(result);
            }
            catch (Exception ex)
            {
                return new Response<int>(ex);
            }
        }

        public Response<int> DeleteSalida(Proceso obj)
        {
            try
            {
                var result = repository.DeleteSalida(obj);
                return new Response<int>(result);
            }
            catch (Exception ex)
            {
                return new Response<int>(ex);
            }
        }

    }
}
