using CP.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace WebControlPatrimonial.Controllers
{
    public class BienController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetBien(Bien obj)
        {
            var ctx = HttpContext.GetOwinContext();
            var tipoUsuario = ctx.Authentication.User.Claims.FirstOrDefault().Value;
            obj.Auditoria = new Auditoria
            {
                TipoUsuario = tipoUsuario
            };

            string draw = Request.Form.GetValues("draw")[0];
            int inicio = Convert.ToInt32(Request.Form.GetValues("start").FirstOrDefault());
            int fin = Convert.ToInt32(Request.Form.GetValues("length").FirstOrDefault());

            obj.Operacion = new Operacion
            {
                Inicio = (inicio / fin),
                Fin = fin
            };

            var bussingLogic = new CP.BusinessLogic.BLBien(); 
            var response = bussingLogic.GetBien(obj);

            var Datos = response.Data;
            int totalRecords = Datos.Any() ? Datos.FirstOrDefault().Operacion.TotalRows : 0;
            int recFilter = totalRecords;

            var result = (new
            {
                draw = Convert.ToInt32(draw),
                recordsTotal = totalRecords,
                recordsFiltered = recFilter,
                data = Datos
            });

            return Json(result);
        }

        public JsonResult InsertUpdateBien(Bien obj)
        {
            var bussingLogic = new CP.BusinessLogic.BLBien();
            var Identity = ((ClaimsIdentity)Thread.CurrentPrincipal.Identity);
            var Usuario_Id = Identity.Claims.Where(x => x.Type == ClaimTypes.UserData).FirstOrDefault().ValueType;
            obj.Auditoria = new Auditoria
            {
                Usuario_Id = Convert.ToInt32(Usuario_Id),
                UsuarioCreacion = User.Identity.Name
            };

            var response = bussingLogic.ValidarSerie(obj);

            if (!response.Data)
            {
                bussingLogic.InsertUpdateBien(obj);
            }

            return Json(response);
        }

        public JsonResult DeleteBien(Bien obj)
        {
            var bussingLogic = new CP.BusinessLogic.BLBien();
            obj.Auditoria = new Auditoria
            {
                UsuarioCreacion = User.Identity.Name,
            };
            var response = bussingLogic.DeleteBien(obj);

            return Json(response);
        }

        public void DescargarBien(int Bien_Id)
        {   
            var bussingLogic = new CP.BusinessLogic.BLBien();
            Bien bien = new Bien()
            {
                Bien_Id = Bien_Id,
                TipoBien = new TipoBien(),
                Estado = new Estado(),
                Auditoria = new Auditoria()
                {
                    TipoUsuario = HttpContext.GetOwinContext().Authentication.User.Claims.FirstOrDefault().Value,
                    UsuarioCreacion = User.Identity.Name
                },
                Operacion = new Operacion()
                {
                    Inicio = 0,
                    Fin = 1
                }
            };
            var response = bussingLogic.DescargarBien(bien);

            HttpContext.Response.AddHeader("content-disposition", "attachment; filename=" + response.Data.Nombrearchivo + ".pdf");
            Response.ContentType = "application/pdf";
            Response.ClearContent();
            Response.OutputStream.Write(response.Data.Arraybytes, 0, response.Data.Arraybytes.Length);
            Response.End();
        }
    }
}
