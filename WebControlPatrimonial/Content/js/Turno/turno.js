var Turno = (function ($, win, doc) {

    var $tblListadoTurno = $('#tblListadoTurno');
    var $btnNuevaTurno = $('#btnNuevaTurno');

    var $cboTipoBusqueda = $('#cboTipoBusqueda');
    var $tipoDescripcion = $('#tipoDescripcion');
    var $txtDescripcion = $('#txtDescripcion');
    var $tipoEstado = $('#tipoEstado');
    var $cboEstado = $('#cboEstado');
    var $btnBuscar = $('#btnBuscar');

    //Modal
    var $modalTurno = $('#modalTurno');  
    var $titleModalTurno = $('#titleModalTurno');
    var $txtModalDescripcion = $('#txtModalDescripcion');  
    var $txtModalHoraIngreso = $('#txtModalHoraIngreso');  
    var $txtModalHoraSalida = $('#txtModalHoraSalida');  
    var $cboModalEstado = $('#cboModalEstado'); 
    var $btnGuardar = $('#btnGuardar');
                                        
    var Message = {
        ObtenerTipoBusqueda: "Obteniendo los tipos de busqueda, Por favor espere...",
        GuardarSuccess: "Los datos se guardaron satisfactoriamente"
    };

    var Global = {
        Turno_Id: null
    };

    // Constructor
    $(Initialize);       

    var fecha = new Date();
    var hora = ('0' + fecha.getHours()).slice(-2);
    var minuto = ('0' + (fecha.getMinutes())).slice(-2);

    // Implementacion del constructor
    function Initialize() {          
        GetTurnos();         
        $cboTipoBusqueda.change($cboTipoBusqueda_change);
        $btnBuscar.click($btnBuscar_click);         
        $btnGuardar.click($btnGuardar_click);
        $btnNuevaTurno.click($btnNuevaTurno_click);

        $txtModalHoraIngreso.timepicker({
            showInputs: false,
            showMeridian: false,
            defaultTime:"12:00"
        });

        $txtModalHoraSalida.timepicker({
            showInputs: false,
            showMeridian: false,
            defaultTime: "12:00"
        });
    }           

    function $btnNuevaTurno_click() {
        $titleModalTurno.html("Nueva Turno");
        $modalTurno.modal();
        Global.Turno_Id = null;
        $txtModalDescripcion.val("");
        $cboModalEstado.val(1);
        app.Event.Disabled($cboModalEstado);

    }

    function GetTurnos() {             

        var parms = {
            Descripcion: $txtDescripcion.val(),
            Estado: $cboEstado.val()
        };

        var url = "Turno/GetTurno";

        var columns = [
            { data: "Descripcion" },
            { data: "Hora_Ingreso" },
            { data: "Hora_Salida" },
            { data: "Estado" },
            { data: "Auditoria.TipoUsuario" }
        ];
        var columnDefs = [ 
            {
                "targets": [3],
                'render': function (data, type, full, meta) {
                    if (data === 1) {
                        return "Activo";
                    } else return "Inactivo";

                }
            },
            {
                "targets": [4],
                "visible": true,
                "orderable": false,
                "className": "text-center",
                'render': function (data, type, full, meta) {
                    if (data === "1") {
                        return "<center>" +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Editar" href="javascript:Turno.EditarTurno(' + meta.row + ');"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>' +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Eliminar" href="javascript:Turno.EliminarTurno(' + meta.row + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>' +
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
        app.FillDataTableAjaxPaging($tblListadoTurno, url, parms, columns, columnDefs, filters, null, null);

    }     

    function $cboTipoBusqueda_change() {
        var codSelec = $(this).val();
        $tipoDescripcion.hide();
        $tipoEstado.hide();

        $txtDescripcion.val("");
        $cboEstado.val(0);
       

        if (codSelec === "1") {
            $tipoDescripcion.show();
        }
        else if (codSelec === "2") {
            $tipoEstado.show();
        }

    }

    function $btnGuardar_click() {
        InsertUpdateTurno();
    }

    function InsertUpdateTurno() {

        var obj = {
            "Turno_Id": Global.Turno_Id,
            "Descripcion": $txtModalDescripcion.val(),       
            "Hora_Ingreso": $txtModalHoraIngreso.val(),
            "Hora_Salida": $txtModalHoraSalida.val(),
            "Estado": $cboModalEstado.val()
        };

        var method = "POST";
        var data = obj;
        var url = "Turno/InsertUpdateTurno";

        var fnDoneCallback = function (data) {
            app.Message.Success("Grabar", Message.GuardarSuccess, "Aceptar", null);
            $modalTurno.modal('hide');
            GetTurnos();
        };
        app.CallAjax(method, url, data, fnDoneCallback);
    }


    function $btnBuscar_click() {
        GetTurnos();
    }             

    function EditarTurno(row) {
        var data = app.GetValueRowCellOfDataTable($tblListadoTurno, row);
        $titleModalTurno.html("Editar Turno");

        $modalTurno.modal();
        Global.Turno_Id = data.Turno_Id;
        $txtModalDescripcion.val(data.Descripcion);
        $txtModalHoraIngreso.val(data.Hora_Ingreso);
        if (data.Hora_Ingreso !== null) {
            $txtModalHoraIngreso.timepicker('setTime', data.Hora_Ingreso.substring(0, 2) + ":" + data.Hora_Ingreso.substring(3, 5));
        }               
        $txtModalHoraSalida.val(data.Hora_Salida);
        if (data.Hora_Salida !== null) {
            $txtModalHoraSalida.timepicker('setTime', data.Hora_Salida.substring(0, 2) + ":" + data.Hora_Salida.substring(3, 5));
        }                                                  
        $cboModalEstado.val(data.Estado).trigger('change');
        app.Event.Enable($cboModalEstado);
    }

    function EliminarTurno(row) {
        var fnAceptarCallback = function () {
            var data = app.GetValueRowCellOfDataTable($tblListadoTurno, row);

            var obj = {
                "Turno_Id": data.Turno_Id
            };

            var method = "POST";
            var url = "Turno/DeleteTurno";
            var rsdata = obj;
            var fnDoneCallback = function (data) {
                GetTurnos();
            };
            app.CallAjax(method, url, rsdata, fnDoneCallback, null, null, null);
        };
        app.Message.Confirm("Aviso", "Esta seguro que desea eliminar el Turno?", "Aceptar", "Cancelar", fnAceptarCallback, null);
    }

    return {
        EditarTurno: EditarTurno,
        EliminarTurno: EliminarTurno
    };


})(window.jQuery, window, document);