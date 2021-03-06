/* =========================================================
 * stage.js v0.5.0
 * =========================================================
 * Copyright 2012 Wpbakery
 *
 * Visual composer stage object. Helps to create and edit
 * shortcodes inside administration panel of wordpress edit
 * post page.
 * Main container and layouts used to work with.
 * ========================================================= */

!function ($) {
    // Global settings for options like ajaxurl, version and so on
    $.wpbGlobalSettings = {
        ajaxurl:window.ajaxurl,
        version:'0.1a',
        post_id:$('#post_ID').val()
    };

    // Logging to console

    $.fn.log = function (msg) {
        if (typeof(window.console) !== 'undefined' && window.console.log) window.console.log("%s: %o", msg, this);
        return this;
    };

    $.log = function (text) {
        if (typeof(window.console) !== 'undefined' && window.console.log) window.console.log(text);
    };

    $.wpbStage = function () {
        this.$view = $('#wpb_visual_composer');
        this.$postView = $('#postdivrich');
        this.accessPolicy = $('.wpb_js_composer_group_access_show_rule').val();
        this.$contentView = $('#visual_composer_content');
        this.$navigationView = $('#wpb_visual_composer-elements');
        this.$vcStatus = $('#wpb_vc_js_status');
        this.init();
    };

    $.wpbStage.prototype = {
        /** Initialization methods */
        // {{
        init:function () {
            var that = this;
            if (this.$view.is('div')) {
                $(document).ready(function () {
                    that.initSwitchButton();
                    that.initNavigation();
                    that.initContent();
                    that.initHelperText();
                    that.checkIsEmpty();
                });

                $(window).load(function () {
                    that.showOnLoad();
                });
            }
        },
        initHelperText:function () {
            var that = this;
            $('#wpb-empty-blocks .add-text-block-to-content').unbind('click.addTextBlock').bind('click.addTextBlock', function(e){
                e.preventDefault();
                var shortcode = new $.wpbShortcode('vc_column_text', '', that);
            });
            $('#wpb-empty-blocks .add-element-to-layout').unbind('click.addNewElementStage').bind('click.addNewElementStage', function(e){
                e.preventDefault();
                var modal = new $.wpbModal(that);
                modal.showList();
            });
        },
        showOnLoad:function () {
            if ((this.$vcStatus.val() == 'true' && $('#wp-content-wrap').hasClass('tmce-active')) || this.accessPolicy == 'only') {

                this.show();
            }
        },
        initSwitchButton:function () {
            var that = this;
            if (this.$switchButton !== undefined || this.accessPolicy == 'only' || this.accessPolicy == 'no') return;
            this.$switchButton = $('<a class="wpb_switch-to-composer button-primary" href="#">' + window.i18nLocale.main_button_title + '</a>').insertAfter('div#titlediv').wrap('<p class="composer-switch" />');
            this.$switchButton.unbind('click').click(function (e) {
                e.preventDefault();
                if (that.$postView.is(':visible')) {
                    that.show();
                } else {
                    that.hide();
                }
            });
        },
        initNavigation:function () {
            var that = this;
            $('#wpb-add-new-element', this.$navigationView).unbind('click').click(function () {
                var modal = new $.wpbModal(that);
                modal.showList();
            });
            $('.dropable_el', this.$navigationView).draggable({
                helper:function () {
                    return $('<div id="drag_placeholder"></div>').appendTo('body')
                },
                zIndex:99999,
                // cursorAt: { left: 10, top : 20 },
                cursor:"move",
                // appendTo: "body",
                revert:"invalid",
                start:function (event, ui) {
                    $("#drag_placeholder").addClass("column_placeholder").html(i18nLocale.drag_drop_me_in_column);
                }
            });
            this.presets = new $.wpbTemplates($('.wpb_templates_ul', this.$navigationView));
            /* Make menu elements droppable */
            try {
                $('.dropdown-toggle').dropdown();
            } catch (err) {
            }

            $(".clickable_action, .clickable_layout_action", this.$navigationView).click(function (e) {
                e.preventDefault();

                var shortCode = new $.wpbShortcode($(this).attr('data-element'), $(this).attr('data-width'), that.layout);
            });
        },
        initContent:function () {
            var that = this;
            $('.wpb_sortable', this.$contentView).each(function () {
                new $.wpbShortcode($(this), null, that);
            });
            this._initDragAndDrop();
        },
        _setSortable:function () {
            $('.wpb_sortable_container').sortable({
                forcePlaceholderSize:true,
                connectWith:".wpb_sortable_container",
                placeholder:"widgets-placeholder",
                // cursorAt: { left: 10, top : 20 },
                cursor:"move",
                items:"div.wpb_sortable", //wpb_sortablee
                distance:0.5,
                start:function () {
                    $('#visual_composer_content').addClass('sorting-started');
                },
                stop:function (event, ui) {
                    $('#visual_composer_content').removeClass('sorting-started');
                },
                update:function () {
                    $.jsComposer.save_composer_html();
                },
                over:function (event, ui) {
                    ui.placeholder.css({maxWidth:ui.placeholder.parent().width()});
                    ui.placeholder.removeClass('hidden-placeholder');
                    if (ui.item.hasClass('not-column-inherit') && ui.placeholder.parent().hasClass('not-column-inherit')) {
                        ui.placeholder.addClass('hidden-placeholder');
                    }
                },
                beforeStop:function (event, ui) {
                    if (ui.item.hasClass('not-column-inherit') && ui.placeholder.parent().hasClass('not-column-inherit')) {
                        return false;
                    }
                }
            });
        },
        _initDragAndDrop:function () {
            var that = this;
            // If element is dropped on main page.
            this.$contentView.droppable({
                greedy:true,
                accept:".dropable_el, .dropable_column",
                hoverClass:"wpb_ui-state-active",
                drop:function (event, ui) {
                    if (ui.draggable.is('#wpb-add-new-element')) {
                        var modal = new $.wpbModal(that);
                        modal.showList();
                    } else {
                        var shortCode = new $.wpbShortcode(ui.draggable.attr('data-element'), ui.draggable.attr('data-width'), that);
                    }
                }
            });
            this._setSortable();
        },
        checkIsEmpty:function () {
            if (!$('.wpb_main_sortable').hasClass('loading') && !$('.wpb_main_sortable > div').length) {
                $('.metabox-composer-content').addClass('empty-composer');
            } else {
                $('.metabox-composer-content').removeClass('empty-composer');
            }
        },
        add:function ($wpbShortcode) {
            this.append($wpbShortcode);
            // Define next step in "creation wizard". Usually inside modal window.

            if ($wpbShortcode.data('wpb_shortcode').shortcode === 'vc_column') {
                var modal = new $.wpbModal(this);
                modal.flash();
            } else {
                var modal = new $.wpbModal(this);
                modal.showSettings($wpbShortcode);
            }
        },
        append:function ($wpbShortcode, do_not_inform) {
            $wpbShortcode.appendTo(this.$contentView);
            this._initObject($wpbShortcode, do_not_inform);
        },
        insertAfter:function ($wpbShortcode, $preobject) {
            $wpbShortcode.insertAfter($preobject);
            this._initObject($wpbShortcode, true);
        },
        _initObject:function ($wpbShortcode, do_not_inform) {
            this.checkIsEmpty();
            this.$contentView.removeClass('empty_column');
            // TODO: refactor this without chasing all this elements
            this.$view.find(".wpb_vc_init_callback").each(function (index) {
                var fn = window[$(this).attr("value")];
                if (typeof fn === 'function') {
                    fn($(this).closest('.wpb_content_element').removeClass('empty_column'));
                }
            });
            if (typeof(do_not_inform) === 'undefined' || do_not_inform !== true) {
                // Animated scroll to element
                //$('body').scrollTo($wpbShortcode);

                // Show animation that will inform the user about new element on current layout and it position.
                $wpbShortcode.data('wpb_shortcode').animateAsNew();
            }

            this._setSortable();
        },
        _getContent:function () {
            var content;
            try {
                content = window.tinyMCE.get('content').save();
                if(window.tinyMCE.settings.apply_source_formatting!= undefined && window.tinyMCE.settings.apply_source_formatting === true) {
                    content = window.switchEditors._wp_Nop(content);
                }

            } catch(e) {}
            if(typeof(content)==='undefined' || content === null) {
                content = typeof(window.switchEditors)!=='undefined' ?  window.switchEditors._wp_Nop($('#content').val()) : $('#content').val();
            }
            return content;
        },
        save:function () {
            $.jsComposer.save_composer_html();
        },
        show:function () {
            this.$contentView.addClass('loading').html('<span class="loading_message_block"><img src="images/wpspin_light.gif" alt="" />' + ' ' + $('#wpb_vc_loading').val() + '</span>');
            this.checkIsEmpty();
            window.setTimeout(function(){window.switchEditors.go('content', 'tmce')}, 1500);
            this.$postView.hide();
            this.$view.show();
            var content = this._getContent();
            new $.wpbShortcode().fromEditor(content, this);
            if (this.$switchButton !== undefined) this.$switchButton.html(window.i18nLocale.main_button_title_revert);
            wpb_navOnScroll();
            this.$vcStatus.val("true");
        },
        hide:function () {
            this.$postView.show();
            this.$view.hide();
            this.$vcStatus.val("false");
            if (this.$switchButton !== undefined) this.$switchButton.html(window.i18nLocale.main_button_title);
        },
        removeAjaxLoader: function() {
            $('.loading_message_block', this.$contentView.removeClass('loading')).remove();
        }
        // }}
    };

    // Create js Composer stage

    $.wpb_stage = new $.wpbStage();

}(window.jQuery);