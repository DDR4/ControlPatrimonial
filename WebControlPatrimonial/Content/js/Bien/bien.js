var Bien = (function ($, win, doc) {

    var $btnNuevoBien = $('#btnNuevoBien');
    var $btnGuardar = $('#btnGuardar');

    var $tblListadoBienes = $('#tblListadoBienes');

    var $cboTipoBusqueda = $('#cboTipoBusqueda');
    var $tipoTipoBien = $('#tipoTipoBien');
    var $cboTipoBien = $('#cboTipoBien');
    var $tipoOrdenCompra = $('#tipoOrdenCompra');
    var $txtOrdenCompra = $('#txtOrdenCompra');
    var $tipoEstado = $('#tipoEstado');
    var $cboEstado = $('#cboEstado');
    var $btnBuscar = $('#btnBuscar');

    // Modal
    var $modalBien = $('#modalBien');
    var $titleModal = $('#titleModal');
    var $txtModalOrdenCompra = $('#txtModalOrdenCompra');
    var $txtModalProveedor = $('#txtModalProveedor');
    var $txtModalMarca = $('#txtModalMarca');
    var $txtModalModelo = $('#txtModalModelo');
    var $txtModalSerie = $('#txtModalSerie');           
    var $txtModalFechaVenGarantia = $('#txtModalFechaVenGarantia');
    var $txtModalComponentes = $('#txtModalComponentes');
    var $cboModalTipoBien = $('#cboModalTipoBien');
    var $cboModalEstado = $('#cboModalEstado');

    var Message = {
        GuardarSuccess: "Los datos se guardaron satisfactoriamente"
    };

    var Global = {
        Bien_Id: null
    };

    // Constructor
    $(Initialize);

    // Implementacion del constructor
    function Initialize() {
        $cboTipoBusqueda.change($cboTipoBusqueda_change);
        $btnBuscar.click($btnBuscar_click);
        $btnNuevoBien.click($btnNuevoBien_click);
        $btnGuardar.click($btnGuardar_click);
        GetBien();
        GetTipoBien();
        $txtModalFechaVenGarantia.datepicker({
            endDate: "today",
            todayHighlight: true
        });
    }

    function $btnNuevoBien_click() {
        $modalBien.modal();
        Global.Bien_Id = null;
        $txtModalOrdenCompra.val("");
        $txtModalProveedor.val("");
        $txtModalMarca.val("");
        $txtModalModelo.val("");
        $txtModalSerie.val("");
        $txtModalFechaVenGarantia.val("");
        $txtModalComponentes.val("");
        $cboModalTipoBien.val(0);
        $cboModalEstado.val(1);
        app.Event.Disabled($cboModalEstado);
    }

    function $btnGuardar_click() {
        InsertUpdateBien();
    }

    function InsertUpdateBien() {

        var obj = {
            "Bien_Id": Global.Bien_Id,
            "OrdenCompra": $txtModalOrdenCompra.val(),
            "Proveedor": $txtModalProveedor.val(),
            "Marca": $txtModalMarca.val(),
            "Modelo": $txtModalModelo.val(),
            "Serie": $txtModalSerie.val(),
            "FechaVenGarantia": $txtModalFechaVenGarantia.val(),
            "Componentes": $txtModalComponentes.val(),
            "TipoBien": {
                "TipoBien_Id": $cboModalTipoBien.val()
            },
            "Estado": {
                "Estado_Id": $cboModalEstado.val()
            }
        };

        var method = "POST";
        var data = obj;
        var url = "Bien/InsertUpdateBien";

        var fnDoneCallback = function (data) {
            app.Message.Success("Grabar", Message.GuardarSuccess, "Aceptar", null);
            $modalBien.modal('hide');
            GetBien();
        };
        app.CallAjax(method, url, data, fnDoneCallback);
    }

    function $cboTipoBusqueda_change() {
        var codSelec = $(this).val();
        $tipoTipoBien.hide();
        $tipoOrdenCompra.hide();
        $tipoEstado.hide();

        $tipoTipoBien.val("");
        $tipoOrdenCompra.val("");
        $cboEstado.val(0);

        if (codSelec === "1") {
            $tipoTipoBien.show();
        } else if (codSelec === "2") {
            $tipoOrdenCompra.show();
        } else if (codSelec === "3") {
            $tipoEstado.show();
        }
    }

    function $btnBuscar_click() {
        GetBien();
    }

    function GetBien() {
        var parms = {
            TipoBien:
            {
                TipoBien_Id: $cboTipoBien.val()
            },
            OrdenCompra: $txtOrdenCompra.val(),
            Estado:
            {
                Estado_Id: $cboEstado.val()
            }
        };

        var url = "Bien/GetBien";

        var columns = [
            { data: "OrdenCompra" },
            { data: "Proveedor" },
            { data: "Marca" },
            { data: "Modelo" },
            { data: "Serie" },
            { data: "FechaVenGarantia" },
            { data: "Componentes" },
            { data: "TipoBien.Descripcion" },
            { data: "Estado.Descripcion" },
            { data: "Auditoria.TipoUsuario" }

        ];
        var columnDefs = [
            {
                "targets": [9],
                "visible": true,
                "orderable": false,
                "className": "text-center",
                'render': function (data, type, full, meta) {
                    if (data === "1") {
                        return "<center>" +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Editar" href="javascript:Bien.EditarBien(' + meta.row + ');"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>' +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Eliminar" href="javascript:Bien.EliminarBien(' + meta.row + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>' +
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
        app.FillDataTableAjaxPaging($tblListadoBienes, url, parms, columns, columnDefs, filters, null, null);

    }

    function EditarBien(row) {
        var data = app.GetValueRowCellOfDataTable($tblListadoBienes, row);
        $titleModal.html("Editar Usuario");

        $modalBien.modal();
        Global.Bien_Id = data.Bien_Id;
        $txtModalOrdenCompra.val(data.OrdenCompra);
        $txtModalProveedor.val(data.Proveedor);
        $txtModalMarca.val(data.Marca);
        $txtModalModelo.val(data.Modelo);
        $txtModalSerie.val(data.Serie);
        $txtModalFechaVenGarantia.val(data.FechaVenGarantia);
        $txtModalComponentes.val(data.Componentes);
        $cboModalTipoBien.val(data.TipoBien.TipoBien_Id).trigger('change');
        app.Event.Enable($cboModalEstado);
        $cboModalEstado.val(data.Estado.Estado_Id).trigger('change');
    }

    function EliminarBien(row) {
        var fnAceptarCallback = function () {
            var data = app.GetValueRowCellOfDataTable($tblListadoBienes, row);

            var obj = {
                "Bien_Id": data.Bien_Id
            };

            var method = "POST";
            var url = "Bien/DeleteBien";
            var rsdata = obj;
            var fnDoneCallback = function (data) {
                GetBien();
            };
            app.CallAjax(method, url, rsdata, fnDoneCallback, null, null, null);
        };
        app.Message.Confirm("Aviso", "Esta seguro que desea desactivar el usuario?", "Aceptar", "Cancelar", fnAceptarCallback, null);
    }

    function GetTipoBien() {
        var method = "POST";
        var url = "Combos/GetTipoBien";
        var fnDoneCallback = function (data) {
            for (var i = 0; i < data.Data.length; i++) {
                $cboTipoBien.append('<option value=' + data.Data[i].TipoBien_Id + '>' + data.Data[i].Descripcion + '</option>');
                $cboModalTipoBien.append('<option value=' + data.Data[i].TipoBien_Id + '>' + data.Data[i].Descripcion + '</option>');
            }
        };
        app.CallAjax(method, url, null, fnDoneCallback, null, null, null);
    }

    return {
        EditarBien: EditarBien,
        EliminarBien: EliminarBien
    };


})(window.jQuery, window, document);