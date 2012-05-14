$(function() {
    
    $('#slides').cycle({
        timeout: 5000,
        speed: 600,
        fx:     'scrollHorz',
        pager:  '#slide-pager',
        pagerAnchorBuilder: cycle_paginate
    });
        
    $("#nav li").has("div").hover(
        function(){
            $(this).addClass("active");
            $(this).find("> div").slideDown();
        },
        function(){
            $("#nav li").removeClass("active");
            $("#nav li > div").hide();
        }
    );
    
    $("input, select, textarea").bind({
		  focus: function() {
			$(this).closest(".row").find("label").addClass("active");
		  },
		  blur: function() {
			$(this).closest(".row").find("label").removeClass("active");
		  }
	});
    
    registerForm();
    verifyForm();
    
});

function cycle_paginate(ind, el) {
    return '<a href="#slide-'+ind+'"><span>'+ind+'</span></a>';
}


function registerForm(){
    $("#register form").ajaxForm({
		dataType: 'json',
        async: true,
		beforeSubmit: function() {
            $('#register .toValidate').validate({
               ignore: ":hidden"
            });
            if ( $('#register .toValidate').valid() ) {
                 $("#register button").prop("disabled", true).addClass("ui-state-disabled");
                return true;
            }
            return false;
		},
		success: function (r) {
            if (r.sts) {
                $("#register").html(r.msg);
            } else {
                notify("Notification",r.msg,(r.sts ? "info":"error"),2500);
                $("#register button").prop("disabled", false).removeClass("ui-state-disabled");
            }
		},
		error: function (jqXHR) {
            handleXHRerror(jqXHR);
		}
	});
}

function verifyForm() {
    $("#verify form").ajaxForm({
		dataType: 'json',
        async: true,
		beforeSubmit: function() {
            $('#verify .toValidate').validate({
               ignore: ":hidden"
            });
            if ( $('#verify .toValidate').valid() ) {
                 $("#verify button").prop("disabled", true).addClass("ui-state-disabled");
                return true;
            }
            return false;
		},
		success: function (r) {
            if (r.sts) {
                $("#verify").html(r.msg);
            } else {
                notify("Notification",r.msg,(r.sts ? "info":"error"),2500);
                $("#verify button").prop("disabled", false).removeClass("ui-state-disabled");
            }
		},
		error: function (jqXHR) {
            handleXHRerror(jqXHR);
		}
	});
}