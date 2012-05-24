$(function() {
    
    $.blockUI.defaults.fadeIn = 500; 
    
    $.blockUI.defaults.css = { 
            padding:        '15px', 
            margin:         0, 
            width:          '30%', 
            top:            '40%', 
            left:           '45%', 
            textAlign:      'left', 
            color:          '#333', 
            border:         'none', 
            backgroundColor:'none', 
            cursor:         'wait',
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: 1,
            fontSize: '18px'
    }
    
     $.blockUI.defaults.overlayCSS =  { 
        backgroundColor: '#fff', 
        opacity:         0.75 
    }
    
    $("#logout").click(function(){
        $.blockUI({ message: '<span class="msg_wait"> Just a moment...</span>' });
        $.post("/index/gologout", function(){
            location.href="/Wsite";
        });
    });
    
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
    
    $("li.nav-profile a").click(function(){
       $("#master-header").remove();
       loadappdiv('/My-Profile/',null,'#content .inner'); 
    });
    
    $("li.nav-license a").click(function(){
       $("#master-header").remove();
       loadappdiv('/License/lstallreqs',null,'#content .inner');
    });
    
    $("a.changelog").click(function(){
       $("#master-header").remove();
       loadappdiv('/Changelog/',null,'#content .inner');
    });
    
    $("a.documentation").click(function(){
       $("#master-header").remove();
       loadappdiv('/Changelog/',null,'#content .inner');
    });
    
    $("li.nav-license a").click(function(){
       $("#master-header").remove();
       loadappdiv('/License/lstallreqs',null,'#content .inner');
    });
    
    $().UItoTop({ easingType: 'easeOutQuart' });
    
    smoothScroll();

});

function cycle_paginate(ind, el) {
    return '<a href="#slide-'+ind+'"><span>'+ind+'</span></a>';
}

function smoothScroll() {

	$("a[href*=#]").click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
		
			var $target = $(this.hash);
			$target = $target.length && $target || $("[name=' + this.hash.1) +']");
		
			if ($target.length) {
				var targetOffset = $target.offset().top;
				$("html,body").animate({scrollTop: targetOffset}, {duration:1600,easing:"easeOutQuart"});
			return false;
			}
		
		}
		
	});
}