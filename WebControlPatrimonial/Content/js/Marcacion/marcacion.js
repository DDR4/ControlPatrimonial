var Marcacion = (function ($, win, doc) {

    var $btnFechaActual = $('#btnFechaActual');
    var $txtFechaActual = $('#txtFechaActual');

    var $txtMarcarIngreso = $('#txtMarcarIngreso');
    var $txtMarcarSalida = $('#txtMarcarSalida');

    var $btnMarcarIngreso = $('#btnMarcarIngreso');
    var $txtMarcarHoraIngreso = $('#txtMarcarHoraIngreso');
    var $btnMarcarSalida = $('#btnMarcarSalida');
    var $txtMarcarHoraSalida = $('#txtMarcarHoraSalida');
                                        
    var Message = {
        ObtenerTipoBusqueda: "Obteniendo los tipos de busqueda, Por favor espere...",
        GuardarSuccess: "Los datos se guardaron satisfactoriamente"
    };

    // Constructor
    $(Initialize);

    var fecha = new Date();
    var dia = ('0' + fecha.getDate()).slice(-2);
    var mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    var año = fecha.getFullYear();
    var hora = ('0' + fecha.getHours()).slice(-2);
    var minuto = ('0' + (fecha.getMinutes())).slice(-2);
    var segundo = ('0' + fecha.getSeconds()).slice(-2);

    // Implementacion del constructor
    function Initialize() {
        $btnFechaActual.click($btnFechaActual_click);
        $txtFechaActual.html(dia + "/" + mes + "/" + año + " " + hora + ":" + minuto + ":" + segundo);
        GetHorarios();
        GetMarcaHorarios();
        $btnMarcarIngreso.click($btnMarcarIngreso_click);
        $btnMarcarSalida.click($btnMarcarSalida_click);
    }

    function ActualizarFecha() {
        fecha = new Date();
        dia = ('0' + fecha.getDate()).slice(-2);
        mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
        año = fecha.getFullYear();
        hora = ('0' + fecha.getHours()).slice(-2);
        minuto = ('0' + (fecha.getMinutes())).slice(-2);
        segundo = ('0' + fecha.getSeconds()).slice(-2);
    }

    function $btnFechaActual_click() {
        ActualizarFecha();
        $txtFechaActual.html(dia + "/" + mes + "/" + año + " " + hora + ":" + minuto + ":" + segundo);
    }

    function GetHorarios() {
        var method = "POST";
        var url = "Marcacion/GetHorarios";
        var fnDoneCallback = function (data) {
            if (data !== null) {
                $txtMarcarIngreso.html(data.Data.Hora_Ingreso);
                $txtMarcarSalida.html(data.Data.Hora_Salida);
            }
          
        };
        app.CallAjax(method, url, null, fnDoneCallback, null, null, null);
    }

    function GetMarcaHorarios() {
        var method = "POST";
        var url = "Marcacion/GetMarcaHorarios";
        var fnDoneCallback = function (data) {
            if (data.Data !== null) {
                $txtMarcarHoraIngreso.val(app.ConvertDatetime(data.Data.Marcar_Hora_Ingreso));
                $txtMarcarHoraSalida.val(app.ConvertDatetime(data.Data.Marcar_Hora_Salida));
            }

        };
        app.CallAjax(method, url, null, fnDoneCallback, null, null, null);
    }

    function $btnMarcarIngreso_click() {
        ActualizarFecha();
        var fechaIngreso = dia + "/" + mes + "/" + año + " " + hora + ":" + minuto + ":" + segundo;

        var obj = {
            "Turno": {
                "Marcar_Hora_Ingreso": fechaIngreso
            }
        };
        var method = "POST";
        var data = obj;
        var url = "Marcacion/MarcarIngreso";
        var fnDoneCallback = function (data) {
            app.Message.Success("Grabar", Message.GuardarSuccess, "Aceptar", null);
            $txtMarcarHoraIngreso.val(app.ConvertDatetime(data.Data));
        };
        app.CallAjax(method, url, data, fnDoneCallback, null, null, null);

    }

    function $btnMarcarSalida_click() { 
        ActualizarFecha();
        var fechaSalida = dia + "/" + mes + "/" + año + " " + hora + ":" + minuto + ":" + segundo;

        var obj = {
            "Turno": {
                "Marcar_Hora_Salida": fechaSalida
            }
        };
        var method = "POST";
        var data = obj;
        var url = "Marcacion/MarcarSalida";
        var fnDoneCallback = function (data) {
            app.Message.Success("Grabar", Message.GuardarSuccess, "Aceptar", null);
            $txtMarcarHoraSalida.val(app.ConvertDatetime(data.Data));
        };
        app.CallAjax(method, url, data, fnDoneCallback, null, null, null);

    }                                            
         

    return {

    };


})(window.jQuery, window, document);