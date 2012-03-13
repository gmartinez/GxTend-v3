<script type="text/javascript">

    $(document).ready(function(){        
        var $tabs = $("#tabber_{$grid_ctrlid}").tabs({
            add: function(event, ui) {
                // append close thingy
                $(ui.tab).parents('li:first')
                    .append('<span class="ui-tabs-close ui-icon ui-icon-close" title="Close Tab"></span>')
                    .find('span.ui-tabs-close')
                    .click(function() {
                        $tabs.tabs('remove', $('li', $tabs).index($(this).parents('li:first')[0]));
                        resizeGrid();
                    });
                // select just added tab
                $tabs.tabs('select', '#' + ui.panel.id);
            },
            load: function(event, ui) {               
                initializeButtons();
                //tooltip();
            },
            select: function(event, ui) {
                //alert(ui.index);
            },
            spinner: '<em>{$smarty.const._MSG_WAIT_SM_}&nbsp;&nbsp;&nbsp;</em>',
            cache: false,
            ajaxOptions: { 
                cache: false,
                error: function(xhr, status, index, anchor) {
                    $(anchor.hash).html("Error, could not load tab content.");
                }
            }
        });

		$("#grid_{$grid_ctrlid}").jqGrid({
            url:"{$url}",
            datatype: "json",
            mtype: "GET",
            /*caption: {$caption},*/
            colNames:[{$colnames}],
            colModel:[{$colmodel}],
            sortname: "{$sortname}",
            sortorder: "{$sortorder}",
            pager: $("#pager_{$grid_ctrlid}"),
            rowNum: {$rownum},
            rowList: [{$rowlist}],
            viewrecords: true,
			height:"auto",
			autowidth: true,
			rownumbers: false,
            hidegrid: false,
            altRows: true,
            onCellSelect: function (rowId,iCol,cellContent,e) {
                {$oncellselect}
            },
            subGrid: {$subgrid},
            subGridUrl : "{$subgridurl}",
            subGridModel : [{$subgridmodel}],
            beforeRequest: function () {
                jQuery("#grid_{$grid_ctrlid}").jqGrid("setGridParam",{ postData:{ "sfilter":$("#finput_{$grid_ctrlid}").val() } });
                jQuery("#grid_{$grid_ctrlid}").jqGrid("setGridParam",{ postData:{ "squery":$("#qinput_{$grid_ctrlid}:enabled").val() } });
            },
            gridComplete: function() {              
                resizeGrid();
                initializeButtons();
                //tooltip();
            },
			loadComplete: function(r){
                if (r.dbgnfo) {
                mDialog("text:"+r.dbgnfo, "Grid Debug Information", 480, 640);
                }
			},
            loadError: function(jqXHR) {
                handleXHRerror(jqXHR);
            }
        }).navGrid("#pager_{$grid_ctrlid}",{ edit:false,add:false,del:false,search:false });

        $("#qinput_{$grid_ctrlid}").keypress(function (e) {
          if (e.which == 13) {
            $("#grid_{$grid_ctrlid}").trigger("reloadGrid");
          }
        });

        {if $smarty.request.opt=='add'}
            $('#addrec_{$grid_ctrlid}').click();
        {/if}

        {if $smarty.request.opt=='edit'}
            grid_edittab();
        {/if}
        
        if ({$reload}) {
            setInterval('$("#grid_{$grid_ctrlid}").trigger("reloadGrid");', {$reload});
        }

        $(window).resize(resizeGrid);

    });

    /*
    * One click filter & serarch submit...
    */
    function setFilter(gid) {

        var fltstr = "";

        $("#"+gid+" .filter").each(function(index) {
            if ($(this).val()!="%") {
            fltstr = fltstr + $(this).val();
            }
        });

        if (fltstr) {
            $("#finput_"+gid).attr("value", fltstr);
            $("#tabber_"+gid+" #ficonOff_"+gid).hide();
            $("#tabber_"+gid+" #ficonOn_"+gid).show();
        } else {
            $("#finput_"+gid).attr("value", "");
            $("#tabber_"+gid+" #ficonOff_"+gid).show();
            $("#tabber_"+gid+" #ficonOn_"+gid).hide();
        }
        
        $("#grid_"+gid).trigger("reloadGrid");

    }

    /*
    * Function to bind on window.resize...
    */
    function resizeGrid() {
           if (grid = $('.ui-jqgrid-btable:visible')) {
            grid.each(function(index) {
                gridId = $(this).attr('id');
                gridParentWidth = $('#gbox_' + gridId).parent().width();
                $('#' + gridId).setGridWidth(gridParentWidth);
                //alert(gridParentWidth);
            });
        }
    }

    /*
    * Request debugging information...
    */
    function dbugGrid(gid) {

        jQuery("#grid_"+gid).jqGrid("setGridParam",{ postData:{ "getdbgnfo":1 } });        
        $("#grid_"+gid).trigger("reloadGrid");
        jQuery("#grid_"+gid).jqGrid("setGridParam",{ postData:{ "getdbgnfo":0 } });        

    }

    /*
    * Edit on start...
    */
    {if $smarty.request.opt=='edit'}
    function grid_edittab() {
        /* Assign values to construct the parms needed for the getJsAddTab */
        {assign var=tbl value=$smarty.request.tbl}
        {assign var=frm value=$smarty.request.frm}
        {assign var=field_id value=$smarty.request.field_id}
        {assign var=field_val value=$smarty.request.field_val}
        {assign var=title_tab value=$smarty.request.title_tab}
        {assign var=parms value=['tbl'=>$tbl,'frm'=>$frm,'pkey'=>[$field_id=>$field_val]]}
        {$InProve_Smarty->getJsAddTab($grid_ctrlid, $parms, $title_tab)}
    }
    {/if}

</script>