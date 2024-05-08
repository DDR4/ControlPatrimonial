var Area = (function ($, win, doc) {

    var $tblListadoArea = $('#tblListadoArea');
    var $btnNuevaArea = $('#btnNuevaArea');

    var $cboTipoBusqueda = $('#cboTipoBusqueda');
    var $tipoDescripcion = $('#tipoDescripcion');
    var $txtDescripcion = $('#txtDescripcion');
    var $tipoEstado = $('#tipoEstado');
    var $cboEstado = $('#cboEstado');
    var $btnBuscar = $('#btnBuscar');

    //Modal
    var $modalArea = $('#modalArea');  
    var $titleModalArea = $('#titleModalArea');
    var $txtModalDescripcion = $('#txtModalDescripcion');  
    var $cboModalEstado = $('#cboModalEstado'); 
    var $btnGuardar = $('#btnGuardar');
                                        
    var Message = {
        ObtenerTipoBusqueda: "Obteniendo los tipos de busqueda, Por favor espere...",
        GuardarSuccess: "Los datos se guardaron satisfactoriamente"
    };

    var Global = {
        Area_Id: null
    };

    // Constructor
    $(Initialize);                        

    // Implementacion del constructor
    function Initialize() {          
        GetAreas();         
        $cboTipoBusqueda.change($cboTipoBusqueda_change);
        $btnBuscar.click($btnBuscar_click);         
        $btnGuardar.click($btnGuardar_click);
        $btnNuevaArea.click($btnNuevaArea_click);
    }           

    function $btnNuevaArea_click() {
        $titleModalArea.html("Nueva Area");
        $modalArea.modal();
        Global.Area_Id = null;
        $txtModalDescripcion.val("");
        $cboModalEstado.val(1);
        app.Event.Disabled($cboModalEstado);

    }

    function GetAreas() {             

        var parms = {
            Descripcion: $txtDescripcion.val(),
            Estado: $cboEstado.val()
        };

        var url = "Area/GetArea";

        var columns = [
            { data: "Descripcion" },
            { data: "Estado" },
            { data: "Auditoria.TipoUsuario" }
        ];
        var columnDefs = [ 
            {
                "targets": [1],
                'render': function (data, type, full, meta) {
                    if (data === 1) {
                        return "Activo";
                    } else return "Inactivo";

                }
            },
            {
                "targets": [2],
                "visible": true,
                "orderable": false,
                "className": "text-center",
                'render': function (data, type, full, meta) {
                    if (data === "1") {
                        return "<center>" +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Editar" href="javascript:Area.EditarArea(' + meta.row + ');"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>' +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Eliminar" href="javascript:Area.EliminarArea(' + meta.row + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>' +
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
        app.FillDataTableAjaxPaging($tblListadoArea, url, parms, columns, columnDefs, filters, null, null);

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
        InsertUpdateArea();
    }

    function InsertUpdateArea() {

        var obj = {
            "Area_Id": Global.Area_Id,
            "Descripcion": $txtModalDescripcion.val(),       
            "Estado": $cboModalEstado.val()
        };

        var method = "POST";
        var data = obj;
        var url = "Area/InsertUpdateArea";

        var fnDoneCallback = function (data) {
            app.Message.Success("Grabar", Message.GuardarSuccess, "Aceptar", null);
            $modalArea.modal('hide');
            GetAreas();
        };
        app.CallAjax(method, url, data, fnDoneCallback);
    }


    function $btnBuscar_click() {
        GetAreas();
    }             

    function EditarArea(row) {
        var data = app.GetValueRowCellOfDataTable($tblListadoArea, row);
        $titleModalArea.html("Editar Area");

        $modalArea.modal();
        Global.Area_Id = data.Area_Id;
        $txtModalDescripcion.val(data.Descripcion);
        $cboModalEstado.val(data.Estado).trigger('change');
        app.Event.Enable($cboModalEstado);
    }

    function EliminarArea(row) {
        var fnAceptarCallback = function () {
            var data = app.GetValueRowCellOfDataTable($tblListadoArea, row);

            var obj = {
                "Area_Id": data.Area_Id
            };

            var method = "POST";
            var url = "Area/DeleteArea";
            var rsdata = obj;
            var fnDoneCallback = function (data) {
                GetAreas();
            };
            app.CallAjax(method, url, rsdata, fnDoneCallback, null, null, null);
        };
        app.Message.Confirm("Aviso", "Esta seguro que desea eliminar el area?", "Aceptar", "Cancelar", fnAceptarCallback, null);
    }

    return {
        EditarArea: EditarArea,
        EliminarArea: EliminarArea
    };


})(window.jQuery, window, document);