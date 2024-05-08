var Cargo = (function ($, win, doc) {

    var $tblListadoCargo = $('#tblListadoCargo');
    var $btnNuevaCargo = $('#btnNuevaCargo');

    var $cboTipoBusqueda = $('#cboTipoBusqueda');
    var $tipoDescripcion = $('#tipoDescripcion');
    var $txtDescripcion = $('#txtDescripcion');
    var $tipoEstado = $('#tipoEstado');
    var $cboEstado = $('#cboEstado');
    var $btnBuscar = $('#btnBuscar');

    //Modal
    var $modalCargo = $('#modalCargo');  
    var $titleModalCargo = $('#titleModalCargo');
    var $txtModalDescripcion = $('#txtModalDescripcion');  
    var $txtModalSueldo = $('#txtModalSueldo'); 
    var $cboModalEstado = $('#cboModalEstado'); 
    var $btnGuardar = $('#btnGuardar');
                                        
    var Message = {
        ObtenerTipoBusqueda: "Obteniendo los tipos de busqueda, Por favor espere...",
        GuardarSuccess: "Los datos se guardaron satisfactoriamente"
    };

    var Global = {
        Cargo_Id: null
    };

    // Constructor
    $(Initialize);                        

    // Implementacion del constructor
    function Initialize() {          
        GetCargos();         
        $cboTipoBusqueda.change($cboTipoBusqueda_change);
        $btnBuscar.click($btnBuscar_click);         
        $btnGuardar.click($btnGuardar_click);
        $btnNuevaCargo.click($btnNuevaCargo_click);
    }           

    function $btnNuevaCargo_click() {
        $titleModalCargo.html("Nueva Cargo");
        $modalCargo.modal();
        Global.Cargo_Id = null;
        $txtModalDescripcion.val("");
        $txtModalSueldo.val("");
        $cboModalEstado.val(1);
        app.Event.Disabled($cboModalEstado);            
    }

    function GetCargos() {             

        var parms = {
            Descripcion: $txtDescripcion.val(),
            Estado: $cboEstado.val()
        };

        var url = "Cargo/GetCargo";

        var columns = [
            { data: "Descripcion" },
            { data: "Sueldo" },
            { data: "Estado" },
            { data: "Auditoria.TipoUsuario" }
        ];
        var columnDefs = [ 
            {
                "targets": [1],
                "className": "text-right",
                'render': function (data, type, full, meta) {
                    return '' + app.FormatNumber(data) + '';
                }
            },
            {
                "targets": [2],
                'render': function (data, type, full, meta) {
                    if (data === 1) {
                        return "Activo";
                    } else return "Inactivo";

                }
            },
            {
                "targets": [3],
                "visible": true,
                "orderable": false,
                "className": "text-center",
                'render': function (data, type, full, meta) {
                    if (data === "1") {
                        return "<center>" +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Editar" href="javascript:Cargo.EditarCargo(' + meta.row + ');"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>' +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Eliminar" href="javascript:Cargo.EliminarCargo(' + meta.row + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>' +
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
        app.FillDataTableAjaxPaging($tblListadoCargo, url, parms, columns, columnDefs, filters, null, null);

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
        InsertUpdateCargo();
    }

    function InsertUpdateCargo() {

        var obj = {
            "Cargo_Id": Global.Cargo_Id,    
            "Descripcion": $txtModalDescripcion.val(),   
            "Sueldo": $txtModalSueldo.val(),
            "Estado": $cboModalEstado.val()
        };

        var method = "POST";
        var data = obj;
        var url = "Cargo/InsertUpdateCargo";

        var fnDoneCallback = function (data) {
            app.Message.Success("Grabar", Message.GuardarSuccess, "Aceptar", null);
            $modalCargo.modal('hide');
            GetCargos();
        };
        app.CallAjax(method, url, data, fnDoneCallback);
    }


    function $btnBuscar_click() {
        GetCargos();
    }             

    function EditarCargo(row) {
        var data = app.GetValueRowCellOfDataTable($tblListadoCargo, row);
        $titleModalCargo.html("Editar Cargo");

        $modalCargo.modal();
        Global.Cargo_Id = data.Cargo_Id;
        $txtModalDescripcion.val(data.Descripcion);
        $txtModalSueldo.val(data.Sueldo);
        $cboModalEstado.val(data.Estado).trigger('change');
        app.Event.Enable($cboModalEstado);
    }

    function EliminarCargo(row) {
        var fnAceptarCallback = function () {
            var data = app.GetValueRowCellOfDataTable($tblListadoCargo, row);

            var obj = {
                "Cargo_Id": data.Cargo_Id
            };

            var method = "POST";
            var url = "Cargo/DeleteCargo";
            var rsdata = obj;
            var fnDoneCallback = function (data) {
                GetCargos();
            };
            app.CallAjax(method, url, rsdata, fnDoneCallback, null, null, null);
        };
        app.Message.Confirm("Aviso", "Esta seguro que desea eliminar el Cargo?", "Aceptar", "Cancelar", fnAceptarCallback, null);
    }

    return {
        EditarCargo: EditarCargo,
        EliminarCargo: EliminarCargo
    };


})(window.jQuery, window, document);