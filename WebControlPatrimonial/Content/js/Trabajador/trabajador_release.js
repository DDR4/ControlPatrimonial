var Trabajador = (function ($, win, doc) {

    var $btnNuevoTrabajador = $('#btnNuevoTrabajador');
    var $btnGuardar = $('#btnGuardar');

    var $tblListadoTrabajadores = $('#tblListadoTrabajadores');

    // Modal
    var $modalTrabajador = $('#modalTrabajador');  
    var $txtModalUsuario = $('#txtModalUsuario');  
    var $txtModalClave = $('#txtModalClave');  
    var $cboModalTipo = $('#cboModalTipo');  
    var $txtModalNombres = $('#txtModalNombres');  
    var $txtModalApellidoP = $('#txtModalApellidoP');  
    var $txtModalApellidoM = $('#txtModalApellidoM');    
    var $cboModalArea = $('#cboModalArea');  
    var $cboModalTurno = $('#cboModalTurno');  
    var $cboModalCargo = $('#cboModalCargo');
    var $txtModalFechaI = $('#txtModalFechaI');       
    var $txtModalCorreo = $('#txtModalCorreo');  
    var $cboModalSexo = $('#cboModalSexo');              
    var $cboModalEstado = $('#cboModalEstado');           
    var $cboModalTipoDoc = $('#cboModalTipoDoc');    
    var $txtModalNumDoc = $('#txtModalNumDoc');    
    var $txtModalSueldo = $('#txtModalSueldo');                      
    var $titleModalTrabajador = $('#titleModalTrabajador');

    var $checkboxEsSalud = $('#checkboxEsSalud');
    var $checkboxEPS = $('#checkboxEPS');
    var $rbnHabitat = $('#rbnHabitat');
    var $rbnIntegra = $('#rbnIntegra');
    var $rbnPrima = $('#rbnPrima');
    var $rbnProFuturo = $('#rbnProFuturo');
    var $rbnComisionFlujoAFP = $('#rbnComisionFlujoAFP');
    var $rbnComisionMixtaAFP = $('#rbnComisionMixtaAFP');
    var $rbnComisionAFP = $('#rbnComisionAFP');

    var $cboTipoBusqueda = $('#cboTipoBusqueda');
    var $tipoNombre = $('#tipoNombre');
    var $tipoEstado = $('#tipoEstado');
    var $txtNombre = $('#txtNombre');
    var $cboEstado = $('#cboEstado');
    var $btnBuscar = $('#btnBuscar');
    
                                                                    
                                                   
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

        $btnNuevoTrabajador.click($btnNuevoTrabajador_click);
        $btnGuardar.click($btnGuardar_click);
        GetTrabajador();
        GetArea();
        GetTurno();
        GetCargo();
        GetTipoDocumento();
        $txtModalFechaI.datepicker({
            endDate: "today",
            todayHighlight: true
        });                 
        $cboTipoBusqueda.change($cboTipoBusqueda_change);
        $btnBuscar.click($btnBuscar_click);
    }

    function $btnNuevoTrabajador_click() {
        $titleModalTrabajador.html("Nuevo Trabajador");
        $modalTrabajador.modal();
        Global.Trabajador_Id = null;
        $txtModalUsuario.val("");
        $txtModalClave.val("");
        $txtModalNombres.val("");
        $txtModalApellidoP.val("");
        $txtModalApellidoM.val("");
        $cboModalArea.val(0);
        $cboModalTurno.val(0);
        $cboModalCargo.val(0);
        $txtModalFechaI.val("");
        $txtModalCorreo.val("");
        $cboModalSexo.val(0);
        $cboModalTipo.val(0);
        $cboModalEstado.val(1);
        $cboModalTipoDoc.val(0),
        $txtModalNumDoc.val(""),
        $txtModalSueldo.val(""),
        app.Event.Disabled($cboModalEstado);
        $checkboxEsSalud.prop('checked', true);
        app.Event.Disabled($checkboxEsSalud);
        $checkboxEPS.prop('checked', false);
        $rbnHabitat.prop('checked', false);
        $rbnIntegra.prop('checked', false);
        $rbnPrima.prop('checked', false);
        $rbnProFuturo.prop('checked', false);
        $rbnComisionFlujoAFP.prop('checked', false);
        $rbnComisionMixtaAFP.prop('checked', false);

    }

    function $btnGuardar_click() {
        InsertUpdateTrabajador();
    }

    function InsertUpdateTrabajador() {

        var obj = {
            "Trabajador_Id": Global.Trabajador_Id,
            "Usuario": $txtModalUsuario.val(),
            "Contraseña": $txtModalClave.val(),
            "Nombres": $txtModalNombres.val(),
            "ApellidoPaterno": $txtModalApellidoP.val(),
            "ApellidoMaterno": $txtModalApellidoM.val(),
            "FechaIngreso": $txtModalFechaI.val(),
            "Correo": $txtModalCorreo.val(),
            "Sexo": $cboModalSexo.val(),
            "TipoDocumento": $cboModalTipoDoc.val(),
            "NumeroDocumento": $txtModalNumDoc.val(),
            "Salud": GetSaludChecked(),
            "AFP": $("input[name='rbnAFP']:checked").val(),
            "ComisionAFP": $("input[name='rbnComisionAFP']:checked").val(),
            "Estado": $cboModalEstado.val(),
            "Tipo": $cboModalTipo.val(),
            "Area": { "Area_Id": $cboModalArea.val() },
            "Turno": { "Turno_Id": $cboModalTurno.val() },
            "Cargo": { "Cargo_Id": $cboModalCargo.val() }        
        };

        var method = "POST";
        var data = obj;
        var url = "Trabajador/InsertUpdateTrabajador";

        var fnDoneCallback = function (data) {
            app.Message.Success("Grabar", Message.GuardarSuccess, "Aceptar", null);
            $modalTrabajador.modal('hide');
            GetTrabajador();
        };
        app.CallAjax(method, url, data, fnDoneCallback);
    }

    function GetTrabajador() {
        var parms = {
            Estado: $cboEstado.val(),
            Nombres: $txtNombre.val(),
            Trabajador_Id: null
        };

        var url = "Trabajador/GetTrabajador";

        var columns = [
            { data: "Nombres" },
            { data: "ApellidoPaterno" },       
            { data: "ApellidoMaterno" },    
            { data: "Area.Descripcion" },
            { data: "Turno.Descripcion" },
            { data: "Cargo.Descripcion" },
            { data: "Tipo" },
            { data: "Estado" }, 
            { data: "Auditoria.TipoUsuario" }
        ];
        var columnDefs = [
            {
                "targets": [6],
                'render': function (data, type, full, meta) {
                    if (data === 1) {
                        return "Administrador";
                    } else return "Trabajador";

                }
            },
            {
                "targets": [7],
                'render': function (data, type, full, meta) {
                    if (data === 1) {
                        return "Activo";
                    } else return "Inactivo";

                }
            },
            {
                "targets": [8],
                "visible": true,
                "orderable": false,
                "className": "text-center",
                'render': function (data, type, full, meta) {
                    if (data === "1") {
                        return "<center>" +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Editar" href="javascript:Trabajador.EditarTrabajador(' + meta.row + ');"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>' +
                            '<a class="btn btn-default btn-xs" style= "margin-right:0.5em" title="Eliminar" href="javascript:Trabajador.EliminarTrabajador(' + meta.row + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>' +
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
        app.FillDataTableAjaxPaging($tblListadoTrabajadores, url, parms, columns, columnDefs, filters, null, null);

    }

    function EditarTrabajador(row) {
        var data = app.GetValueRowCellOfDataTable($tblListadoTrabajadores, row);
        $titleModalTrabajador.html("Editar Trabajador");

        $modalTrabajador.modal();
        Global.Trabajador_Id = data.Trabajador_Id;
        $txtModalNombres.val(data.Nombres);
        $txtModalApellidoP.val(data.ApellidoPaterno);
        $txtModalApellidoM.val(data.ApellidoMaterno);
        $cboModalTipoDoc.val(data.TipoDocumento);
        $txtModalNumDoc.val(data.NumeroDocumento);
        $cboModalSexo.val(data.Sexo).trigger('change');
        $cboModalArea.val(data.Area.Area_Id);
        $cboModalCargo.val(data.Cargo.Cargo_Id);
        $txtModalFechaI.val(app.ConvertDate(data.FechaIngreso));
        $txtModalCorreo.val(data.Correo);
        $cboModalTurno.val(data.Turno.Turno_Id);           
        $txtModalUsuario.val(data.Usuario);
        $txtModalClave.val(data.Contraseña);
        $txtModalSueldo.val(data.Sueldo);
        $cboModalTipo.val(data.Auditoria.TipoUsuario).trigger('change');
        $cboModalEstado.val(data.Estado).trigger('change');
        GetSalud(data.Salud);
        GetAFP(data.AFP);
        GetComisionAFP(data.ComisionAFP);
        app.Event.Enable($cboModalEstado);
        app.Event.Disabled($checkboxEsSalud);                                                                                
  
    }

    function EliminarTrabajador(row) {
        var fnAceptarCallback = function () {
            var data = app.GetValueRowCellOfDataTable($tblListadoTrabajadores, row);

            var obj = {
                "Trabajador_Id": data.Trabajador_Id
            };

            var method = "POST";
            var url = "Trabajador/DeleteTrabajador";
            var rsdata = obj;
            var fnDoneCallback = function (data) {
                GetTrabajador();
            };
            app.CallAjax(method, url, rsdata, fnDoneCallback, null, null, null);
        };
        app.Message.Confirm("Aviso", "Esta seguro que desea eliminar el trabajador?", "Aceptar", "Cancelar", fnAceptarCallback, null);
    }

    function GetArea() {              
        var method = "POST";
        var url = "Combos/GetArea";
        var fnDoneCallback = function (data) {  
            for (var i = 0; i < data.Data.length; i++) {
                $cboModalArea.append('<option value=' + data.Data[i].Area_Id + '>' + data.Data[i].Descripcion + '</option>');
            }
          
        };
        app.CallAjax(method, url, null, fnDoneCallback, null, null, null);          
    }

    function GetTurno() {
        var method = "POST";
        var url = "Combos/GetTurno";
        var fnDoneCallback = function (data) {
            for (var i = 0; i < data.Data.length; i++) {
                $cboModalTurno.append('<option value=' + data.Data[i].Turno_Id + '>' + data.Data[i].Descripcion + '</option>');
            }
        };
        app.CallAjax(method, url, null, fnDoneCallback, null, null, null);
    }

    function GetCargo() {
        var method = "POST";
        var url = "Combos/GetCargo";
        var fnDoneCallback = function (data) {
            for (var i = 0; i < data.Data.length; i++) {
                $cboModalCargo.append('<option value=' + data.Data[i].Cargo_Id + '>' + data.Data[i].Descripcion + '</option>');
            }
        };
        app.CallAjax(method, url, null, fnDoneCallback, null, null, null);
    }

    function GetTipoDocumento() {
        var method = "POST";
        var url = "Combos/GetTipoDocumento";
        var fnDoneCallback = function (data) {
            for (var i = 0; i < data.Data.length; i++) {
                $cboModalTipoDoc.append('<option value=' + data.Data[i].TipoDocumento_Id + '>' + data.Data[i].Descripcion + '</option>');
            }
        };
        app.CallAjax(method, url, null, fnDoneCallback, null, null, null);
    }

    function $cboTipoBusqueda_change() {
        var codSelec = $(this).val();
        $tipoNombre.hide();
        $tipoEstado.hide();

        $txtNombre.val("");
        $cboEstado.val(0);

        if (codSelec === "1") {
            $tipoNombre.show();
        }
        else if (codSelec === "2") {
            $tipoEstado.show();
        }

    }

    function $btnBuscar_click() {
        GetTrabajador();
    }                       

    function GetSalud(salud) {
        if (salud === 1) {
            $checkboxEsSalud.prop('checked', true);
        } else if (salud === 2) {
            $checkboxEsSalud.prop('checked', true);
            $checkboxEPS.prop('checked', true);
        }
    }

    function GetSaludChecked() {
        var seguro = 1;
        if ($checkboxEPS.is(":checked")) {
            seguro = 2;
        }
        return seguro;
    }

    function GetAFP(afp) {
        if (afp === 3) {
            $rbnHabitat.prop('checked', true);
        } else if (afp === 4) {
            $rbnIntegra.prop('checked', true);
        } else if (afp === 5) {
            $rbnPrima.prop('checked', true);
        } else if (afp === 6) {
            $rbnProFuturo.prop('checked', true);
        }

    }

    function GetComisionAFP(comisionafp) {
        if (comisionafp === 1) {
            $rbnComisionFlujoAFP.prop('checked', true);
        } else if (comisionafp === 2) {
            $rbnComisionMixtaAFP.prop('checked', true);
        }
    }

    return {
        EditarTrabajador: EditarTrabajador,
        EliminarTrabajador: EliminarTrabajador
    };


})(window.jQuery, window, document);