using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;

namespace WebControlPatrimonial.Controllers
{
    public class CombosController : Controller
    {

        public JsonResult GetRol()
        {
            var bussingLogic = new CP.BusinessLogic.BLCombos();
            var response = bussingLogic.GetRol();

            return Json(response);
        }

        public JsonResult GetUnidadOrganica()
        {
            var bussingLogic = new CP.BusinessLogic.BLCombos();
            var response = bussingLogic.GetUnidadOrganica();

            return Json(response);
        }

        public JsonResult GetSede()
        {
            var bussingLogic = new CP.BusinessLogic.BLCombos();
            var response = bussingLogic.GetSede();

            return Json(response);
        }

        public JsonResult GetTipoBien()
        {
            var bussingLogic = new CP.BusinessLogic.BLCombos();
            var response = bussingLogic.GetTipoBien();

            return Json(response);
        }

    }
}