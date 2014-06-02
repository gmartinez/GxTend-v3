<script type="text/javascript">
$(document).ready(function(){

	$("#form_{$form_ctrlid}").ajaxForm({
		dataType: 'json',
        async: true,
		beforeSubmit: function() {
            $('.toValidate').validate({
               ignore: ":hidden"
            });
            if ( $('.toValidate').valid() ) {
                 $("#form_{$form_ctrlid} button").prop("disabled", true).addClass("ui-state-disabled");
                return true;
            }
            return false;
		},
		success: function (r) {
            notify("Notification",r.msg,(r.sts ? "info":"error"),2500);
            if (r.sts) {
                $("#form_{$form_ctrlid} .button-closethick").click();
            } else {
                $("#form_{$form_ctrlid} button").prop("disabled", false).removeClass("ui-state-disabled");
            }

            if (r.reloadTab) {
                var $tabs = $(".ui-tabs").tabs();
                var selected = $tabs.tabs('option', 'selected');
                $tabs.tabs('select', selected - 1);
                $tabs.tabs('select', selected);
            }
		},
		error: function (jqXHR) {
            handleXHRerror(jqXHR);
		}
	});

    $("#form_{$form_ctrlid} :input:visible:first").focus();

});
</script>