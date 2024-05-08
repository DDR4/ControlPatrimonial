var Producto = (function ($, win, doc) {

    var $btnNuevaProducto = $('#btnNuevaProducto');
    var $cboTipoBusqueda = $('#cboTipoBusqueda');

    var $tipoCodigo = $('#tipoCodigo');
    var $tipoMarca = $('#tipoMarca');
    var $tipoEstado = $('#tipoEstado');

    var $txtCodigo = $('#txtCodigo');
    var $txtMarca = $('#txtMarca');
    var $cboEstado = $('#cboEstado');

    var $btnBuscar = $('#btnBuscar');

    var $tblListadoProductos = $('#tblListadoProductos');

    // Modal
    var $modalProducto = $('#modalProducto');
    var $titleModalProducto = $('#titleModalProducto');
    var $formModal = $('#formModal');
    var $txtModalCodigo = $('#txtModalCodigo');
    var $txtModalMarca = $('#txtModalMarca');
    var $txtModalTalla = $('#txtModalTalla');
    var $txtModalPrecio = $('#txtModalPrecio');
    var $txtModalStock = $('#txtModalStock');
    var $btnSaveProducto = $('#btnSaveProducto');
    var $txtModalTallaVendida = $('#txtModalTallaVendida');
    var $txtModalCantidad = $('#txtModalCantidad');

    var $btnAgregarTalla = $('#btnAgregarTalla');
    var $tblListadoTallas = $('#tblListadoTallas');
    var $cboModalTipoProducto = $('#cboModalTipoProducto');
    var $cboModalEstado = $('#cboModalEstado');

    var $btnGenerarExcel = $('#btnGenerarExcel');
    var $txtFechaDesde = $('#txtFechaDesde');
    var $txtFechaHasta = $('#txtFechaHasta');

    var Message = {
        ObtenerTipoBusqueda: "Obteniendo los tipos de busqueda, Por favor espere...",
        GuardarSuccess: "Los datos se guardaron satisfactoriamente"
    };


    var Global = {
        IdProducto: null
    };

    var dataTallas = { Data: [] };


    // Constructor
    $(Initialize);

    // Implementacion del constructor
    function Initialize() {

        $cboTipoBusqueda.change($cboTipoBusqueda_change);

        $btnBuscar.click($btnBuscar_click);
        $btnSaveProducto.click($btnSaveProducto_click);
        $btnNuevaProducto.click($btnNuevaProducto_click);
        $btnAgregarTalla.click($btnAgregarTalla_click);
        GetProducto();

        app.Event.ForceNumericOnly($txtModalCodigo);
        app.Event.Number($txtModalStock);
        app.Event.ForceDecimalOnly($txtModalPrecio);
        app.Event.Number($txtCodigo);

        app.Event.Blur($txtModalPrecio, "N");

       
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
               
    }

    function $cboTipoBusqueda_change() {
        var codSelec = $(this).val();
        //$('#form1')[0].reset();
        $tipoCodigo.hide();
        $tipoMarca.hide();
        $tipoEstado.hide();

        $txtCodigo.val("");
        $txtMarca.val("");
        $cboEstado.val(0);

        if (codSelec === "1") {
            $tipoCodigo.show();
        }
        else if (codSelec === "2") {
            $tipoMarca.show();
        }
        else if (codSelec === "3") {
            $tipoEstado.show();
        }

    }

    function $btnNuevaProducto_click() {
        $formModal[0].reset();
        app.Event.Enable($txtModalCodigo);
        Global.IdProducto = null;
        $modalProducto.modal();
        dataTallas = { Data: [] };
        LoadTallas(dataTallas);
        $cboModalEstado.val(1).trigger('change');
        $titleModalProducto.html("Agregar Producto");
        app.Event.Disabled($cboModalEstado);

    }

    function $btnBuscar_click() {
        if (ValidaBusqueda()) {
            GetProducto();
        }
    }

    function $btnSaveProducto_click() {
        if (Validar()) {
            InsertUpdateProducto();
        }
    }

    function $btnAgregarTalla_click(e) {


        if ($txtModalTalla.val() === '' || $txtModalTalla.val() === null) {
            app.Message.Info("Aviso", "Ingrese la talla", "Aceptar", null);
            return false;
        }

        if ($txtModalCantidad.val() === '' || $txtModalCantidad.val() === null) {
            app.Message.Info("Aviso", "Ingrese la cantidad", "Aceptar", null);
            return false;
        }

        var tallas = [];
        dataTallas.Data.map(function (v, i) {
            tallas.push(v.Talla);
        });

        var repetido = tallas.indexOf($txtModalTalla.val());
        if (repetido !== -1) {
            app.Message.Info("Aviso", "No se puede ingresar la misma talla", "Aceptar", null);
            return false;
        }

        var obj = {
            "Talla": $txtModalTalla.val(),
            "Cantidad": $txtModalCantidad.val()
        };

        dataTallas.Data.push(obj);

        LoadTallas(dataTallas);

        $txtModalTalla.val('');
        $txtModalCantidad.val('');

        return false;

    }

    function Validar() {
        var flag = true;
        var br = "<br>";
        var msg = "";
        var Cod_Prod = $txtModalCodigo.val();
        var Marca_Prod = $txtModalMarca.val();
        var Precio_Prod = $txtModalPrecio.val();

        msg += app.ValidarCampo(Cod_Prod, "• El código.");
        msg += app.ValidarCampo(Marca_Prod, "• La marca.");
        msg += app.ValidarCampo(Precio_Prod, "• El precio.");
        msg += app.ValidarCampo($cboModalTipoProducto.val(), "• El tipo de producto.");
        msg += app.ValidarCampo($cboModalEstado.val(), "• El estado.");
        if (dataTallas.Data.length === 0) {
            msg += "• Las tallas.";
        }


        if (msg !== "") {
            flag = false;
            var msgTotal = "Por favor, Ingrese los siguientes campos del producto: " + br + msg;
            app.Message.Info("Aviso", msgTotal);
        }

        return flag;
    }

    function ValidaBusqueda() {
        var flag = true;
        var br = "<br>";
        var msg = "";

        var vcboTipoBusqueda = parseInt($cboTipoBusqueda.val());

        var Cod_Prod = $txtCodigo.val().trim();
        var Marca_Prod = $txtMarca.val().trim();
        var Estado_Prod = $cboEstado.val().trim();

        switch (vcboTipoBusqueda) {
            case 1:
                msg += app.ValidarCampo(Cod_Prod, "• El código.");
                break;
            case 2:
                msg += app.ValidarCampo(Marca_Prod, "• La marca.");
                break;
            case 3:
                msg += app.ValidarCampo(Estado_Prod, "• El Estado.");
                break;

            default:
                msg = "";
                break;
        }

        if (msg !== "") {
            flag = false;
            var msgTotal = "Por favor, Ingrese los siguientes campos del producto: " + br + msg;
            app.Message.Info("Aviso", msgTotal);
        }

        return flag;
    }

    function InsertUpdateProducto() {
        var tallas = [];
        dataTallas.Data.map(function (v, i) {
            var objtalla = {
                "Talla": v.Talla,
                "CodigoProducto": $txtModalCodigo.val(),
                "Cantidad": v.Cantidad
            };
            tallas.push(objtalla);
        });

        var obj = {
            "IdProducto": Global.IdProducto,
            "Cod_Prod": $txtModalCodigo.val(),
            "Marca_Prod": $txtModalMarca.val(),
            "Tallas_Prod": tallas,
            "Precio_Prod": app.UnformatNumber($txtModalPrecio.val()),
            "Tipo_Prod": $cboModalTipoProducto.val(),
            "Estado_Prod": $cboModalEstado.val()
        };
        var method = "POST";
        var url = "Producto/InsertUpdateProducto";
        var data = obj;
        var fnDoneCallback = function (data) {
            app.Message.Success("Grabar", Message.GuardarSuccess, "Aceptar", null);
            GetProducto();
            $modalProducto.modal('hide');
            dataTallas = { Data: [] };
        };
        app.CallAjax(method, url, data, fnDoneCallback, null, null, null);

    }

    function GetProducto() {
        var parms = {
            Cod_Prod: $txtCodigo.val(),
            Marca_Prod: $txtMarca.val(),
            Estado_Prod: $cboEstado.val()
        };

        var url = "Producto/GetProducto";


        var columns = [
            { data: "Cod_Prod" },
            { data: "Stock_Prod" },
            { data: "Marca_Prod" },
            { data: "Precio_Prod" },
            { data: "Estado_Prod" },
            { data: "FechaDesde" },
            { data: "Auditoria.TipoUsuario" }

        ];
        var columnDefs = [
            {
                "targets": [3],
                "className": "text-right",
                'render': function (data, type, full, meta) {
                    return '' + app.FormatNumber(data) + '';
                }
            },
            {
                "targets": [4],
                "className": "text-center",
                'render': function (data, type, full, meta) {
                    if (data === 1) {
                        return "Activo";
                    } else return "Inactivo";

                }
            },
            {
                "targets": [5],
                'render': function (data, type, full, meta) {
                    return '' + app.ConvertIntToDatetimeDT(data) + '';
                }
            },
            {
                "targets": [6],
                "visible": true,
                "orderable": false,
                "className": "text-center",
                'render': function (data, type, full, meta) {
                    if (data === "1") {
                        return "<center>" +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Editar" href="javascript:Producto.EditarProducto(' + meta.row + ');"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>' +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Eliminar" href="javascript:Producto.EliminarProducto(' + meta.row + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>' +
                            "</center> ";
                    } else {
                        return "";
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

                return data;
            }

        }];

        var filters = {
            pageLength: app.Defaults.TablasPageLength
        };                     
        app.FillDataTableAjaxPaging($tblListadoProductos, url, parms, columns, columnDefs, filters, null, null);
    }

    function EditarProducto(row) {
        var data = app.GetValueRowCellOfDataTable($tblListadoProductos, row);
        $titleModalProducto.html("Editar Producto");

        $modalProducto.modal();
        Global.IdProducto = data.IdProducto;
        $txtModalCodigo.val(data.Cod_Prod);
        $txtModalMarca.val(data.Marca_Prod);
        $txtModalPrecio.val(app.FormatNumber(data.Precio_Prod));
        $txtModalStock.val(data.Stock_Prod);
        app.Event.Disabled($txtModalCodigo);
        app.Event.Enable($cboModalEstado);
        $cboModalEstado.val(data.Estado_Prod).trigger('change');
        $cboModalTipoProducto.val(data.Tipo_Prod).trigger('change');
        FillTableTalla(data);
    }

    function EliminarProducto(row) {
        var fnAceptarCallback = function () {
            var data = app.GetValueRowCellOfDataTable($tblListadoProductos, row);

            var obj = {
                "IdProducto": data.IdProducto,
                "Cod_Prod": data.Cod_Prod
            };

            var method = "POST";
            var url = "Producto/DeleteProducto";
            var data1 = obj;
            var fnDoneCallback = function (data) {
                GetProducto();
            };
            app.CallAjax(method, url, data1, fnDoneCallback, null, null, null);
        };
        app.Message.Confirm("Aviso", "Esta seguro que desea eliminar el producto?", "Aceptar", "Cancelar", fnAceptarCallback, null);
    }

    function FillTableTalla(data) {
        dataTallas = { Data: [] };

        var obj = {
            "Cod_Prod": data.Cod_Prod
        };

        var method = "POST";
        var url = "Producto/TallasProducto";
        var rsdata = obj;
        var fnDoneCallback = function (data) {

            $.each(data.Data, function (index, value) {
                var obj = {
                    "Talla": value.Talla,
                    "Cantidad": value.Cantidad
                };
                dataTallas.Data.push(obj);
            });
            LoadTallas(dataTallas);
        };
        app.CallAjax(method, url, rsdata, fnDoneCallback);
    }

    function LoadTallas(dataTallas) {
        var columns = [
            { data: "Talla" },
            { data: "Cantidad" },
            { data: "Talla" }
        ];
        var columnDefs = [

            {
                "targets": [2],
                "visible": true,
                "className": "text-center",
                'render': function (data, type, full, meta) {
                    return "<center>" +
                        '<a class="btn btn-default btn-xs"  title="Eliminar" href="javascript:Producto.EliminarNroTalla(' + meta.row + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>' +
                        "</center> ";
                }
            }
        ];

        var filtros = {
            pageLength: 5,
            filter: false
        };

        app.FillDataTable($tblListadoTallas, dataTallas, columns, columnDefs, "#tblListadoTallas", filtros, null, null, null, null, true);
    }

    function EliminarNroTalla(row) {
        var data = app.GetValueRowCellOfDataTable($tblListadoTallas, row);

        var tallas = [];
        dataTallas.Data.map(function (v, i) {
            tallas.push(v);
        });

        var index = $.inArray(data, tallas);
        tallas.splice(index, 1);

        dataTallas = { Data: [] };
        $.each(tallas, function (index, value) {
            var obj = {
                "Talla": value.Talla,
                "Cantidad": value.Cantidad
            };
            dataTallas.Data.push(obj);
        });

        LoadTallas(dataTallas);

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
            Cod_Prod: $txtCodigo.val(),
            Marca_Prod: $txtMarca.val(),
            Estado_Prod: $cboEstado.val(),
            FechaDesde: app.ConvertDatetimeToInt($txtFechaDesde.val(), '/'),
            FechaHasta: app.ConvertDatetimeToInt($txtFechaHasta.val(), '/')
        };

        var fnDoneCallback = function (data) {
            if (data.InternalStatus === 1 && data.Data.length > 0) {
                app.RedirectTo("Producto/GenerarExcel");
            } else {
                app.Message.Info("Aviso", "No hay productos con esas fechas", "Aceptar");
            }
        };
        app.CallAjax("POST", "Producto/GetAllProductos", data, fnDoneCallback);
    }

    function ValidarGenerarExcel() {
        var FechaDesde = app.ConvertDatetimeToInt($txtFechaDesde.val(), '/');
        var FechaHasta = app.ConvertDatetimeToInt($txtFechaHasta.val(), '/');     
        
        if (FechaDesde > FechaHasta) {
            $txtFechaDesde.val("");
        }
    }


    return {
        EliminarProducto: EliminarProducto,
        EditarProducto: EditarProducto,
        EliminarNroTalla: EliminarNroTalla
    };


})(window.jQuery, window, document);