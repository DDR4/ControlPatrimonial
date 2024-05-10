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
    public class BLBien
    {
        private DABien repository;

        public BLBien()
        {
            repository = new DABien();
        }

        public Response<IEnumerable<Bien>> GetBien(Bien obj)
        {
            try
            {
                var result = repository.GetBien(obj);
                return new Response<IEnumerable<Bien>>(result);
            }
            catch (Exception ex)
            {
                return new Response<IEnumerable<Bien>>(ex);
            }
        }

        public Response<int> InsertUpdateBien(Bien obj)
        {
            try
            {
                var result = repository.InsertUpdateBien(obj);
                return new Response<int>(result);
            }
            catch (Exception ex)
            {
                return new Response<int>(ex);
            }
        }

        public Response<int> DeleteBien(Bien obj)
        {
            try
            {
                var result = repository.DeleteBien(obj);
                return new Response<int>(result);
            }
            catch (Exception ex)
            {
                return new Response<int>(ex);
            }
        }

    }
}
