var Usuario = (function ($, win, doc) {

    var $btnNuevoUsuario = $('#btnNuevoUsuario');
    var $btnGuardar = $('#btnGuardar');

    var $tblListadoUsuarios = $('#tblListadoUsuarios');

    var $cboTipoBusqueda = $('#cboTipoBusqueda');
    var $tipoDni = $('#tipoDni');
    var $txtDni = $('#txtDni');
    var $tipoNombre = $('#tipoNombre');
    var $txtNombre = $('#txtNombre');
    var $tipoEstado = $('#tipoEstado');
    var $cboEstado = $('#cboEstado');
    var $btnBuscar = $('#btnBuscar');

    // Modal
    var $modalUsuario = $('#modalUsuario');
    var $txtModalDni = $('#txtModalDni');
    var $txtModalNombre = $('#txtModalNombre');
    var $txtModalApellido = $('#txtModalApellido');
    var $txtModalClave = $('#txtModalClave');
    var $cboModalEstado = $('#cboModalEstado');
    var $titleModalUsuario = $('#titleModalUsuario');
    var $cboModalUnidadOrganica = $('#cboModalUnidadOrganica');
    var $cboModalSede = $('#cboModalSede');
    var $cboModalRol = $('#cboModalRol');

    var Message = {
        GuardarSuccess: "Los datos se guardaron satisfactoriamente"
    };

    var Global = {
        Usuario_Id: null
    };

    // Constructor
    $(Initialize);

    // Implementacion del constructor
    function Initialize() {
        $cboTipoBusqueda.change($cboTipoBusqueda_change);
        $btnBuscar.click($btnBuscar_click);
        $btnNuevoUsuario.click($btnNuevoUsuario_click);
        $btnGuardar.click($btnGuardar_click);
        GetUsuario();
        GetRol();
        GetUnidadOrganica();
        GetSede();
        app.Event.Number($txtDni);
        app.Event.Number($txtModalDni);
    }

    function $btnNuevoUsuario_click() {
        $titleModalUsuario.html("Nuevo Usuario");
        $modalUsuario.modal();
        Global.Usuario_Id = null;
        $txtModalNombre.val("");
        $txtModalApellido.val("");
        $txtModalDni.val("");
        $txtModalClave.val("Reniec01");
        $cboModalRol.val(0);
        $cboModalUnidadOrganica.val(0);
        $cboModalSede.val(0);
        $cboModalEstado.val(1);
        app.Event.Disabled($cboModalEstado);
        app.Event.Disabled($txtModalClave);
    }

    function $btnGuardar_click() {
        if (ValidarGuardarUsuario()) {
            InsertUpdateUsuario();
        }
    }

    function InsertUpdateUsuario() {

        var obj = {
            "Usuario_Id": Global.Usuario_Id,
            "Nombres": $txtModalNombre.val(),
            "Apellidos": $txtModalApellido.val(),
            "Dni": $txtModalDni.val(),
            "Clave": $txtModalClave.val(),
            "Rol": {
                "Rol_Id": $cboModalRol.val()
            },
            "UnidadOrganica": {
                "UnidadOrganica_Id": $cboModalUnidadOrganica.val()
            },
            "Sede": {
                "Sede_Id": $cboModalSede.val()
            },
            "Estado": {
                "Estado_Id": $cboModalEstado.val()
            }
        };

        var method = "POST";
        var data = obj;
        var url = "Usuario/InsertUpdateUsuario";

        var fnDoneCallback = function (data) {
            if (data.Data) {
                app.Message.Info("Aviso", "El Dni ingresado ya existe");
            } else {
                app.Message.Success("Grabar", Message.GuardarSuccess, "Aceptar", null);
                $modalUsuario.modal('hide');
                GetUsuario();
            }
        };
        app.CallAjax(method, url, data, fnDoneCallback);
    }

    function $cboTipoBusqueda_change() {
        var codSelec = $(this).val();
        $tipoDni.hide();
        $tipoNombre.hide();
        $tipoEstado.hide();

        $txtDni.val("");
        $txtNombre.val("");
        $cboEstado.val(0);

        if (codSelec === "1") {
            $tipoDni.show();
        } else if (codSelec === "2") {
            $tipoNombre.show();
        } else if (codSelec === "3") {
            $tipoEstado.show();
        }
    }

    function $btnBuscar_click() {
        GetUsuario();
    }

    function GetUsuario() {
        var parms = {
            Dni: $txtDni.val(),
            Nombres: $txtNombre.val(),
            Estado:
            {
                Estado_Id: $cboEstado.val()
            }
        };

        var url = "Usuario/GetUsuario";

        var columns = [
            { data: "Nombres" },
            { data: "Apellidos" },
            { data: "Dni" },
            { data: "Rol.Descripcion" },
            { data: "UnidadOrganica.Descripcion" },
            { data: "Sede.Descripcion" },
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
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Editar" href="javascript:Usuario.EditarUsuario(' + meta.row + ');"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>' +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Eliminar" href="javascript:Usuario.EliminarUsuario(' + meta.row + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>' +
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
        app.FillDataTableAjaxPaging($tblListadoUsuarios, url, parms, columns, columnDefs, filters, null, null);

    }

    function EditarUsuario(row) {
        var data = app.GetValueRowCellOfDataTable($tblListadoUsuarios, row);
        $titleModalUsuario.html("Editar Usuario");
        
        $modalUsuario.modal();
        Global.Usuario_Id = data.Usuario_Id;
        $txtModalNombre.val(data.Nombres);
        $txtModalApellido.val(data.Apellidos);
        $txtModalDni.val(data.Dni);
        $txtModalClave.val(data.Clave);
        app.Event.Enable($txtModalClave);
        app.Event.Enable($cboModalEstado);
        $cboModalRol.val(data.Rol.Rol_Id).trigger('change');
        $cboModalUnidadOrganica.val(data.UnidadOrganica.UnidadOrganica_Id).trigger('change');
        $cboModalSede.val(data.Sede.Sede_Id).trigger('change');
        $cboModalEstado.val(data.Estado.Estado_Id).trigger('change');
    }

    function EliminarUsuario(row) {
        var fnAceptarCallback = function () {
            var data = app.GetValueRowCellOfDataTable($tblListadoUsuarios, row);

            var obj = {
                "Usuario_Id": data.Usuario_Id
            };

            var method = "POST";
            var url = "Usuario/DeleteUsuario";
            var rsdata = obj;
            var fnDoneCallback = function (data) {
                GetUsuario();
            };
            app.CallAjax(method, url, rsdata, fnDoneCallback, null, null, null);
        };
        app.Message.Confirm("Aviso", "Esta seguro que desea desactivar el usuario?", "Aceptar", "Cancelar", fnAceptarCallback, null);
    }

    function GetRol() {
        var method = "POST";
        var url = "Combos/GetRol";
        var fnDoneCallback = function (data) {
            for (var i = 0; i < data.Data.length; i++) {
                $cboModalRol.append('<option value=' + data.Data[i].Rol_Id + '>' + data.Data[i].Descripcion + '</option>');
            }
        };
        app.CallAjax(method, url, null, fnDoneCallback, null, null, null);
    }

    function GetUnidadOrganica() {
        var method = "POST";
        var url = "Combos/GetUnidadOrganica";
        var fnDoneCallback = function (data) {
            for (var i = 0; i < data.Data.length; i++) {
                $cboModalUnidadOrganica.append('<option value=' + data.Data[i].UnidadOrganica_Id + '>' + data.Data[i].Descripcion + '</option>');
            }
        };
        app.CallAjax(method, url, null, fnDoneCallback, null, null, null);
    }

    function GetSede() {
        var method = "POST";
        var url = "Combos/GetSede";
        var fnDoneCallback = function (data) {
            for (var i = 0; i < data.Data.length; i++) {
                $cboModalSede.append('<option value=' + data.Data[i].Sede_Id + '>' + data.Data[i].Descripcion + '</option>');
            }
        };
        app.CallAjax(method, url, null, fnDoneCallback, null, null, null);
    }

    function ValidarGuardarUsuario() {
        var validar = true;
        var br = "<br>"
        var msg = "";
        var Dni = $txtModalDni.val();
        var Nombre = $txtModalNombre.val();
        var Apellido = $txtModalApellido.val();
        var Clave = $txtModalClave.val();
        var UnidadOrganica = parseInt($cboModalUnidadOrganica.val());
        var Sede = parseInt($cboModalSede.val());
        var Rol = parseInt($cboModalRol.val());

        msg += app.ValidarCampo(Dni, "• El Dni.");
        msg += app.ValidarCampo(Nombre, "• El Nombre.");
        msg += app.ValidarCampo(Apellido, "• El Apellido.");
        msg += app.ValidarCampo(Clave, "• La Contraseña.");
        msg += app.ValidarCampo(UnidadOrganica, "• La Unidad Orgánica.");
        msg += app.ValidarCampo(Sede, "• La Sede.");
        msg += app.ValidarCampo(Rol, "• El Rol.");

        if (msg != "") {
            validar = false;
            var msgTotal = "Por favor, Ingrese los siguientes campos del Usuario: " + br + msg;
            app.Message.Info("Aviso", msgTotal);
        }
        else if (Dni.length < 8) {
            validar = false;
            app.Message.Info("Aviso", "El Dni debe tener minimo 8 dígitos");
        }

        return validar;
    }

    return {
        EditarUsuario: EditarUsuario,
        EliminarUsuario: EliminarUsuario
    };


})(window.jQuery, window, document);