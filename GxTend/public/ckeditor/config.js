/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.editorConfig = function( config )
{
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	// config.skin = 'office2003';

    //config.contentsCss = '../css/gxtend.css';
    
    // Defines a personalized FULL toolbar...
    CKEDITOR.config.toolbar_MyFullOptions =
    [
        ['Source','ShowBlocks','Maximize','-','Templates','-','Preview','Print'],
        ['Cut','Copy','Paste','-','SpellChecker','Find','Replace'],
        '/',
        ['Outdent','Indent','Blockquote','-','NumberedList','BulletedList'],
        ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
        ['Image','Table','HorizontalRule','Smiley','SpecialChar','PageBreak'],
        ['Bold','Italic','Underline','Strike','Subscript','Superscript'],
        '/',
        ['Styles','Format','Font','FontSize'],
        ['TextColor','BGColor'],
        ['Link','Unlink','Anchor']
    ];
    // Defines a personalized BASIC toolbar...
    CKEDITOR.config.toolbar_MyBasicOptions =
    [
        ['Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink']
    ];
    // Load toolbar_Name where Name = MyOptions....
    //CKEDITOR.config.toolbar = 'MyBasicOptions';
    // Set the expansion status of the toolbar on startup...
    CKEDITOR.config.toolbarStartupExpanded = true;


};
