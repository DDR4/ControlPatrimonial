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
    public class BLTransferencia
    {
        private DATransferencia repository;

        public BLTransferencia()
        {
            repository = new DATransferencia();
        }

        public Response<IEnumerable<Proceso>> GetTransferencia(Proceso obj)
        {
            try
            {
                var result = repository.GetTransferencia(obj);
                return new Response<IEnumerable<Proceso>>(result);
            }
            catch (Exception ex)
            {
                return new Response<IEnumerable<Proceso>>(ex);
            }
        }

        public Response<int> InsertUpdateTransferencia(Proceso obj)
        {
            try
            {
                var result = repository.InsertUpdateTransferencia(obj);
                return new Response<int>(result);
            }
            catch (Exception ex)
            {
                return new Response<int>(ex);
            }
        }

        public Response<int> DeleteTransferencia(Proceso obj)
        {
            try
            {
                var result = repository.DeleteTransferencia(obj);
                return new Response<int>(result);
            }
            catch (Exception ex)
            {
                return new Response<int>(ex);
            }
        }
        public Response<IEnumerable<Bien>> GetBienTransferencia(Proceso obj)
        {
            try
            {
                var result = repository.GetBienTransferencia(obj);
                return new Response<IEnumerable<Bien>>(result);
            }
            catch (Exception ex)
            {
                return new Response<IEnumerable<Bien>>(ex);
            }
        }

    }
}
