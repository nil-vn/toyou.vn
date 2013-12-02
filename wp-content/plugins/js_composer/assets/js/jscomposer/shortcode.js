/* =========================================================
 * shortcode.js v0.5.0
 * =========================================================
 * Copyright 2012 Wpbakery
 *
 * Visual composer shortcode object.
 * ========================================================= */

!function ($) {

    $.wpbShortcode = function (shortcode, width, container) {
        if (typeof(shortcode) === 'object') {
            this.$element = shortcode;
            this.shortcode = shortcode.find('.wpb_vc_sc_base').val();
            this.$elementControls = shortcode.children('.controls');
            this.container = typeof(container) === 'undefined' ? new $.wpbStage() : container;
            this.width = width;
            this.has_settings = this.$element.find('.wpb_vc_param_value').length > 0;
            this.init();
        } else if (shortcode !== undefined) {
            var container = typeof(container) === 'undefined' ? new $.wpbStage() : container; // here comes layout or main stage
            this.getFromServer(shortcode, width, container);
        }
    };

    $.wpbShortcode.prototype = {
        fromEditor:function (shortcodes, container) {
            var that = this;
            $.ajax({
                type:'POST',
                url:$.wpbGlobalSettings.ajaxurl,
                data:{
                    action:'wpb_shortcodes_to_visualComposer',
                    content:shortcodes
                },
                dataType:'html',
                context:container
            }).done(function (response) {
                    var container = this;
                    $.each(that._create(response, this), function () {
                        container.append(this.$element, true);
                    });
                    container.removeAjaxLoader();
                    container.checkIsEmpty();
                    $.jsComposer.addLastClass(container.$contentView);
                });
        },
        init:function () {
            this.$element.data('wpb_shortcode', this);
            this.$element.extend(this);
            this.initControls();
            if (this.shortcode == 'vc_column') {
                this.initColumn();
            } else {
               this.initContent();
            }

        },
        initContent:function () {
            $('.wpb_element_wrapper > .toggle_title', this.$element).unbind('click').click(function (e) {
                if ($(this).hasClass('toggle_title_active')) {
                    $(this).removeClass('toggle_title_active').next().hide();
                } else {
                    $(this).addClass('toggle_title_active').next().show();
                }
            });
        },
        initColumn:function () {
            this.column = new $.wpbLayout(this.$element.find('.wpb_column_container'));
        },
        initControls:function () {
            var that = this;
            $(".column_delete", this.$elementControls).unbind('click').click(function (e) {
                e.preventDefault();
                var answer = confirm(i18nLocale.press_ok_to_delete_section);
                if (answer) {
                    $parent = $(this).closest(".wpb_sortable");
                    $(this).closest(".wpb_sortable").remove();
                    $parent.addClass('empty_column');
                    $.wpb_stage.checkIsEmpty();
                    $.jsComposer.save_composer_html();
                }
            });
            $(".column_clone", this.$elementControls).unbind('click').click(function (e) {
                e.preventDefault();
                that.cloneShortCode();
                $.jsComposer.save_composer_html();
            });

            $(".column_popup", this.$elementControls).unbind('click').click(function (e) {
                e.preventDefault();
                var answer = confirm(i18nLocale.press_ok_to_pop_section);
                if (answer) {
                    $(this).closest(".wpb_sortable").appendTo('.wpb_main_sortable');//insertBefore('.wpb_main_sortable div.wpb_clear:last');
                    // initDroppable(); old staff
                    $.jsComposer.save_composer_html();
                }
            });

            $(".column_edit", this.$elementControls).unbind('click').click(function (e) {
                e.preventDefault();
                var modal = new $.wpbModal($.wpbStage);
                modal.showSettings(that.$element);
            });

            $('.wpb_element_wrapper > .column_edit_trigger', this.$element).unbind('click').click(function (e) {
                e.preventDefault();
                var modal = new $.wpbModal($.wpbStage);
                modal.showSettings(that.$element);
            });

            $(".column_add", this.$elementControls).unbind('click').click(function (e) {
                e.preventDefault();
                if (typeof that.column !== 'undefined' && that.column !== null) {
                    var modal = new $.wpbModal(that.column);
                    modal.showList();
                }
            });

            $(".column_increase", this.$elementControls).unbind('click').click(function (e) {
                e.preventDefault();
                var column = $(this).closest(".wpb_sortable"),
                    sizes = getColumnSize(column);
                if (sizes[1]) {
                    column.removeClass(sizes[0]).addClass(sizes[1]);
                    /* get updated column size */
                    sizes = getColumnSize(column);
                    $(column).find(".column_size:first").html(sizes[3]);
                    $.jsComposer.save_composer_html();
                }
            });

            $(".column_decrease", this.$elementControls).unbind('click').click(function (e) {
                e.preventDefault();
                var column = $(this).closest(".wpb_sortable"),
                    sizes = getColumnSize(column);
                if (sizes[2]) {
                    column.removeClass(sizes[0]).addClass(sizes[2]);
                    /* get updated column size */
                    sizes = getColumnSize(column);
                    $(column).find(".column_size:first").html(sizes[3]);
                    $.jsComposer.save_composer_html();
                }
            });
        },
        _create:function (html, container) {
            var $html = $(html),
                list = [];
            $html.each(function () {
                if ($(this).is('div')) {
                    var width = '';
                    list.push(new $.wpbShortcode($(this), width, container));
                }
            });
            return list;
        },
        getFromServer:function (shortcode, width, container) {
            var that = this;
            $.ajax({
                type:'POST',
                url:$.wpbGlobalSettings.ajaxurl,
                data:{
                    action:'wpb_get_element_backend_html',
                    data_element:shortcode,
                    data_width:width
                },
                dataType:'html',
                context:container
            }).done(function (response) {
                    var container = this;
                    $.each(that._create(response, this), function () {
                        if(this.has_settings) {
                            container.add(this.$element);
                        } else {
                            container.append(this.$element);
                            new $.wpbModal().close(true);
                        }
                    });
                    container.save();
                });
        },
        animateAsNew:function () {
            var $element = this.$element;
            $element.addClass('fadeIn colorFlash animated');
            window.setTimeout(function () {
                $element.removeClass('fadeIn colorFlash animated');
            }, 2000);
        },
        cloneShortCode:function () {
            var $wpb_shortcode = new $.wpbShortcode(this.$element.clone(), this.width, this.container);

            this.container.insertAfter($wpb_shortcode.$element, this.$element);
        }
    };
}(window.jQuery);