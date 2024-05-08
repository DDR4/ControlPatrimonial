var Vacaciones = (function ($, win, doc) {

    var $tblListadoVacaciones = $('#tblListadoVacaciones');

    var $cboTipoBusqueda = $('#cboTipoBusqueda');
    var $tipoNombres = $('#tipoNombres ');
    var $txtNombres = $('#txtNombres');
    var $btnBuscar = $('#btnBuscar');

    var $btnActualizacionMasiva = $('#btnActualizacionMasiva');

    //Modal
    var $modalDetalleVacaciones = $('#modalDetalleVacaciones');
    var $tblListadoDetalleVacaciones = $('#tblListadoDetalleVacaciones');
    var $modalCrearVacaciones = $('#modalCrearVacaciones');
    var $txtModalFechaInicio = $('#txtModalFechaInicio');  
    var $txtModalFechaFin = $('#txtModalFechaFin'); 
    var $btnGuardar = $('#btnGuardar');

    var Message = {
        ObtenerTipoBusqueda: "Obteniendo los tipos de busqueda, Por favor espere...",
        GuardarSuccess: "Los datos se guardaron satisfactoriamente"
    };

    var Global = {
        Vacaciones_Id: null
    };

    // Constructor
    $(Initialize);

    // Implementacion del constructor
    function Initialize() {
        GetVacaciones();
        $cboTipoBusqueda.change($cboTipoBusqueda_change);
        $btnBuscar.click($btnBuscar_click);
        $btnActualizacionMasiva.click($btnActualizacionMasiva_click);
        $txtModalFechaInicio.datepicker({
            startDate: "yesterday",
            todayHighlight: true
        });        
        $txtModalFechaFin.datepicker({
            startDate: "yesterday",
            todayHighlight: true
        });   
        $btnGuardar.click($btnGuardar_click);
    }

    function $btnActualizacionMasiva_click() {

        var method = "POST";
        var url = "Vacaciones/GenerarVacacionesMasivo";

        var fnDoneCallback = function (data) {
            app.Message.Success("Grabar", Message.GuardarSuccess, "Aceptar", null);
            GetVacaciones();
        };
        app.CallAjax(method, url, null, fnDoneCallback);

    }

    function GetVacaciones() {

        var parms = {
            NombreApellido: $txtNombres.val()
        };

        var url = "Vacaciones/GetVacaciones";

        var columns = [
            { data: "NombreApellido" },
            { data: "DiasDisponibles" },
            { data: "DiasTotales" },
            { data: "Auditoria.TipoUsuario" }
        ];
        var columnDefs = [
            {
                "targets": [3],
                "visible": true,
                "orderable": false,
                "className": "text-center",
                'render': function (data, type, full, meta) {
                    if (data === "1") {
                        return "<center>" +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Detalle" href="javascript:Vacaciones.DetalleVacaciones(' + meta.row + ');"><i class="fa fa-eye" aria-hidden="true"></i></a>' +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Detalle" href="javascript:Vacaciones.CrearVacaciones(' + meta.row + ');"><i class="fa fa-plus" aria-hidden="true"></i></a>' +
                            "</center> ";
                    } else {
                        return "";
                    }
                }
            }

        ];

        var filters = {
            pageLength: app.Defaults.TablasPageLength
        };
        app.FillDataTableAjaxPaging($tblListadoVacaciones, url, parms, columns, columnDefs, filters, null, null);

    }

    function $cboTipoBusqueda_change() {
        var codSelec = $(this).val();
        $tipoNombres.hide();

        $txtNombres.val("");

        if (codSelec === "1") {
            $tipoNombres.show();
        }

    }

    function $btnGuardar_click() {
        if (ValidarInsertar()) {
            InsertarVacaciones();
        }
    }

    function InsertarVacaciones() {

        var obj = {
            "Trabajador_Id": Global.Trabajador_Id,
            "FechaInicio": app.ConvertDateRelease($txtModalFechaInicio.val()),
            "FechaFin": app.ConvertDateRelease($txtModalFechaFin.val())   
        };

        var method = "POST";
        var data = obj;
        var url = "Vacaciones/InsertarDetalleVacaciones";

        var fnDoneCallback = function (data) {
            app.Message.Success("Grabar", Message.GuardarSuccess, "Aceptar", null);
            $modalCrearVacaciones.modal('hide');
            GetVacaciones();
        };
        app.CallAjax(method, url, data, fnDoneCallback);
    }


    function $btnBuscar_click() {
        GetVacaciones();
    }

    function DetalleVacaciones(row) {
        var data = app.GetValueRowCellOfDataTable($tblListadoVacaciones, row);

        var obj = {
            "Trabajador_Id": data.Trabajador.Trabajador_Id,
            "HorasTrabajadas": {
                "Periodo" : null
            }
        };

        var method = "POST";
        var url = "Vacaciones/DetalleVacaciones";
        var pdata = obj;
        var fnDoneCallback = function (data) {
            $modalDetalleVacaciones.modal();
            LoadDetalleVacaciones(data);
        };                                                             

        app.CallAjax(method, url, pdata, fnDoneCallback, null, null, null);
    }

    function LoadDetalleVacaciones(data) {
        var columns = [
            { data: "FechaInicio" },
            { data: "FechaFin" },
            { data: "DiasVacaciones" }
        ];

        var columnDefs = [
            {
                "targets": [0,1],
                'render': function (data, type, full, meta) {
                    return '' + app.ConvertDate(data) + '';
                }
            }
        ];

        var filtros = {
            pageLength: 10
        };
        app.FillDataTable($tblListadoDetalleVacaciones, data, columns, columnDefs, "#tblListadoDetalleVacaciones", filtros, null, null, null, null, true);
    }

    function CrearVacaciones(row) {
        var data = app.GetValueRowCellOfDataTable($tblListadoVacaciones, row);
        $modalCrearVacaciones.modal();     
        Global.Trabajador_Id = data.Trabajador.Trabajador_Id;
        $txtModalFechaInicio.val("");
        $txtModalFechaFin.val("");
    }

    function ValidarInsertar() {
        var validar = true;
       
        var fechaInicio = app.ConvertStringDate($txtModalFechaInicio.val());
        var fechaFin = app.ConvertStringDate($txtModalFechaFin.val());

        if (fechaFin < fechaInicio) {
            app.Message.Info("Aviso", "La Fecha de Inicio debe ser menor a la Fecha Fin", "Aceptar", null);
            validar = false;
        }

        return validar;
    }

    return {
        DetalleVacaciones: DetalleVacaciones,
        CrearVacaciones: CrearVacaciones
    };


})(window.jQuery, window, document);