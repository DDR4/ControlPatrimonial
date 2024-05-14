using CP.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;

namespace WebControlPatrimonial.Controllers
{
    public class TransferenciaController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetTransferencia(Proceso obj)
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

            var bussingLogic = new CP.BusinessLogic.BLTransferencia();
            var response = bussingLogic.GetTransferencia(obj);

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

        public JsonResult InsertUpdateTransferencia(Proceso obj)
        {
            var bussingLogic = new CP.BusinessLogic.BLTransferencia();
            var Identity = ((ClaimsIdentity)Thread.CurrentPrincipal.Identity);
            var Usuario_Id = Identity.Claims.Where(x => x.Type == ClaimTypes.UserData).FirstOrDefault().ValueType;
            obj.Auditoria = new Auditoria
            {
                Usuario_Id = Convert.ToInt32(Usuario_Id),
                UsuarioCreacion = User.Identity.Name
            };

           var Bienesxml = obj.Bienes.Select(i => new XElement("Bien",
           new XElement("BienId", i.Bien_Id)));
           obj.BienesXML = new XDocument(new XDeclaration("1.0", "utf-8", "yes"), new XElement("Bienes", Bienesxml));

           var response = bussingLogic.InsertUpdateTransferencia(obj);

           return Json(response);
        }

        public JsonResult DeleteTransferencia(Proceso obj)
        {
            var bussingLogic = new CP.BusinessLogic.BLTransferencia();
            obj.Auditoria = new Auditoria
            {
                UsuarioCreacion = User.Identity.Name,
            };
            var response = bussingLogic.DeleteTransferencia(obj);

            return Json(response);
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

        public JsonResult GetBienTransferencia(Proceso obj)
        {
            var bussingLogic = new CP.BusinessLogic.BLTransferencia();
            var response = bussingLogic.GetBienTransferencia(obj);

            return Json(response);
        }
    }
}