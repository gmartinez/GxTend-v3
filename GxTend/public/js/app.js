/**
 * @author gonzalo@in-prove.com
 * @copyright InProve
 */

var labels = [];
var _CURRENT_LNG_ = $.cookie("language") ? $.cookie("language") : "es";

if (_CURRENT_LNG_ == "es") {
    labels["_SEARCH_"] = "Buscar";
    labels["_MSG_WAIT_SM_"] = "<span class='msg_wait small'> Un momento...</span>";
    labels["_IFRAMES_NOT_SUPPORTED_"] = "Your browser does not support iframes.";
    labels["_ERROR_"] = "Error";
    labels["_SUBMIT_ERROR_"] = "La solicitud enviada no devolvio el resultado esperado";
    labels["_USER_NOTIFICATION_"] = "Notificación al Usuario";
    labels["_ERROR_RETRIEVING_MSG_"] = "Error obteniendo mensaje de usuario.";
    labels["_ERROR_ADDING_TAB_TARGET_"] = "Error agregando tab, objetivo invalido.";
    labels["_ERROR_ADDING_TAB_URL_"] = "Error agregando tab, url invalida.";
    labels["_ERROR_ADDING_TAB_LABEL_"] = "Error agregando tab, etiqueta invalida.";
    labels["_ERROR_UPDATING_TAB_INVALID_URL_"] = "Error actualizando tab, URL invalida.";
	labels["_LENGTH_OF_"] = "El largo de";
    labels["_MUST_BE_"] = "debe estar entre";
    labels["_CLOSE_"] = "Cerrar";
} else if (_CURRENT_LNG_ == "pt-br") {
    labels["_SEARCH_"] = "Pesquisar";
    labels["_MSG_WAIT_SM_"] = "<span class='msg_wait small'> Só um momento...</span>";
    labels["_IFRAMES_NOT_SUPPORTED_"] = "Your browser does not support iframes.";
    labels["_ERROR_"] = "Erro";
    labels["_SUBMIT_ERROR_"] = "O pedido apresentado não retornou o resultado esperado";
    labels["_USER_NOTIFICATION_"] = "Notificação ao Usuário";
    labels["_ERROR_RETRIEVING_MSG_"] = "Erro ao recuperar mensagem de usuário.";
    labels["_ERROR_ADDING_TAB_TARGET_"] = "Erro ao adicionar tab, alvo inválido.";
    labels["_ERROR_ADDING_TAB_URL_"] = "Erro ao adicionar tab, URL inválido.";
    labels["_ERROR_ADDING_TAB_LABEL_"] = "Erro ao adicionar tab, rótulo inválido.";
    labels["_ERROR_UPDATING_TAB_INVALID_URL_"] = "Erro ao atualizar guia, URL inválido.";
	labels["_LENGTH_OF_"] = "O comprimento do";
    labels["_MUST_BE_"] = "deve estar entre";
    labels["_CLOSE_"] = "Fechar";
} else {
    labels["_SEARCH_"] = "Search";
    labels["_MSG_WAIT_SM_"] = "<span class='msg_wait small'> Just a moment...</span>";
    labels["_IFRAMES_NOT_SUPPORTED_"] = "Your browser does not support iframes.";
    labels["_ERROR_"] = "Error";
    labels["_SUBMIT_ERROR_"] = "The submitted request did not return the expected result";
    labels["_USER_NOTIFICATION_"] = "User Notification";
    labels["_ERROR_RETRIEVING_MSG_"] = "Error retrieving user message.";
    labels["_ERROR_ADDING_TAB_TARGET_"] = "Error adding tab, no valid target received.";
    labels["_ERROR_ADDING_TAB_URL_"] = "Error adding tab, no valid url received.";
    labels["_ERROR_ADDING_TAB_LABEL_"] = "Error adding tab, no valid label received.";
    labels["_ERROR_UPDATING_TAB_INVALID_URL_"] = "Error updating tab, invalid URL.";
	labels["_LENGTH_OF_"] = "Length of";
    labels["_MUST_BE_"] = "must be between";
    labels["_CLOSE_"] = "Close";
}

/**
 * Inject url response into application action div...
 */
function loadappdiv(url, data, div, evalA) {

    if (!div) {div = "#east_panel";}
    $(div).html(labels["_MSG_WAIT_SM_"]);

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
function mDialog(url, title, height, width, position, onload, onclose, dialdiv) {

    if (typeof(dialdiv)=="undefined") {
        dialdiv = "#GenericDialog";
    }

    // Create and open dialog...
    $(dialdiv).dialog({
                                bgiframe: true,
                                autoOpen: false,
                                modal: true,
                                title: title,
                                height: (height ? height : 'auto'),
                                width: (width ? width : 480),
                                show: 'blind',
                                position: (position ? position : 'center'),
                                buttons: {}
                                });
    if (onclose) {
        $(dialdiv).bind( "dialogclose", function(event, ui) {
            onclose();
        });
    }
    $(dialdiv).html(labels["_MSG_WAIT_SM_"]).dialog("open");
    
    
    // Load content...
    if (url.substring(0,5)=="http:") {
        $(dialdiv).html('<iframe src ="'+url+'" width="99%" height="99%" frameborder="0"><p>'+labels["_IFRAMES_NOT_SUPPORTED_"]+'</p></iframe>');
    } else if (url.substring(0,5)=="text:") {
        $(dialdiv).html(url.substring(5));
    } else if (url.substring(0,1)=="#") {
        $(dialdiv).html($(url).html());
    } else {
        $(dialdiv).load(url,
                                null,
                                function(response, status, xhr) {
                                    if (status=="error") {
                                        $(dialdiv).html(labelS["_SUBMIT_ERROR_"]+".<p class='red'>" + labels["_ERROR_"] + " " + xhr.status + " " + xhr.statusText + "</p>")
                                    } else {
                                        initializeButtons();
                                        if (onload) onload();
                                    }
                                }
        );
    }

}

/**
 * Inject url response into application log div...
 */
function showlogmsg() {

    var timeOut = 10000;

    $.getJSON(
        "/Ajax/getmsg",
        null,
        function (data, textStatus) {
            if (textStatus=="success") {
                notify(labels["_USER_NOTIFICATION_"], data.msg, data.type, timeOut);
            } else {
                alert(labels["_ERROR_RETRIEVING_MSG_"]);
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
function initRichTextEditor(instName,customConfig) {

    if (CKEDITOR.instances[instName]) {
        delete CKEDITOR.instances[instName];
    }
    $("#"+instName).ckeditor(function() {}, {customConfig:customConfig, language:_CURRENT_LNG_});

}

/**
 * Reset ckeditor...
 */
function rsetRichTextEditor(instName,customConfig) {

    var editor = $("#"+instName).ckeditorGet();
    if (editor.checkDirty()) {
        var currData = $("#"+instName).val();
    }

    editor.destroy();
    $("#"+instName).ckeditor(function() {}, {customConfig:customConfig, language:_CURRENT_LNG_});

    if (currData) {
        $("#"+instName).val(currData);
    }
}

/**
 * Get tab position within grid tabber control...
 */
function urltabpos(gid, urlhash) {

    var pos;
    if (urlhash) {
        jQuery.each($('#tabber_'+gid+' li'), function(i, val) {
            var str = $(this).data("urlhash");
			if (str) {
				var iof = str.indexOf(urlhash);
				if (iof>=0) { pos = i; }
			}
        });
    } else {
        pos = $('#tabber_'+gid).tabs('option', 'active') - 1;
    }

return pos;
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
			$("#tabber_"+gid).tabs("option", "active", i);
        } else {
			$("#tabber_"+gid+" > ul").append("<li data-urlhash='"+urlhash+"'><a href='"+url+"'>"+label+"</a></li>");
			$("#tabber_"+gid).append("<div data-urlhash='"+urlhash+"'></div>").tabs("refresh").tabs("option", "active", -1);
        }
    } else if (!gid) {
        alert(labels["_ERROR_ADDING_TAB_TARGET_"]);
    } else if (!url) {
        alert(labels["_ERROR_ADDING_TAB_URL_"]);
    } else if (!label) {
        alert(labels["_ERROR_ADDING_TAB_LABEL_"]);
    }

}

/**
 * Remove tab from grid tabber control...
 */
function grid_remtab(gid, urlhash) {

	if (!urlhash) {
	urlhash = $("#tabber_"+gid+" li[tabindex=0]").data("urlhash");
	}
	$("#tabber_"+gid+" li[data-urlhash="+urlhash+"]").remove();
	$("#tabber_"+gid+" div[data-urlhash="+urlhash+"]").remove();
	$("#tabber_"+gid).tabs("refresh");
	
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
        alert(labels["_ERROR_UPDATING_TAB_INVALID_URL_"]);
    }

}

/**
 * Set submit button status accorting to checkbox list...
 */
function setsubmitsts(boxes, buttons) {

    if ($(boxes+":checked").size() > 0) {
        $(buttons).each(function (index,Element) {
            $(Element).prop("disabled", false).removeClass("ui-state-disabled");
        });
    } else {
        $(buttons).each(function (index,Element) {
            $(Element).prop("disabled", true).addClass("ui-state-disabled");
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
        $("#validateTips").html(labels["_LENGTH_OF_"]+" <span class='blue'>" + n + "</span> "+labels["_MUST_BE_"]+" "+min+" & "+max+".").effect("highlight",{},2000);
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

    $(".button-gear").button({
        icons: {
            primary: 'ui-icon-gear'
        }
    });

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

    $(".button-tag").button({
        icons: {
            primary: 'ui-icon-tag'
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

    $(".button-next").button({
        icons: {
            primary: 'ui-icon-circle-arrow-e'
        }
    });

    $(".button-prev").button({
        icons: {
            primary: 'ui-icon-circle-arrow-w'
        }
    });

    $(".button-attch").button({
        icons: {
            primary: 'ui-icon-circle-arrow-n'
        }
    });

}

/**
 * Common handling of jqXHR error situations...
 */
function handleXHRerror(xhr) {
    
    var amsg = labels["_SUBMIT_ERROR_"];
    if (xhr.responseText) {
        amsg = amsg + "\r\n\r\n" + xhr.responseText;
    } else if (!xhr.responseText && xhr.statusText) {
        amsg = amsg + "\r\n\r\n" + xhr.status + " " + xhr.statusText;
    }
    alert(amsg.replace(/<br \/>/gm,""));

    $.unblockUI();

}

/**
 * Switch language...
 */
function setLang(lng) {

    $.cookie("language", lng, {expires: 180, path: '/'});
    
    window.location.reload();
    
}


/**
 * Maintain language...
 */
function edtLang(o) {

    mDialog("/Translation/edtlbl?oid="+o.id+"&entry="+$("#"+o.id).attr("entry"), "...", 480, 640);

}