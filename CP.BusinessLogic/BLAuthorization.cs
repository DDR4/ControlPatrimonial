using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CP.Entities;

namespace CP.BusinessLogic
{
    public class BLAuthorization
    {
        private DataAccess.DAAuthorization repository;

        public BLAuthorization()
        {
            repository = new DataAccess.DAAuthorization();
        }
        public async Task<Common.Response<Usuario>> Authorize(Usuario credential)
        {
            try
            {
                var result = await repository.Authorize(credential);

                if (result == null)
                {
                    return new Common.Response<Usuario>("Dni o Contraseña Incorrectos.");
                }
                else if (result.Estado.Estado_Id == 2)
                {
                    return new Common.Response<Usuario>("Usuario Inactivo.");
                }

                return new Common.Response<Usuario>(result);
            }
            catch (Exception ex)
            {
                return new Common.Response<Usuario>(ex);
            }
        }
    }
}
