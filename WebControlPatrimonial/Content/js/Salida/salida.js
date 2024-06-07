var Salida = (function ($, win, doc) {

    var $btnNuevo = $('#btnNuevo');
    var $btnGuardar = $('#btnGuardar');

    var $tblListadoSalidas = $('#tblListadoSalidas');

    var $cboTipoBusqueda = $('#cboTipoBusqueda');
    var $tipoEstado = $('#tipoEstado');
    var $cboEstado = $('#cboEstado');
    var $btnBuscar = $('#btnBuscar');
    var $btnAgregarBien = $('#btnAgregarBien');     

    // Modal
    var $modalSalida = $('#modalSalida');
    var $titleModal = $('#titleModal');
    var $tblListadoBienesSeleccionados = $('#tblListadoBienesSeleccionados');
    var $cboModalAsunto = $('#cboModalAsunto');
    var $txtModalAntecedentes = $('#txtModalAntecedentes');
    var $txtModalAnalisis = $('#txtModalAnalisis');
    var $txtModalConclusiones = $('#txtModalConclusiones');
    var $txtModalRecomendaciones = $('#txtModalRecomendaciones');

    var $tblListadoBienes = $('#tblListadoBienes');
    var $modalBien = $('#modalBien');
    var $cboModalTipoBusqueda = $('#cboModalTipoBusqueda');
    var $tipoModalTipoBien = $('#tipoModalTipoBien');
    var $cboModalTipoBien = $('#cboModalTipoBien');
    var $tipoModalOrdenCompra = $('#tipoModalOrdenCompra');
    var $txtModalOrdenCompra = $('#txtModalOrdenCompra');
    var $cboModalEstadoBien = $('#cboModalEstadoBien');
    var $btnBuscarModal = $('#btnBuscarModal');
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
        GetSalida();
        GetAsunto();
        //GetTipoBien();
        $btnAgregarBien.click($btnAgregarBien_click);
        $cboModalTipoBusqueda.change($cboModalTipoBusqueda_change);
        $btnBuscarModal.click($btnBuscarModal_click);
        $btnGuardarBien.click($btnGuardarBien_click);
    }

    function $btnNuevo_click() {
        $titleModal.html("Nuevo Transferencia");
        $modalSalida.modal();
        Global.Proceso_Id = null;
        //$cboModaUsuarioInicial.val(0).trigger('change');
        //$cboModaUsuarioFinal.val(0).trigger('change');
        //$cboModalEstado.val(1);
        //app.Event.Disabled($cboModalEstado);
        //DatosSeleccionados = [];
        //NuevosDatosSeleccionados = [];
        //LoadBienesSeleccionados(DatosSeleccionados);
    }

    function $btnGuardar_click() {
        if (ValidarGuardarSalida()) {
            InsertUpdateSalida();
        }
    }

    function InsertUpdateSalida() {

        var obj = {
            "Proceso_Id": Global.Proceso_Id,
            "DetalleProceso":
            {
                "Usuario_Inicial": $cboModaUsuarioInicial.val(),
                "Usuario_Final": $cboModaUsuarioFinal.val(),
            },
            "Bienes": NuevosDatosSeleccionados,
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
        GetSalida();
    }

    function GetSalida() {
        var parms = {
            //Proceso_Id: $txtOrdenCompra.val(),
            Estado:
            {
                Estado_Id: $cboEstado.val()
            }
        };

        var url = "Salida/GetSalida";

        var columns = [
            { data: "DetalleProceso.DetalleSalida.Asunto.Descripcion" },
            { data: "DetalleProceso.DetalleSalida.Antecedentes" },
            { data: "DetalleProceso.DetalleSalida.Analisis" },
            { data: "DetalleProceso.DetalleSalida.Conclusiones" },
            { data: "DetalleProceso.DetalleSalida.Recomendaciones" },
            { data: "Estado.Descripcion" },
            { data: "Auditoria.TipoUsuario" }

        ];
        var columnDefs = [
            {
                "targets": [6],
                "visible": true,
                "orderable": false,
                "className": "text-center",
                'render': function (data, type, full, meta) {
                    if (data === "1") {
                        return "<center>" +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Editar" href="javascript:Transferencia.EditarTransferencia(' + meta.row + ');"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>' +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Eliminar" href="javascript:Transferencia.EliminarTransferencia(' + meta.row + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>' +
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
        app.FillDataTableAjaxPaging($tblListadoSalidas, url, parms, columns, columnDefs, filters, null, null);
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

    function GetAsunto() {
        var method = "POST";
        var url = "Combos/GetAsunto";
        var fnDoneCallback = function (data) {
            for (var i = 0; i < data.Data.length; i++) {
                $cboModalAsunto.append('<option value=' + data.Data[i].Asunto_Id + '>' + data.Data[i].Descripcion + '</option>');
            }
        };
        app.CallAjax(method, url, null, fnDoneCallback, null, null, null);
    }

    function $btnAgregarBien_click() {
        $modalBien.modal();
        $cboModalTipoBusqueda.val(0).change();
        NuevosDatosSeleccionados = [];
        GetBien();
    }

    function GetBien() {
        //var parms = {
        //    TipoBien:
        //    {
        //        TipoBien_Id: $cboModalTipoBien.val()
        //    },
        //    OrdenCompra: $txtModalOrdenCompra.val(),
        //    Estado:
        //    {
        //        Estado_Id: $cboModalEstadoBien.val()
        //    }
        //};

        var url = "Bien/GetBien";

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
        app.FillDataTableAjaxPaging($tblListadoBienes, url, null, columns, null, filters, null, null);

    }

    function $cboModalTipoBusqueda_change() {
        var codSelec = $(this).val();
        $tipoModalTipoBien.hide();
        $tipoModalOrdenCompra.hide();

        $tipoModalTipoBien.val("");
        $tipoModalOrdenCompra.val("");
        $cboModalEstadoBien.val(1);

        if (codSelec === "1") {
            $tipoModalTipoBien.show();
        } else if (codSelec === "2") {
            $tipoModalOrdenCompra.show();
        }
    }

    function $btnBuscarModal_click() {
        GetBien();
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
                            '<a class="btn btn-default btn-xs"  title="Eliminar" href="javascript:Salida.EliminarBien(' + meta.row + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>' +
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

    function ValidarGuardarSalida() {
        var validar = true;
        var br = "<br>"
        var msg = "";
        var Asunto = parseInt($cboModalAsunto.val());
        var Antecedentes = $txtModalAntecedentes.val();
        var Analisis = $txtModalAnalisis.val();
        var Conclusiones = $txtModalConclusiones.val();
        var Recomendaciones = $txtModalRecomendaciones.val();
        var Estado = parseInt($cboModalEstado.val());

        msg += app.ValidarCampo(Asunto, "• El Asunto.");
        msg += app.ValidarCampo(Antecedentes, "• El Antecedente.");
        msg += app.ValidarCampo(Analisis, "• El Análisis.");
        msg += app.ValidarCampo(Conclusiones, "• Las Conclusiones.");
        msg += app.ValidarCampo(Recomendaciones, "• Las Recomendaciones.");
        msg += app.ValidarCampo(Estado, "• El Estado.");
        if (DatosSeleccionados.length == 0) {
            msg += "• Los Bienes.";
        }

        if (msg != "") {
            validar = false;
            var msgTotal = "Por favor, Ingrese los siguientes campos de la Salida: " + br + msg;
            app.Message.Info("Aviso", msgTotal);
        }

        return validar;
    }

    return {
        EditarTransferencia: EditarTransferencia,
        EliminarTransferencia: EliminarTransferencia,
        EliminarBien: EliminarBien
    };


})(window.jQuery, window, document);