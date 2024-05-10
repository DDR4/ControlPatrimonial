using CP.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
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
            obj.Auditoria = new Auditoria
            {
                UsuarioCreacion = User.Identity.Name,
            };
            var response = bussingLogic.InsertUpdateBien(obj);

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
    }
}
