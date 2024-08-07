﻿using CP.Common;
using CP.DataAccess;
using CP.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CP.BusinessLogic
{
    public class BLUsuario
    {
        private DAUsuario repository;

        public BLUsuario()
        {
            repository = new DAUsuario();
        }

        public Response<IEnumerable<Usuario>> GetUsuario(Usuario obj)
        {
            try
            {
                var result = repository.GetUsuario(obj);
                return new Response<IEnumerable<Usuario>>(result);
            }
            catch (Exception ex)
            {
                return new Response<IEnumerable<Usuario>>(ex);
            }
        }

        public Response<int> InsertUpdateUsuario(Usuario obj)
        {
            try
            {
                var result = repository.InsertUpdateUsuario(obj);
                return new Response<int>(result);
            }
            catch (Exception ex)
            {
                return new Response<int>(ex);
            }
        }

        public Response<int> DeleteUsuario(Usuario obj)
        {
            try
            {
                var result = repository.DeleteUsuario(obj);
                return new Response<int>(result);
            }
            catch (Exception ex)
            {
                return new Response<int>(ex);
            }
        }

        public Response<bool> ValidarDni(Usuario obj)
        {
            try
            {
                var result = repository.ValidarDni(obj);
                return new Response<bool>(result);
            }
            catch (Exception ex)
            {
                return new Response<bool>(ex);
            }
        }

        public Response<Usuario> GetUsuarioDni(Usuario obj)
        {
            try
            {
                var result = repository.GetUsuarioDni(obj);
                return new Response<Usuario>(result);
            }
            catch (Exception ex)
            {
                return new Response<Usuario>(ex);
            }
        }

    }
}
