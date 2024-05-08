var HorasTrabajadas = (function ($, win, doc) {

    var $tblListadoNumeroHoras = $('#tblListadoNumeroHoras');

    var $cboTipoBusqueda = $('#cboTipoBusqueda');
    var $tipoFecha = $('#tipoFecha');
    var $txtFecha = $('#txtFecha');
    var $tipoNombres = $('#tipoNombres');
    var $txtNombres = $('#txtNombres');
    var $btnBuscar = $('#btnBuscar');
    var $btnNuevoDescansoMedico = $('#btnNuevoDescansoMedico');
    var $modalDescansoMedico = $('#modalDescansoMedico');
    var $txtModalFechaDescansoInicio = $('#txtModalFechaDescansoInicio');
    var $txtModalFechaDescansoFin = $('#txtModalFechaDescansoFin');
    var $txtModalNombre = $('#txtModalNombre');
    var $btnBuscarModal = $('#btnBuscarModal');
    var $tblTrabajadores = $('#tblTrabajadores');
    var $btnGuardar = $('#btnGuardar');

    var Message = {
        ObtenerTipoBusqueda: "Obteniendo los tipos de busqueda, Por favor espere...",
        GuardarSuccess: "Los datos se guardaron satisfactoriamente"
    };

    var Global = {
        Trabajador_Id: null
    };

    // Constructor
    $(Initialize);                        

    // Implementacion del constructor
    function Initialize() {          
        GetHorasTrabajadas();         
        $cboTipoBusqueda.change($cboTipoBusqueda_change);
        $btnBuscar.click($btnBuscar_click);
        $txtFecha.datepicker({
            endDate: "today",
            todayHighlight: true
        });    
        $txtModalFechaDescansoInicio.datepicker({
            endDate: "today",
            todayHighlight: true
        }); 
        $txtModalFechaDescansoFin.datepicker({
            endDate: "today",
            todayHighlight: true
        }); 
        $btnNuevoDescansoMedico.click($btnNuevoDescansoMedico_click);
        $btnBuscarModal.click($btnBuscarModal_click);
        $btnGuardar.click($btnGuardar_click);

        var table = $tblTrabajadores.DataTable();

        $('#tblTrabajadores tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                Global.Trabajador_Id = null;
            } else {          
                var row = table.row(this).index();
                var data = app.GetValueRowCellOfDataTable($tblTrabajadores, row);
                Global.Trabajador_Id = data.Trabajador_Id;
            }
        });
    }           

    function GetHorasTrabajadas() {             

        var parms = {
            Trabajador_Id: null,
            HorasTrabajadas: { Periodo: $txtFecha.val() },
            Nombres: $txtNombres.val()
        };

        var url = "HorasTrabajadas/GetHorasTrabajadas";

        var columns = [
            { data: "Nombres" },
            { data: "HorasTrabajadas.Horas_Trabajadas" },
            { data: "HorasTrabajadas.Horas_Tardanzas" },
            { data: "HorasTrabajadas.Periodo" },
            { data: "HorasTrabajadas.Tipo" },
            { data: "HorasTrabajadas.Tipo" }
        ];
        var columnDefs = [                   
            {
                "targets": [4],
                'render': function (data, type, full, meta) {
                    if (data === 1) {
                        return "Horas Trabajadas";
                    } else return "Descanso Medico";

                }
            },
            {
                "targets": [5],
                'render': function (data, type, full, meta) {
                    if (data === 2) {
                        return "<center>" +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Eliminar" href="javascript:HorasTrabajadas.EliminarDescansoMedico(' + meta.row + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>' +
                            "</center> ";
                    } else return "";

                }
            }
        ];

        var filters = {
            pageLength: app.Defaults.TablasPageLength
        };
        app.FillDataTableAjaxPaging($tblListadoNumeroHoras, url, parms, columns, columnDefs, filters, null, null);

    }     

    function $cboTipoBusqueda_change() {
        var codSelec = $(this).val();
        $tipoNombres.hide();
        $tipoFecha.hide();
 
        $txtNombres.val("");
        $txtFecha.val("");           

        if (codSelec === "1") {
            $tipoNombres.show();
        }
        else if (codSelec === "2") {
            $tipoFecha.show();
        }

    }

    function $btnBuscar_click() {
        GetHorasTrabajadas();
    }   

    function $btnNuevoDescansoMedico_click() {
        $modalDescansoMedico.modal();
        GetTrabajadores();          
    }

    function $btnBuscarModal_click() {
        GetTrabajadores();
    }

    function GetTrabajadores() {

        var parms = {
            Trabajador_Id: null,
            Nombres: $txtModalNombre.val(),
            Estado: 1,
            TipoBusqueda: 1
        };

        var url = "HorasTrabajadas/GetTrabajador";

        var columns = [
            { data: "Nombres" }
        ];

        var filters = {
            pageLength: app.Defaults.TablasPageLength
        };
        app.FillDataTableAjaxPaging($tblTrabajadores, url, parms, columns, null, filters, null, null);

    }    

    function $btnGuardar_click() {
        var obj = {
            "Trabajador_Id": Global.Trabajador_Id,
            "HorasTrabajadas": {
                "FechaInicio": $txtModalFechaDescansoInicio.val(),
                "FechaFin": $txtModalFechaDescansoFin.val()
            }             
        };

        var method = "POST";
        var data = obj;
        var url = "HorasTrabajadas/CrearDescansoMedico";

        var fnDoneCallback = function () {
            app.Message.Success("Grabar", Message.GuardarSuccess, "Aceptar", null);
            $modalDescansoMedico.modal('hide');
            GetHorasTrabajadas();
        };
        app.CallAjax(method, url, data, fnDoneCallback);
    }

    function EliminarDescansoMedico(row) {
        var fnAceptarCallback = function () {
            var data = app.GetValueRowCellOfDataTable($tblListadoNumeroHoras, row);

            var obj = {
                "Horas_Trabajadas_Id": data.HorasTrabajadas.Horas_Trabajadas_Id
            };

            var method = "POST";
            var url = "HorasTrabajadas/EliminarDescansoMedico";
            var rsdata = obj;
            var fnDoneCallback = function (data) {
                GetHorasTrabajadas();
            };
            app.CallAjax(method, url, rsdata, fnDoneCallback, null, null, null);
        };
        app.Message.Confirm("Aviso", "Esta seguro que desea eliminar el area?", "Aceptar", "Cancelar", fnAceptarCallback, null);
    }

    return {
        EliminarDescansoMedico : EliminarDescansoMedico
    };


})(window.jQuery, window, document);