var Transferencia = (function ($, win, doc) {

    var $btnNuevo = $('#btnNuevo');
    var $btnGuardar = $('#btnGuardar');

    var $tblListadoTransferencias = $('#tblListadoTransferencias');

    var $cboTipoBusqueda = $('#cboTipoBusqueda');
    var $tipoEstado = $('#tipoEstado');
    var $cboEstado = $('#cboEstado');
    var $btnBuscar = $('#btnBuscar');
    var $btnAgregarBien = $('#btnAgregarBien');     

    // Modal
    var $modalTransferencia = $('#modalTransferencia');
    var $titleModal = $('#titleModal');
    var $cboModaUsuarioInicial = $('#cboModaUsuarioInicial');
    var $cboModaUsuarioFinal = $('#cboModaUsuarioFinal');
    var $cboModalUnidadOrganicaInicial = $('#cboModalUnidadOrganicaInicial');
    var $cboModalUnidadOrganicaFinal = $('#cboModalUnidadOrganicaFinal');
    var $cboModalSedeInicial = $('#cboModalSedeInicial');
    var $cboModalSedeFinal = $('#cboModalSedeFinal');
    var $txtModalMotivo = $('#txtModalMotivo');
    var $txtModalDescripcion = $('#txtModalDescripcion');
    var $cboModalEstado = $('#cboModalEstado');
    var $tblListadoBienesSeleccionados = $('#tblListadoBienesSeleccionados');

    var $tblListadoBienes = $('#tblListadoBienes');
    var $modalBien = $('#modalBien');
    var $btnGuardarBien = $('#btnGuardarBien');     

    var Message = {
        GuardarSuccess: "Los datos se guardaron satisfactoriamente"
    };

    var Global = {
        Proceso_Id: null
    };

    var NuevosDatosSeleccionados = [];
    var DatosSeleccionados = [];

    // Constructor
    $(Initialize);

    // Implementacion del constructor
    function Initialize() {
        $cboTipoBusqueda.change($cboTipoBusqueda_change);
        $btnBuscar.click($btnBuscar_click);
        $btnNuevo.click($btnNuevo_click);
        $btnGuardar.click($btnGuardar_click);
        GetTransferencia();
        GetUsuario();
        $('#cboModaUsuarioInicial').select2({
            dropdownParent: $('#modalTransferencia')
        });

        $('#cboModaUsuarioFinal').select2({
            dropdownParent: $('#modalTransferencia')
        });
        $btnAgregarBien.click($btnAgregarBien_click);
        $btnGuardarBien.click($btnGuardarBien_click);
        GetUnidadOrganica();
        GetSede();
    }

    function $btnNuevo_click() {
        $titleModal.html("Nuevo Transferencia");
        $modalTransferencia.modal();
        Global.Proceso_Id = null;
        $cboModaUsuarioInicial.val(0).trigger('change');
        $cboModaUsuarioFinal.val(0).trigger('change');
        $cboModalUnidadOrganicaInicial.val(0).trigger('change');
        $cboModalUnidadOrganicaFinal.val(0).trigger('change');
        $cboModalSedeInicial.val(0).trigger('change');
        $cboModalSedeFinal.val(0).trigger('change');
        $txtModalMotivo.val("");
        $txtModalDescripcion.val("");
        $cboModalEstado.val(1);
        app.Event.Disabled($cboModalEstado);
        DatosSeleccionados = [];
        NuevosDatosSeleccionados = [];
        LoadBienesSeleccionados(DatosSeleccionados);
    }

    function $btnGuardar_click() {
        if (ValidarGuardarTransferencia()) {
            InsertUpdateTransferencia();
        }
    }

    function InsertUpdateTransferencia() {

        var obj = {
            "Proceso_Id": Global.Proceso_Id,
            "DetalleProceso":
            {
                "Usuario_Inicial": $cboModaUsuarioInicial.val(),
                "UnidadOrganica_Inicial": $cboModalUnidadOrganicaInicial.val(),
                "Sede_Inicial": $cboModalSedeInicial.val(),
                "Usuario_Final": $cboModaUsuarioFinal.val(),
                "UnidadOrganica_Final": $cboModalUnidadOrganicaFinal.val(),
                "Sede_Final": $cboModalSedeFinal.val(),
                "DetalleTransferencia": {
                    "Motivo": $txtModalMotivo.val(),
                    "Descripcion": $txtModalDescripcion.val(),
                }
            },
            "Bienes": DatosSeleccionados,
            "Estado": {
                "Estado_Id": $cboModalEstado.val()
            }
        };

        var method = "POST";
        var data = obj;
        var url = "Transferencia/InsertUpdateTransferencia";

        var fnDoneCallback = function (data) {
            app.Message.Success("Grabar", Message.GuardarSuccess, "Aceptar", null);
            $modalTransferencia.modal('hide');
            GetTransferencia();
        };
        app.CallAjax(method, url, data, fnDoneCallback);
    }

    function $cboTipoBusqueda_change() {
        var codSelec = $(this).val();
        $tipoEstado.hide();

        $cboEstado.val(0);

        if (codSelec === "1") {
            $tipoEstado.show();
        }
    }

    function $btnBuscar_click() {
        GetTransferencia();
    }

    function GetTransferencia() {
        var parms = {
            //Proceso_Id: $txtOrdenCompra.val(),
            Estado:
            {
                Estado_Id: $cboEstado.val()
            }
        };

        var url = "Transferencia/GetTransferencia";

        var columns = [
            { data: "FechaIngreso" },
            { data: "FechaEliminacion" },
            { data: "DetalleProceso.Usuario_Inicial_Descripcion" },
            { data: "DetalleProceso.UnidadOrganica_Inicial_Descripcion" },
            { data: "DetalleProceso.Usuario_Final_Descripcion" },
            { data: "DetalleProceso.UnidadOrganica_Final_Descripcion" },
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
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Editar" href="javascript:Transferencia.EditarTransferencia(' + meta.row + ');"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>' +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Eliminar" href="javascript:Transferencia.EliminarTransferencia(' + meta.row + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>' +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Descargar" href="javascript:Transferencia.DescargarTransferencia(' + meta.row + ')"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></a>' +
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
        app.FillDataTableAjaxPaging($tblListadoTransferencias, url, parms, columns, columnDefs, filters, null, null);
    }

    function EditarTransferencia(row) {
        var datos = app.GetValueRowCellOfDataTable($tblListadoTransferencias, row);
        $titleModal.html("Editar Transferencia");
        Global.Proceso_Id = datos.Proceso_Id;
        GetBienTransferencia(datos);
    }

    function EliminarTransferencia(row) {
        var fnAceptarCallback = function () {
            var data = app.GetValueRowCellOfDataTable($tblListadoTransferencias, row);

            var obj = {
                "Proceso_Id": data.Proceso_Id
            };

            var method = "POST";
            var url = "Transferencia/DeleteTransferencia";
            var rsdata = obj;
            var fnDoneCallback = function (data) {
                GetTransferencia();
            };
            app.CallAjax(method, url, rsdata, fnDoneCallback, null, null, null);
        };
        app.Message.Confirm("Aviso", "Esta seguro que desea desactivar la transferencia?", "Aceptar", "Cancelar", fnAceptarCallback, null);
    }

    function GetUsuario() {
        var method = "POST";
        var url = "Combos/GetUsuario";
        var fnDoneCallback = function (data) {
            for (var i = 0; i < data.Data.length; i++) {
                $cboModaUsuarioInicial.append('<option value=' + data.Data[i].Usuario_Id + '>' + data.Data[i].Nombres + '</option>');
                $cboModaUsuarioFinal.append('<option value=' + data.Data[i].Usuario_Id + '>' + data.Data[i].Nombres + '</option>');
            }
        };
        app.CallAjax(method, url, null, fnDoneCallback, null, null, null);
    }

    function $btnAgregarBien_click() {
        $modalBien.modal();
        NuevosDatosSeleccionados = [];
        GetBien();
    }

    function GetBien() {
        var parms = {
            Auditoria:
            {
                Usuario_Id: $cboModaUsuarioInicial.val()
            }
        };

        var url = "Transferencia/GetBien";

        var columns = [
            { data: "Bien_Id" },
            { data: "TipoBien.Descripcion" },
            { data: "Marca" },
            { data: "Modelo" },
            { data: "Serie" },
            { data: "FechaVenGarantia" }
        ];

        var filters = {
            pageLength: app.Defaults.TablasPageLength,
            select: {
                style: "multi"
            }
        };
        app.FillDataTableAjaxPaging($tblListadoBienes, url, parms, columns, null, filters, null, null);

    }

    function LoadBienesSeleccionados(data) {
        $tblListadoBienesSeleccionados.DataTable({
            data: data,
            columns: [
                { data: "Bien_Id" },
                { data: "TipoBien.Descripcion" },
                { data: "Marca" },
                { data: "Modelo" },
                { data: "Serie" },
                { data: "FechaVenGarantia" },
                { data: "Bien_Id" }
            ],
            columnDefs: [
                {
                    "targets": [6],
                    "visible": true,
                    "className": "text-center",
                    'render': function (data, type, full, meta) {
                        return "<center>" +
                            '<a class="btn btn-default btn-xs"  title="Eliminar" href="javascript:Transferencia.EliminarBien(' + meta.row + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>' +
                            "</center> ";
                    }
                }
            ],
            destroy: true,
            paging: true,
            searching: false,
            pageLength: 5,
            ordering: false,
            lengthMenu: false,
            lengthChange: false,
            select: {
                style: "single"
            },
            language: app.Defaults.DataTableLanguage
        });
    }

    function $btnGuardarBien_click() {

        NuevosDatosSeleccionados = $tblListadoBienes.DataTable().rows({ selected: true }).data().toArray();

        $.each(NuevosDatosSeleccionados, function (key, value) {
            DatosSeleccionados.push(value);
        });

        var hash = {};
        DatosSeleccionados = DatosSeleccionados.filter(function (current) {
            var exists = !hash[current.Bien_Id];
            hash[current.Bien_Id] = true;
            return exists;
        });

        DatosSeleccionados.sort((a, b) => b.Bien_Id - a.Bien_Id);

        $tblListadoBienesSeleccionados.DataTable().clear().draw();
        LoadBienesSeleccionados(DatosSeleccionados);
        $modalBien.modal('hide');
    }

    function EliminarBien(row) {
        var data = app.GetValueRowCellOfDataTable($tblListadoBienesSeleccionados, row);

        var BienesSeleccionadas = [];
        DatosSeleccionados.map(function (value) {
            BienesSeleccionadas.push(value);
        });

        var index = $.inArray(data, DatosSeleccionados);
        BienesSeleccionadas.splice(index, 1);

        DatosSeleccionados = [];
        $.each(BienesSeleccionadas, function (index, value) {
            DatosSeleccionados.push(value);
        });

        LoadBienesSeleccionados(DatosSeleccionados);
    }

    function GetBienTransferencia(datos) {
        var obj = {
            "Proceso_Id": Global.Proceso_Id
        };

        var method = "POST";
        var data = obj;
        var url = "Transferencia/GetBienTransferencia";
        var fnDoneCallback = function (data) {
            DatosSeleccionados = data.Data;
            LoadBienesSeleccionados(DatosSeleccionados);
            $cboModaUsuarioInicial.val(datos.DetalleProceso.Usuario_Inicial).trigger('change');
            $cboModaUsuarioFinal.val(datos.DetalleProceso.Usuario_Final).trigger('change');
            $cboModalUnidadOrganicaInicial.val(datos.DetalleProceso.UnidadOrganica_Inicial).trigger('change');
            $cboModalUnidadOrganicaFinal.val(datos.DetalleProceso.UnidadOrganica_Final).trigger('change');
            $cboModalSedeInicial.val(datos.DetalleProceso.Sede_Inicial).trigger('change');
            $cboModalSedeFinal.val(datos.DetalleProceso.Sede_Final).trigger('change');
            $txtModalMotivo.val(datos.DetalleProceso.DetalleTransferencia.Motivo);
            $txtModalDescripcion.val(datos.DetalleProceso.DetalleTransferencia.Descripcion);
            $cboModalEstado.val(datos.Estado.Estado_Id).trigger('change');
            app.Event.Enable($cboModalEstado);
            $modalTransferencia.modal();
        };
        app.CallAjax(method, url, data, fnDoneCallback, null, null, null);
    }

    function ValidarGuardarTransferencia() {
        var validar = true;
        var br = "<br>"
        var msg = "";
        var UsuarioInicial = parseInt($cboModaUsuarioInicial.val());
        var UnidadOrganica_Inicial = parseInt($cboModalUnidadOrganicaInicial.val());
        var Sede_Inicial = parseInt($cboModalSedeInicial.val());
        var UsuarioFinal = parseInt($cboModaUsuarioFinal.val());
        var UnidadOrganica_Final = parseInt($cboModalUnidadOrganicaFinal.val());
        var Sede_Final = parseInt($cboModalSedeFinal.val());
        var Motivo = $txtModalMotivo.val();
        var Descripcion = $txtModalDescripcion.val();
        var Estado = parseInt($cboModalEstado.val());

        msg += app.ValidarCampo(UsuarioInicial, "• El Usuario Inicial.");
        msg += app.ValidarCampo(UnidadOrganica_Inicial, "• La Unidad Orgánica Inicial.");
        msg += app.ValidarCampo(Sede_Inicial, "• La Sede Inicial.");
        msg += app.ValidarCampo(UsuarioFinal, "• El Usuario Final.");
        msg += app.ValidarCampo(UnidadOrganica_Final, "• La Unidad Orgánica Final.");
        msg += app.ValidarCampo(Sede_Final, "• La Sede Final.");
        msg += app.ValidarCampo(Motivo, "• El Motivo.");
        msg += app.ValidarCampo(Descripcion, "• La Descripción.");
        msg += app.ValidarCampo(Estado, "• El Estado.");
        if (DatosSeleccionados.length == 0) {
            msg += "• Los Bienes.";
        }

        if (msg != "") {
            validar = false;
            var msgTotal = "Por favor, Ingrese los siguientes campos del Transferencia: " + br + msg;
            app.Message.Info("Aviso", msgTotal);
        }

        return validar;
    }

    function DescargarTransferencia(row) {
        var data = app.GetValueRowCellOfDataTable($tblListadoTransferencias, row);
        app.RedirectTo("Transferencia/DescargarTransferencia?Proceso_Id=" + data.Proceso_Id);
    }

    function GetUnidadOrganica() {
        var method = "POST";
        var url = "Combos/GetUnidadOrganica";
        var fnDoneCallback = function (data) {
            for (var i = 0; i < data.Data.length; i++) {
                $cboModalUnidadOrganicaInicial.append('<option value=' + data.Data[i].UnidadOrganica_Id + '>' + data.Data[i].Descripcion + '</option>');
                $cboModalUnidadOrganicaFinal.append('<option value=' + data.Data[i].UnidadOrganica_Id + '>' + data.Data[i].Descripcion + '</option>');
            }
        };
        app.CallAjax(method, url, null, fnDoneCallback, null, null, null);
    }

    function GetSede() {
        var method = "POST";
        var url = "Combos/GetSede";
        var fnDoneCallback = function (data) {
            for (var i = 0; i < data.Data.length; i++) {
                $cboModalSedeInicial.append('<option value=' + data.Data[i].Sede_Id + '>' + data.Data[i].Descripcion + '</option>');
                $cboModalSedeFinal.append('<option value=' + data.Data[i].Sede_Id + '>' + data.Data[i].Descripcion + '</option>');
            }
        };
        app.CallAjax(method, url, null, fnDoneCallback, null, null, null);
    }

    return {
        EditarTransferencia: EditarTransferencia,
        EliminarTransferencia: EliminarTransferencia,
        EliminarBien: EliminarBien,
        DescargarTransferencia: DescargarTransferencia
    };


})(window.jQuery, window, document);