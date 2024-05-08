var Ventas = (function ($, win, doc) {

    var $cboTipoBusqueda = $('#cboTipoBusqueda');

    var $tipoCodigo = $('#tipoCodigo');
    var $tipoFecha = $('#tipoFecha');
    var $tipoMarca = $('#tipoMarca');
    var $tipoTalla = $('#tipoTalla');

    var $txtCodigo = $('#txtCodigo');
    var $txtFecha = $('#txtFecha');
    var $txtMarca = $('#txtMarca');
    var $txtTalla = $('#txtTalla');
    var $tblListadoVentas = $('#tblListadoVentas');
    var $btnBuscar = $('#btnBuscar');
    var $btnNuevaVenta = $('#btnNuevaVenta');
    // variables del modal 

    var $formModal = $('#formModal');
    var $modalVentas = $('#modalVentas');
    var $txtModalCatVenta = $('#txtModalCatVenta');
    var $txtModalFecha = $('#txtModalFecha');
    var $txtModalCodigo = $('#txtModalCodigo');
    var $cboModalTalla = $('#cboModalTalla');
    var $txtModalMarca = $('#txtModalMarca');
    var $txtModalPrecioVenta = $('#txtModalPrecioVenta');
    var $txtModalPrecioProducto = $('#txtModalPrecioProducto');
    var $txtModalDescuento = $('#txtModalDescuento');
    var $txtModalTotal = $('#txtModalTotal');
    var $txtModalCatVentaMaxima = $('#txtModalCatVentaMaxima');

    var $btnProducto = $('#btnProducto');
    var $btnSaveVenta = $('#btnSaveVenta');

    //Modal Producto 
    var $modalProducto = $('#modalProducto');

    var $tblListadoProductos = $('#tblListadoProductos');
    var $btnSaveProducto = $('#btnSaveProducto');

    var $cboTipoBusquedaModal = $('#cboTipoBusquedaModal');
    var $txtCodigoModal = $('#txtCodigoModal');
    var $txtMarcaModal = $('#txtMarcaModal');
    var $btnBuscarModal = $('#btnBuscarModal');

    var $btnGenerarExcel = $('#btnGenerarExcel');
    var $txtFechaDesde = $('#txtFechaDesde');
    var $txtFechaHasta = $('#txtFechaHasta');

    var $tblListadoProductosSeleccionados = $('#tblListadoProductosSeleccionados');
    var $txtModalCantidad = $('#txtModalCantidad');
    var $txtModalCantidadMaxima = $('#txtModalCantidadMaxima');
    var $btnAgregarTalla = $('#btnAgregarTalla');
    var $tblListadoTallas = $('#tblListadoTallas');
    var $btnGuadarTallas = $('#btnGuadarTallas');
    var $tblTallasVenta = $('#tblTallasVenta');
    var $modalTallas = $('#modalTallas');

    var Message = {
        ObtenerTipoBusqueda: "Obteniendo los tipos de busqueda, Por favor espere...",
        GuardarSuccess: "Los datos se guardaron satisfactoriamente",
        EliminarSuccess: "El registro se elimino satisfactoriamente"
    };

    var tallas = [];
    var NuevosDatosSeleccionados = [];
    var DatosSeleccionados = [];
    var DatosSeleccionadosDetalle = { Data: [] };
    var PrecioProductos = [];
    // Constructor
    $(Initialize);

    // Implementacion del constructor
    function Initialize() {
        $cboTipoBusqueda.change($cboTipoBusqueda_change);
        $cboTipoBusquedaModal.change($cboTipoBusquedaModal_change);
        GetVentas();
        app.Event.Datepicker($txtFecha);
        app.Event.SetDateDatepicket($txtModalFecha);
        $btnBuscar.click($btnBuscar_click);
        $btnNuevaVenta.click($btnNuevaVenta_click);
        $btnProducto.click($btnProducto_click);
        $btnSaveProducto.click($btnSaveProducto_click);
        $btnSaveVenta.click($btnSaveVenta_click);
        $btnBuscarModal.click($btnBuscarModal_click);
        $txtModalPrecioVenta.blur($txtModalPrecioVenta_keypress);
        $cboModalTalla.change($cboModalTalla_change);
        app.Event.ForceDecimalOnly($txtModalPrecioVenta);
        app.Event.Number($txtModalCantidad);
        $btnGenerarExcel.click($btnGenerarExcel_click);
        $txtFechaDesde.change(ValidarGenerarExcel);
        $txtFechaHasta.change(ValidarGenerarExcel);
        var date = new Date();
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        $txtFechaHasta.datepicker({
            endDate: "today",
            todayHighlight: true
        }).datepicker('setDate', today);
        $txtFechaDesde.datepicker({
            endDate: "today",
            todayHighlight: true
        });
        $btnAgregarTalla.click($btnAgregarTalla_click);
    }

    function $cboTipoBusqueda_change() {
        var codSelec = $(this).val();
        $tipoCodigo.hide();
        $tipoFecha.hide();
        $tipoMarca.hide();
        $tipoTalla.hide();

        if (codSelec === "1") {
            $tipoCodigo.show();
        } else if (codSelec === "2") {
            $tipoFecha.show();
        } else if (codSelec === "3") {
            $tipoMarca.show();
        } else if (codSelec === "4") {
            $tipoTalla.show();
        } else if (codSelec === "5") {
            $txtCodigo.val(null); $txtFecha.val(null);
            $txtMarca.val(null); $txtTalla.val(null);
        }


    }

    function $cboTipoBusquedaModal_change() {

        var codSelec = $(this).val();
        //$('#form1')[0].reset();
        $('#tipoCodigoModal').hide();
        $('#tipoMarcaModal').hide();

        $txtCodigoModal.val("");
        $txtMarcaModal.val("");

        if (codSelec === "1") {
            $('#tipoCodigoModal').show();
        }
        else if (codSelec === "2") {
            $('#tipoMarcaModal').show();
        }
    }

    function GetVentas() {

        var url = "Ventas/GetVentas";

        var parms = {
            Fecha: app.ConvertDatetimeToInt($txtFecha.val(), '/')
        };

        var columns = [
            { data: "Cod_Venta" },
            { data: "Producto.Marca_Prod" },
            { data: "Precio_Prod" },
            { data: "Precio_Venta" },
            { data: "Descuento_Venta" },
            { data: "Precio_Final" },
            { data: "Fecha" },
            { data: "Auditoria.TipoUsuario" }
        ];
        var columnDefs = [

            {
                "targets": [2, 3, 4, 5],
                "className": "text-right",
                'render': function (data, type, full, meta) {
                    return '' + app.FormatNumber(data) + '';
                }
            },
            {
                "targets": [6],
                'render': function (data, type, full, meta) {
                    return '' + app.ConvertIntToDatetimeDT(data) + '';
                }
            },
            {
                "targets": [7],
                "visible": true,
                "orderable": false,
                "className": "text-center",
                'render': function (data, type, full, meta) {
                    if (data === "1") {
                        return "<center>" +
                            '<a class="btn btn-default btn-xs" style="margin-right:0.8em" title="Eliminar" href="javascript:Ventas.EliminarVenta(' + meta.row + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>' +
                            '<a class="btn btn-default btn-xs" style="margin-right:0.8em" title="Ver Tallas" href="javascript:Ventas.DetalleVenta(' + meta.row + ')"><i class="fa fa-eye" aria-hidden="true"></i></a>' +
                            "</center> ";
                    } else {
                        return "<center>" +
                            '<a class="btn btn-default btn-xs" style="margin-right:0.8em" title="Ver Tallas" href="javascript:Ventas.DetalleVenta(' + meta.row + ')"><i class="fa fa-eye" aria-hidden="true"></i></a>' +
                            "</center> ";
                    }
                }
            }
        ];

        var buttons = [{
            extend: 'excelHtml5',
            className: 'btn btn-success btn-sm ',
            customizeData: function (data) {
                for (var i = 0; i < data.body.length; i++) {
                    for (var j = 0; j < data.body[i].length; j++) {
                        data.body[i][j] = '\u200C' + data.body[i][j];
                    }
                }
            }

        }];

        var filters = {
            pageLength: app.Defaults.TablasPageLength
        };


        app.FillDataTableAjaxPaging($tblListadoVentas, url, parms, columns, columnDefs, filters, null, null);
    }

    function $btnBuscar_click() {
        if (ValidaBusqueda()) {
            GetVentas();
        }
    }

    function ValidaBusqueda() {
        var flag = true;
        var br = "<br>";
        var msg = "";

        var vcboTipoBusqueda = parseInt($cboTipoBusqueda.val());

        var Fecha = app.ConvertDatetimeToInt($txtFecha.val(), '/');

        switch (vcboTipoBusqueda) {

            case 2:
                msg += app.ValidarCampo(Fecha, "• La fecha.");
                break;

            default:
                msg = "";
                break;
        }

        if (msg !== "") {
            flag = false;
            var msgTotal = "Por favor, Ingrese los siguientes campos de la venta: " + br + msg;
            app.Message.Info("Aviso", msgTotal);
        }

        return flag;
    }

    function $btnNuevaVenta_click() {
        $modalVentas.modal();
        $formModal[0].reset();
        app.Event.SetDateDatepicket($txtModalFecha);
        Limpiar_cboModalTalla();
        DatosSeleccionados = [];
        NuevosDatosSeleccionados = [];
        LoadProductosSeleccionados(DatosSeleccionados);
        DatosSeleccionadosDetalle = { Data: [] };
        LoadTallasSeleccionadas(DatosSeleccionadosDetalle);
        PrecioProductos = [];
    }

    function $btnSaveVenta_click() {

        var total = app.FormatNumber($txtModalPrecioVenta.val());

        if (DatosSeleccionadosDetalle.Data.length > 0) {

            if (total > 0) {
                InsertUpdateVenta();
            } else if (total === 0) {
                app.Message.Info("Aviso", "Ingrese un precio de venta.", null, null);
            }
        }
        else {
            app.Message.Info("Aviso", "Agregar nuevos productos.", null, null);
        }
    }

    function InsertUpdateVenta() {
        var TallasSeleccionadas = [];
        DatosSeleccionadosDetalle.Data.map(function (v, i) {
            TallasSeleccionadas.push(v);
        });

        var obj = {
            "Precio_Prod": $txtModalPrecioProducto.val(),
            "Precio_Venta": $txtModalPrecioVenta.val(),
            "Descuento_Venta": $txtModalDescuento.val(),
            "Precio_Final": $txtModalTotal.val(),
            "Tallas_Venta": TallasSeleccionadas
        };

        var method = "POST";
        var url = "Ventas/InsertUpdateVentas";
        var data = obj;
        var fnDoneCallback = function (data) {
            app.Message.Success("Grabar", Message.GuardarSuccess, "Aceptar", null);
            GetVentas();
            $modalVentas.modal('hide');
        };
        app.CallAjax(method, url, data, fnDoneCallback, null, null, null);

    }

    function $btnProducto_click() {
        $modalProducto.modal();
        $cboTipoBusquedaModal.val(0).change();
        DatosSeleccionados = [];
        $.each(NuevosDatosSeleccionados, function (key, value) {
            var obj = {
                "Cod_Prod": value.Cod_Prod,
                "Marca_Prod": value.Marca_Prod,
                "Precio_Prod": value.Precio_Prod
            };
            DatosSeleccionados.push(obj);
        });
        NuevosDatosSeleccionados = [];
        LoadProductos();
    }

    function LoadProductos() {

        var url = "Ventas/GetProducto";
        var parms = {
            Cod_Prod: $txtCodigoModal.val().trim(),
            Marca_Prod: $txtMarcaModal.val().trim()
        };
        var columns = [
            { data: "Cod_Prod" },
            { data: "Stock_Prod" },
            { data: "Marca_Prod" },
            { data: "Precio_Prod" }
        ];
        var columnDefs = [
            {
                "targets": [3],
                "className": "text-right",
                'render': function (data, type, full, meta) {
                    return '' + app.FormatNumber(data) + '';
                }
            }
        ];

        var filters = {
            select: true
        };


        app.FillDataTableAjaxPaging($tblListadoProductos, url, parms, columns, columnDefs, filters, null, null);
    }

    function $btnSaveProducto_click() {

        NuevosDatosSeleccionados = $tblListadoProductos.DataTable().rows({ selected: true }).data().toArray();

        $.each(NuevosDatosSeleccionados, function (key, valueDS) {
            $.each(DatosSeleccionados, function (key, valueNDS) {
                if (valueNDS.Cod_Prod !== valueDS.Cod_Prod) {
                    var obj = {
                        "Cod_Prod": valueNDS.Cod_Prod,
                        "Marca_Prod": valueNDS.Marca_Prod,
                        "Precio_Prod": valueNDS.Precio_Prod
                    };
                    NuevosDatosSeleccionados.push(obj);
                }
            });
        });
        $tblListadoProductosSeleccionados.DataTable().clear().draw();
        LoadProductosSeleccionados(NuevosDatosSeleccionados);
        EventoSeleccionProducto();
        $modalProducto.modal('hide');

    }

    function $txtModalPrecioVenta_keypress() {
        var PrecioProducto = parseFloat(app.FormatNumber($txtModalPrecioProducto.val()));
        var PrecioVenta = parseFloat(app.FormatNumber($txtModalPrecioVenta.val()));

        if (PrecioProducto >= PrecioVenta) {
            var Descuento = PrecioProducto - PrecioVenta;
            $txtModalDescuento.val(app.FormatNumber(Descuento));
            $txtModalTotal.val(app.FormatNumber(PrecioVenta));
        } else {
            app.Message.Info("ERROR", "El precio del producto no puede ser mayor al  de venta", null, null);
            $txtModalPrecioVenta.val("");
        }
    }

    function $cboModalTalla_change() {
        var obj = {
            "Cod_Prod": $txtModalCodigo.val()
        };
        var method = "POST";
        var url = "Ventas/TallasProducto";
        var data = obj;
        var fnDoneCallback = function (data) {
            $.each(data.Data, function (key, value) {
                if ($cboModalTalla.val() === value.Talla) {
                    $txtModalCantidadMaxima.val(value.Cantidad);
                }
            });
        };
        app.CallAjax(method, url, data, fnDoneCallback);
        $txtModalCantidad.val('');
    }

    function EliminarVenta(row) {
        var fnAceptarCallback = function () {
            var rowSelect = app.GetValueRowCellOfDataTable($tblListadoVentas, row);
            var obj = {
                "Cod_Venta": rowSelect.Cod_Venta
            };

            var method = "POST";
            var url = "Ventas/DeleteVentas";
            var data = obj;
            var fnDoneCallback = function (data) {
                app.Message.Success("Aviso", Message.EliminarSuccess, "Aceptar", null);
                GetVentas();
                $modalVentas.modal('hide');
            };
            app.CallAjax(method, url, data, fnDoneCallback, null, null, null);

        };
        app.Message.Confirm("Aviso", "Esta seguro que desea eliminar el registro?", "Aceptar", "Cancelar", fnAceptarCallback, null);
    }

    function $btnBuscarModal_click() {
        LoadProductos();
    }

    function $btnGenerarExcel_click() {
        var FechaDesde = app.ConvertDatetimeToInt($txtFechaDesde.val(), '/');
        var FechaHasta = app.ConvertDatetimeToInt($txtFechaHasta.val(), '/');

        if (FechaDesde !== "" && FechaHasta !== "") {
            GenerarExcel();
        } else if (FechaDesde === "") {
            app.Message.Info("Aviso", "Falta ingresar la Fecha Desde", "Aceptar", null);
        }

    }

    function GenerarExcel() {

        var data = {
            FechaDesde: app.ConvertDatetimeToInt($txtFechaDesde.val(), '/'),
            FechaHasta: app.ConvertDatetimeToInt($txtFechaHasta.val(), '/')
        };

        var fnDoneCallback = function (data) {
            if (data.InternalStatus === 1 && data.Data.length > 0) {
                app.RedirectTo("Ventas/GenerarExcel");
            } else {
                app.Message.Info("Aviso", "No hay ventas con esas fechas", "Aceptar");
            }
        };
        app.CallAjax("POST", "Ventas/GetAllVentasMayor", data, fnDoneCallback);
    }

    function ValidarGenerarExcel() {
        var FechaDesde = app.ConvertDatetimeToInt($txtFechaDesde.val(), '/');
        var FechaHasta = app.ConvertDatetimeToInt($txtFechaHasta.val(), '/');

        if (FechaDesde > FechaHasta) {
            $txtFechaDesde.val("");
        }
    }

    function EliminarProductoSeleccionado(row) {

        var data = app.GetValueRowCellOfDataTable($tblListadoProductosSeleccionados, row);
        var ProductosSeleccionadas = [];
        var fnAceptarCallback = function () {

            NuevosDatosSeleccionados.map(function (v, i) {
                ProductosSeleccionadas.push(v);
            });

            var index = $.inArray(data, NuevosDatosSeleccionados);
            ProductosSeleccionadas.splice(index, 1);

            NuevosDatosSeleccionados = [];
            $.each(ProductosSeleccionadas, function (index, value) {
                var obj = {
                    "Cod_Prod": value.Cod_Prod,
                    "Marca_Prod": value.Marca_Prod,
                    "Precio_Prod": value.Precio_Prod
                };
                NuevosDatosSeleccionados.push(obj);
            });

            Limpiar_ProductosSeleccionados();
            LoadProductosSeleccionados(NuevosDatosSeleccionados);
            EventoSeleccionProducto();

            var cant_tallas = parseInt(0);
            var TallasSeleccionadas = [];
            DatosSeleccionadosDetalle.Data.map(function (v, i) {
                if (v.Cod_Prod === data.Cod_Prod) {
                    cant_tallas++;
                }
                TallasSeleccionadas.push(v);
            });

            for (var i = 0; i < cant_tallas; i++) {
                $.each(TallasSeleccionadas, function (i, item) {
                    if (item.Cod_Prod === data.Cod_Prod) {
                        TallasSeleccionadas.splice(i, 1);
                        return false;
                    }
                });
            }

            DatosSeleccionadosDetalle = { Data: [] };
            $.each(TallasSeleccionadas, function (index, value) {
                var obj = {
                    "Cod_Prod": value.Cod_Prod,
                    "Talla": value.Talla,
                    "Cantidad": value.Cantidad,
                    "Precio_Prod": value.Precio_Prod
                };
                DatosSeleccionadosDetalle.Data.push(obj);
            });
            LoadTallasSeleccionadas(DatosSeleccionadosDetalle);
            CalcularPrecioProductos();

        };

        var cant_detalle = parseInt(0);
        $.each(DatosSeleccionadosDetalle.Data, function (key, value) {
            if (value.Cod_Prod === data.Cod_Prod) {
                cant_detalle++;
            }
        });

        if (cant_detalle > 0) {
            app.Message.Confirm("Aviso", "Esta seguro que desea eliminar el producto, se eliminaran las tallas asociadas?", "Aceptar", "Cancelar", fnAceptarCallback, null);
            return false;
        }
        else {

            NuevosDatosSeleccionados.map(function (v, i) {
                ProductosSeleccionadas.push(v);
            });

            var index = $.inArray(data, NuevosDatosSeleccionados);
            ProductosSeleccionadas.splice(index, 1);

            NuevosDatosSeleccionados = [];
            $.each(ProductosSeleccionadas, function (index, value) {
                var obj = {
                    "Cod_Prod": value.Cod_Prod,
                    "Marca_Prod": value.Marca_Prod,
                    "Precio_Prod": value.Precio_Prod
                };
                NuevosDatosSeleccionados.push(obj);
            });

            Limpiar_ProductosSeleccionados();
            LoadProductosSeleccionados(NuevosDatosSeleccionados);
            EventoSeleccionProducto();
        }




    }

    function LoadProductosSeleccionados(data) {
        var table = $tblListadoProductosSeleccionados.DataTable({
            data: data,
            columns: [
                { data: "Cod_Prod" },
                { data: "Marca_Prod" },
                { data: "Precio_Prod" },
                { data: "Cod_Prod" }
            ],
            columnDefs: [

                {
                    "targets": [3],
                    "visible": true,
                    "className": "text-center",
                    'render': function (data, type, full, meta) {
                        return "<center>" +
                            '<a class="btn btn-default btn-xs"  title="Eliminar" href="javascript:Ventas.EliminarProductoSeleccionado(' + meta.row + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>' +
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

    function EventoSeleccionProducto() {
        var table = $tblListadoProductosSeleccionados.DataTable();

        table.on('select', function (e, dt, type, indexes) {
            var row = table.rows(indexes).data().toArray();
            if (row.length > 0) {
                $txtModalCodigo.val(row[0].Cod_Prod);
                Cargar_ComboTallas();
            }
        }).on('deselect', function (e, dt, type, indexes) {
            var row = table.rows(indexes).data().toArray();
            $txtModalCodigo.val('');
            $txtModalCantidadMaxima.val('');
            $txtModalCantidad.val('');
            Limpiar_cboModalTalla();
        });
    }

    function Cargar_ComboTallas() {

        var obj = {
            "Cod_Prod": $txtModalCodigo.val()
        };
        var method = "POST";
        var url = "Ventas/TallasProducto";
        var data = obj;
        var fnDoneCallback = function (data) {
            tallas = [];
            Limpiar_cboModalTalla();
            $.each(data.Data, function (key, value) {
                $cboModalTalla.append("<option value=" + value.Talla + ">" + value.Talla + "</option>");
                tallas.push(value);
            });

        };
        app.CallAjax(method, url, data, fnDoneCallback);

    }

    function $btnAgregarTalla_click() {

        var msj = ValidarAgregarTalla();

        if (msj !== null) {
            app.Message.Info("Aviso", msj, "Aceptar", null);
            return false;
        }

        var precio_prod = ObtenerPrecioVenta();

        var obj = {
            "Cod_Prod": parseInt($txtModalCodigo.val()),
            "Talla": $cboModalTalla.val(),
            "Cantidad": parseInt($txtModalCantidad.val()),
            "Precio_Prod": precio_prod
        };

        DatosSeleccionadosDetalle.Data.push(obj);

        LoadTallasSeleccionadas(DatosSeleccionadosDetalle);

        $cboModalTalla.val(-1);
        $txtModalCantidadMaxima.val('');
        $txtModalCantidad.val('');

        CalcularPrecioProductos();

        return false;

    }

    function LoadTallasSeleccionadas(DatosSeleccionadosDetalle) {
        var columns = [
            { data: "Cod_Prod" },
            { data: "Talla" },
            { data: "Cantidad" },
            { data: "Precio_Prod" },
            { data: "Cod_Prod" }
        ];
        var columnDefs = [

            {
                "targets": [4],
                "visible": true,
                "className": "text-center",
                'render': function (data, type, full, meta) {
                    return "<center>" +
                        '<a class="btn btn-default btn-xs"  title="Eliminar" href="javascript:Ventas.EliminarNroTalla(' + meta.row + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>' +
                        "</center> ";
                }
            }
        ];

        var filtros = {
            pageLength: 5
        };

        app.FillDataTable($tblListadoTallas, DatosSeleccionadosDetalle, columns, columnDefs, "#tblListadoTallas", filtros, null, null, null, null, true);
    }

    function EliminarNroTalla(row) {
        var data = app.GetValueRowCellOfDataTable($tblListadoTallas, row);

        var TallasSeleccionadas = [];
        DatosSeleccionadosDetalle.Data.map(function (v, i) {
            TallasSeleccionadas.push(v);
        });

        $.each(TallasSeleccionadas, function (i, item) {
            if (item.Cod_Prod === data.Cod_Prod && item.Talla === data.Talla) {
                TallasSeleccionadas.splice(i, 1);
                return false;
            }
        });

        DatosSeleccionadosDetalle = { Data: [] };
        $.each(TallasSeleccionadas, function (index, value) {
            var obj = {
                "Cod_Prod": value.Cod_Prod,
                "Talla": value.Talla,
                "Cantidad": value.Cantidad,
                "Precio_Prod": value.Precio_Prod
            };
            DatosSeleccionadosDetalle.Data.push(obj);
        });

        LoadTallasSeleccionadas(DatosSeleccionadosDetalle);
        CalcularPrecioProductos();

    }

    function ValidarAgregarTalla() {
        var msj = null;
        if ($cboModalTalla.val() === -1) {
            msj = "Ingrese la talla.";
            return msj;
        }

        if ($txtModalCantidad.val() === '' || $txtModalCantidad.val() === null) {
            msj = "Ingrese la cantidad.";
            return msj;
        }

        var TallasSeleccionadas = [];
        $.each(DatosSeleccionadosDetalle.Data, function (key, value) {
            var obj = {
                "Talla": value.Talla,
                "Cod_Prod": value.Cod_Prod
            };
            TallasSeleccionadas.push(obj);
        });

        var TallaSeleccionada = [];
        var objselector = {
            "Talla": $cboModalTalla.val(),
            "Cod_Prod": $txtModalCodigo.val()
        };
        TallaSeleccionada.push(objselector);

        for (var i = 0; i < TallasSeleccionadas.length; i++) {
            if (TallasSeleccionadas[i].Talla === TallaSeleccionada[0].Talla &&
                TallasSeleccionadas[i].Cod_Prod === TallaSeleccionada[0].Cod_Prod) {
                msj = "No se puede ingresar la misma talla.";
                $txtModalCantidad.val('');
                return msj;
            }
        }

        if (parseInt($txtModalCantidad.val()) > parseInt($txtModalCantidadMaxima.val())) {
            msj = "No se puede ingresar una cantidad mayor al stock talla.";
            $txtModalCantidad.val('');
            return msj;
        }

        return msj;
    }

    function ObtenerPrecioVenta() {
        var precio_prod = 0;
        $.each(NuevosDatosSeleccionados, function (key, value) {
            if (parseInt($txtModalCodigo.val()) === value.Cod_Prod) {
                precio_prod = value.Precio_Prod;
            }
        });

        return precio_prod;
    }

    function Limpiar_ProductosSeleccionados() {
        $txtModalCodigo.val('');
        $txtModalCantidadMaxima.val('');
        $txtModalCantidad.val('');
        Limpiar_cboModalTalla();
        $tblListadoProductosSeleccionados.DataTable().clear().draw();
    }

    function Limpiar_cboModalTalla() {
        $cboModalTalla.empty();
        $cboModalTalla.append("<option value='-1'>Seleccione</option>");
    }

    function CalcularPrecioProductos() {

        var precio_productos = parseInt(0);

        $.each(DatosSeleccionadosDetalle.Data, function (key, value) {
            precio_productos = precio_productos + (value.Precio_Prod * value.Cantidad);
        });

        $txtModalPrecioProducto.val(precio_productos);

    }

    function DetalleVenta(row) {
        var data = app.GetValueRowCellOfDataTable($tblListadoVentas, row);

        var obj = {
            "Cod_Venta": data.Cod_Venta
        };

        var method = "POST";
        var url = "Ventas/TallasVenta";
        var rsdata = obj;
        var fnDoneCallback = function (data) {
            $modalTallas.modal();
            LoadTallaMayor(data);
        };
        app.CallAjax(method, url, rsdata, fnDoneCallback, null, null, null);

    }

    function LoadTallaMayor(data) {
        var columns = [
            { data: "Talla" },
            { data: "Cod_Prod" },
            { data: "Producto.Marca_Prod" },
            { data: "Cantidad" },
            { data: "Precio_Prod" }
        ];

        var filtros = {
            pageLength: 10
        };
        app.FillDataTable($tblTallasVenta, data, columns, null, "#tblTallasVenta", filtros, null, null, null, null, true);
    }

    return {
        EliminarVenta: EliminarVenta,
        DetalleVenta: DetalleVenta,
        EliminarNroTalla: EliminarNroTalla,
        EliminarProductoSeleccionado: EliminarProductoSeleccionado
    };


})(window.jQuery, window, document);