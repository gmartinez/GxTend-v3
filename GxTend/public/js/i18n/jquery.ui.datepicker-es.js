/* Inicialización en español para la extensión 'UI date picker' para jQuery. */
/* Traducido por Vester (xvester@gmail.com). */
jQuery(function($){
	$.datepicker.regional['es'] = {
		closeText: 'Cerrar',
		prevText: '&#x3C;Ant',
		nextText: 'Sig&#x3E;',
		currentText: 'Ahora',
		monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
		'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
		monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun',
		'Jul','Ago','Sep','Oct','Nov','Dic'],
		dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
		dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
		dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
		weekHeader: 'Sm',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: '',
		// Time specific
		timeOnlyTitle: 'Seleccione Hora',
		timeText: 'Hora',
		hourText: 'Hora',
		minuteText: 'Minuto',
		secondText: 'Segundo',
		millisecText: 'Millisegundo',
		microsecText: 'Microsegundo',
		timezoneText: 'Zona Horaria'
	};
	$.datepicker.setDefaults($.datepicker.regional['es']);
	$.timepicker.setDefaults($.datepicker.regional['es']);
});