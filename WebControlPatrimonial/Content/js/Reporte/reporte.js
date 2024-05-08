var Reporte = (function ($, win, doc) {

    var $txtFechaReporte = $('#txtFechaReporte');
    var $btnGenerarReporteTurno = $('#btnGenerarReporteTurno');

                                        
    var Message = {
        ObtenerTipoBusqueda: "Obteniendo los tipos de busqueda, Por favor espere...",
        GuardarSuccess: "Los datos se guardaron satisfactoriamente"
    };

    // Constructor
    $(Initialize);                        

    // Implementacion del constructor
    function Initialize() {          
        $txtFechaReporte.datepicker({
            endDate: "today",
            todayHighlight: true,
            format: "mm/yyyy",
            startView: "months",
            minViewMode: "months"
        });      
        $btnGenerarReporteTurno.click($btnGenerarReporteTurno_click)
    }           

    function $btnGenerarReporteTurno_click() {
        app.RedirectTo("Reporte/GenerarReporteTurno?Periodo=" + $txtFechaReporte.val());       
    }           



})(window.jQuery, window, document);