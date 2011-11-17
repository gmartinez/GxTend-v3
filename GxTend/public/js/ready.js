/**
 * @author gmartinez@accendo-it.com
 * @copyright Accendo-IT
 */

var __LAYER_ROLE__ = "Server";
var _MSG_WAIT_SM_ = "<img style=\"vertical-align:middle; padding:5px;\" src=\"../img/loading_16-"+__LAYER_ROLE__+".gif\"> Just a moment...";

/**
 * Inject url response into application action div...
 */
function loadappdiv(url, data, div, evalA) {

    if (!div) { div = "#east_panel"; }
    $(div).html(_MSG_WAIT_SM_);

    if (url.length > 250) {
        $(div).html(url);
    } else if (url.substring(0,5)=="text:") {
        $(div).html(url.substring(5));
    } else {
        $(div).load(url, data, function (response, status, xhr) {
            if (status == "error") {
                handleXHRerror(xhr);
            } else {
                initializeButtons();
                if (evalA) {
                    eval(evalA);
                }
            }
        });
    }

}

/**
 * Open generic dialog box...
 */
function mDialog(url, title, height, width, position, print, download) {

    // Pre-populate div of content with loading indicator...
    $("#GenericDialog").html(_MSG_WAIT_SM_);

    // Create and open dialog...
    $("#GenericDialog").dialog("option", "title", title);
    $("#GenericDialog").dialog("option", "height", (height) ? height : 'auto');
    $("#GenericDialog").dialog("option", "width", (width) ? width : 450);
    $('#GenericDialog').dialog('option', 'show', 'blind');
    $("#GenericDialog").dialog("option", "position", (position) ? position : 'center');
    $("#GenericDialog").dialog('option', 'buttons', {});
    $("#GenericDialog").dialog("open");
    
    // Load content...
    if (url.substring(0,5)=="http:") {
        $("#GenericDialog").html('<iframe src ="'+url+'" width="99%" height="99%" frameborder="0"><p>Your browser does not support iframes.</p></iframe>');        
    } else if (url.substring(0,5)=="text:") {
        $("#GenericDialog").html(url.substring(5));
    } else {
        $("#GenericDialog").load(url,
                                null,
                                function(response, status, xhr) {
                                    if (status=="error") {
                                        $("#GenericDialog").html("The submitted request did not return the expected result.<p class='red'>Error " + xhr.status + " " + xhr.statusText + "</p>")
                                    } else {
                                        initializeButtons();
                                    }
                                }
        );
    }

    if (print) {
        $("#GenericDialog").dialog('option', 'buttons', { "Print": function() { $('div#header-print, div#GenericDialog, div#footer-print').jqprint(); } } );
    }
    if (download) {
        $("#GenericDialog").dialog('option', 'buttons', { "Download": function() { var image = $('#download-file').attr('source'); window.open('/Http/getfile?filename=' + image, '_blank'); return true; } } );
    }
}

/**
 * Inject url response into application log div...
 */
function showlogmsg() {

    var timeOut = 10000;

    $.getJSON(
        "Ajax/getmsg",
        null,
        function (data, textStatus) {
            if (textStatus=="success") {
                notify("Notification <span style='float:right;'>"+data.time+"</span>",data.msg,data.type,timeOut);
            } else {
                alert("Error retrieving user message.");
            }
        }
    );

}

/**
 * Push notify dialog to screen...
 */
function notify(title,msg,type,delay) {

    $.pnotify({
        pnotify_title: title,
        pnotify_text: "<span style='font-size:0.9em;'>"+msg+"</span>",
        pnotify_type: type,
        pnotify_error_icon: 'ui-icon ui-icon-alert',
        pnotify_warn_icon: 'ui-icon ui-icon-notice',
        pnotify_info_icon: 'ui-icon ui-icon-info',
        pnotify_closer: true,
        pnotify_delay : delay,
        pnotify_history: false
    });

}

/**
 * Initialize ckeditor...
 */
function initRichTextEditor(instName,tbarName) {

    if (CKEDITOR.instances[instName]) {
        delete CKEDITOR.instances[instName];
    }

    $("#"+instName).ckeditor(function() {}, { toolbar : tbarName });

}

/**
 * Reset ckeditor...
 */
function rsetRichTextEditor(instName,tbarName) {

    var editor = $("#"+instName).ckeditorGet();
    if (editor.checkDirty()) {
        var currData = $("#"+instName).val();
    }

    editor.destroy();
    $("#"+instName).ckeditor(function() {}, { toolbar : tbarName });

    if (currData) {
        $("#"+instName).val(currData);
    }
}

/**
 * Add tab into grid tabber control...
 */
function grid_addtab(gid, url, label) {

    if (gid && url && label) {
        url = url + "&grid_ctrlid=" + gid;
        var urlhash = hex_sha1(url);
        var i = urltabpos(gid, urlhash);
        if (i >= 0) {
            $("#tabber_"+gid).tabs("select", i+1);
        } else {
            label = "<span class='opentab' urlhash='"+urlhash+"'>"+label+"</span>&nbsp;&nbsp;";
            $("#tabber_"+gid).tabs("add", url, label);
        }
    } else if (!gid) {
        alert("Error adding tab, no valid target received.");
    } else if (!url) {
        alert("Error adding tab, no valid url received.");
    } else if (!label) {
        alert("Error adding tab, no valid label received.");
    }

}

/**
 * Get tab position within grid tabber control...
 */
function urltabpos(gid, urlhash) {

    var pos;

    if (urlhash) {
        jQuery.each($(".opentab"), function(i, val) {
            var str = $(this).attr("urlhash");
            var iof = str.indexOf(urlhash);
            if (iof>=0) {
               pos = i;
            }
        });
    } else {
        var $tabs = $('#tabber_'+gid).tabs();
        pos = $tabs.tabs('option', 'selected') - 1;

    }

return pos;
}

/**
 * Remove tab from grid tabber control...
 */
function grid_remtab(gid, urlhash) {

    var i = urltabpos(gid, urlhash);
    if (i >= 0) {
        $("#tabber_"+gid).tabs("remove", i+1);
    }

    $("#grid_"+gid).trigger("reloadGrid");

}

/**
 * Add tab into grid tabber control...
 */
function grid_updtab(urlhash, newurl) {

    var i = urltabpos(urlhash);

    if (newurl) {
        $("#grid_tabber").tabs("url", i+1, newurl);
        $("#grid_tabber").tabs("load", i+1);
    } else {
        alert("Error updating tab, no valid URL received.");
    }

}

/**
 * Set submit button status accorting to checkbox list...
 */
function setsubmitsts(boxes, button) {

    if ($(boxes+":checked").size() > 0) {
        $(button).each(function (index,Element) {
            if ($(this).is("button")) {
            $(button).button( "option", "disabled", false );
            }
            $(button).removeAttr("disabled");
        });
    } else {
        $(button).each(function (index,Element) {
            if ($(this).is("button")) {
            $(button).button( "option", "disabled", true );
            }
            $(button).attr("disabled", "disabled");
        });
    }

}

/**
 * Set check checkbox list according to each checkbox current status...
 */
function setcheck(boxes) {

    $(boxes).each(function (i) {
        if ($(this).is(":visible")) {
            this.checked = !(this.checked);
        } else {
            this.checked = false;
        }
    });

}

/**
 * Check string lenght...
 */
function checkLength(o,n,min,max) {

    if ( o.val().length > max || o.val().length < min ) {
        o.addClass('ui-state-error');
        $("#validateTips").html("Length of <span class='blue'>" + n + "</span> must be between "+min+" and "+max+".").effect("highlight",{},2000);
        return false;
    } else {
        return true;
    }

}

/**
 * Check regular expresion matching...
 */
function checkRegexp(o,regexp,errmsg) {

    if ( !( regexp.test( o.val() ) ) ) {
        o.addClass('ui-state-error');
        $("#validateTips").html(errmsg).effect("highlight",{},2000);
        return false;
    } else {
        return true;
    }

}

/**
 * Check is objects values are the same...
 */
function checkSame(o,po,errmsg) {

    if (o.val() != po.val()) {
        o.addClass('ui-state-error');
        $("#validateTips").html(errmsg).effect("highlight",{},2000);
        return false;
    } else {
        return true;
    }

}

/**
 * Check is objects values are the same...
 */
function randomText(length) {
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    text = "";
    for(x=0;x<length;x++) {
        i = Math.floor(Math.random() * 62);
        text += chars.charAt(i);
    }
    return text;
}


/**
 * Check is objects values are the same...
 */
function bytes2str(bytes) {

    if (bytes >= 0 && bytes < 1024) {
        $str = bytes + " bytes";
    } else if (bytes >= 1024 && bytes < 1048576) {
        $str = Math.round(bytes/1024*10)/10 + " Kb";
    } else if (bytes >= 1048576 && bytes < 1073741824) {
        $str = Math.round(bytes/1048576*10)/10 + " Mb";
    } else if (bytes >= 1073741824) {
        $str = Math.round(bytes/1073741824*10)/10 + " Gb";
    }
    return $str;
}

/**
 * Initialize Buttons
 */

function initializeButtons() {  

    $(".button-noicon").button();

    $(".button-circle").button({
        icons: {
            primary: 'ui-icon-circle-arrow-e'
        }
    });

    $(".button-history").button({
        icons: {
            primary: 'ui-icon-script'
        }
    });

    $(".button-search").button({
        icons: {
            primary: 'ui-icon-search'
        }
    });
    
    $(".button-closethick").button({
        icons: {
            primary: 'ui-icon-closethick'
        }
    });

    $(".button-add").button({
        icons: {
            primary: 'ui-icon-circle-plus'
        }
    });

    $(".button-insert").button({
        icons: {
            primary: 'ui-icon-plusthick'
        }
    });

    $(".button-update").button({
        icons: {
            primary: 'ui-icon-circle-check'
        }
    });

    $(".button-edit").button({
        icons: {
            primary: 'ui-icon-pencil'
        }
    });
   
    $(".button-delete").button({
        icons: {
            primary: 'ui-icon-trash'
        }
    });

    $(".button-recover").button({
        icons: {
            primary: 'ui-icon-arrowreturnthick-1-w'
        }
    });

    $(".button-deactivate").button({
        icons: {
            primary: 'ui-icon-arrowreturnthick-1-w'
        }
    });
    
    $(".button-activate").button({
        icons: {
            primary: 'ui-icon-arrowreturnthick-1-e'
        }
    });

    $(".button-pwd").button({
        icons: {
            primary: 'ui-icon-key'
        }
    });

    $(".button-view").button({
        icons: {
            primary: 'ui-icon-newwin'
        }
    });

    $(".button-user").button({
        icons: {
            primary: 'ui-icon-person'
        }
    });

    $(".button-print").button({
        icons: {
            primary: 'ui-icon-print'
        }
    });

    $(".button-rss").button({
        icons: {
            primary: 'ui-icon-signal-diag'
        }
    });

    $(".button-integrate").button({
        icons: {
            primary: 'ui-icon-arrow-4-diag'
        }
    });

    $(".button-zoomin").button({
        icons: {
            primary: 'ui-icon-zoomin'
        }
    });

    $(".button-alert").button({
        icons: {
            primary: 'ui-icon-alert'
        }
    });

}


/**
 * Common handling of jqXHR error situations...
 */
function handleXHRerror(xhr) {
    
    var amsg = "The submitted request did not return the expected result";
    if (xhr.responseText) {
        amsg = amsg + "\r\n\r\n" + xhr.responseText;
    } else if (!xhr.responseText && xhr.statusText) {
        amsg = amsg + "\r\n\r\n" + xhr.status + " " + xhr.statusText;
    }
    alert(amsg);

    $.unblockUI();

}