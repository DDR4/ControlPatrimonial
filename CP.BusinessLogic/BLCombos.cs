using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CP.Common;
using CP.DataAccess;
using CP.Entities;

namespace CP.BusinessLogic
{
    public class BLCombos
    {
        private DACombos repository;

        public BLCombos()
        {
            repository = new DACombos();
        }

        public Response<IEnumerable<Rol>> GetRol()
        {
            try
            {
                var result = repository.GetRol();
                return new Response<IEnumerable<Rol>>(result);
            }
            catch (Exception ex)
            {
                return new Response<IEnumerable<Rol>>(ex);
            }
        }

        public Response<IEnumerable<UnidadOrganica>> GetUnidadOrganica()
        {
            try
            {
                var result = repository.GetUnidadOrganica();
                return new Response<IEnumerable<UnidadOrganica>>(result);
            }
            catch (Exception ex)
            {
                return new Response<IEnumerable<UnidadOrganica>>(ex);
            }
        }

        public Response<IEnumerable<Sede>> GetSede()
        {
            try
            {
                var result = repository.GetSede();
                return new Response<IEnumerable<Sede>>(result);
            }
            catch (Exception ex)
            {
                return new Response<IEnumerable<Sede>>(ex);
            }
        }

    }
}
