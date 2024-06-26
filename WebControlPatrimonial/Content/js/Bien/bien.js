var Bien = (function ($, win, doc) {

    var $btnNuevoBien = $('#btnNuevoBien');
    var $btnGuardar = $('#btnGuardar');

    var $tblListadoBienes = $('#tblListadoBienes');

    var $cboTipoBusqueda = $('#cboTipoBusqueda');
    var $tipoTipoBien = $('#tipoTipoBien');
    var $cboTipoBien = $('#cboTipoBien');
    var $tipoCodigoBien = $('#tipoCodigoBien');
    var $txtCodigoBien = $('#txtCodigoBien');
    var $tipoDniUsuario = $('#tipoDniUsuario');
    var $txtDniUsuario = $('#txtDniUsuario');
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
        $titleModal.html("Nuevo Bien");
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
        if (ValidarGuardarBien()) {
            InsertUpdateBien();
        }
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
            if (data.Data) {
                app.Message.Info("Aviso", "La Serie ingresada ya existe");
            } else {
                app.Message.Success("Grabar", Message.GuardarSuccess, "Aceptar", null);
                $modalBien.modal('hide');
                GetBien();
            }
        };
        app.CallAjax(method, url, data, fnDoneCallback);
    }

    function $cboTipoBusqueda_change() {
        var codSelec = $(this).val();
        $tipoTipoBien.hide();
        $tipoCodigoBien.hide();
        $tipoDniUsuario.hide();

        $cboTipoBien.val(0);
        $txtCodigoBien.val("");
        $txtDniUsuario.val("");

        if (codSelec === "1") {
            $tipoTipoBien.show();
        } else if (codSelec === "2") {
            $tipoCodigoBien.show();
        } else if (codSelec === "3") {
            $tipoDniUsuario.show();
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
            Estado:
            {
                Estado_Id: 0
            },
            Bien_Id: $txtCodigoBien.val(),
            DniUsuario: $txtDniUsuario.val()
        };

        var url = "Bien/GetBien";

        var columns = [
            { data: "Bien_Id" },
            { data: "TipoBien.Descripcion" },
            { data: "Marca" },
            { data: "Modelo" },
            { data: "Serie" },
            { data: "FechaVenGarantia" },            
            { data: "Estado.Descripcion" },
            { data: "Auditoria.TipoUsuario" }

        ];
        var columnDefs = [
            {
                "targets": [7],
                "visible": true,
                "orderable": false,
                "className": "text-center",
                'render': function (data, type, full, meta) {
                    if (data === "1") {
                        return "<center>" +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Editar" href="javascript:Bien.EditarBien(' + meta.row + ');"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>' +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Descargar" href="javascript:Bien.DescargarBien(' + meta.row + ');"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></a>' +
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
        $titleModal.html("Editar Bien");

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

    function ValidarGuardarBien() {
        var validar = true;
        var br = "<br>"
        var msg = "";
        var TipoBien = parseInt($cboModalTipoBien.val());
        var OrdenCompra = $txtModalOrdenCompra.val();
        var Proveedor = $txtModalProveedor.val();
        var Marca = $txtModalMarca.val();
        var Modelo = $txtModalModelo.val();
        var Serie = $txtModalSerie.val();
        var FechaVenGarantia = $txtModalFechaVenGarantia.val();
        var Componentes = $txtModalComponentes.val();
        var Estado = parseInt($cboModalEstado.val());

        msg += app.ValidarCampo(TipoBien, "• El Tipo de Bien.");
        msg += app.ValidarCampo(OrdenCompra, "• El Orden de Compra.");
        msg += app.ValidarCampo(Proveedor, "• El Proveedor.");
        msg += app.ValidarCampo(Marca, "• La Marca.");
        msg += app.ValidarCampo(Modelo, "• El Modelo.");
        msg += app.ValidarCampo(Serie, "• La Serie.");
        msg += app.ValidarCampo(FechaVenGarantia, "• La Fecha Vencimiento de Garantia.");
        msg += app.ValidarCampo(Componentes, "• Los Componentes.");
        msg += app.ValidarCampo(Estado, "• El Estado.");

        if (msg != "") {
            validar = false;
            var msgTotal = "Por favor, Ingrese los siguientes campos del Bien: " + br + msg;
            app.Message.Info("Aviso", msgTotal);
        }

        return validar;
    }

    function DescargarBien(row) {
        var data = app.GetValueRowCellOfDataTable($tblListadoBienes, row);
        app.RedirectTo("Bien/DescargarBien?Bien_Id=" + data.Bien_Id);
    }

    return {
        EditarBien: EditarBien,
        DescargarBien: DescargarBien
    };


})(window.jQuery, window, document);