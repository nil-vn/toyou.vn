/* =========================================================
 * layout.js v0.5.0
 * =========================================================
 * Copyright 2012 Wpbakery
 *
 * Visual composer layout object. Helps to create and edit
 * shortcodes inside content layouts.
 * Require: $.wpbStage.
 * ========================================================= */


!function ($) {

    $.wpbLayout = function ($element) {
        this.$view = $element;
        this.$contentView = $element;
        this.$navigationView = $element;
        this.init();
    };
    $.wpbLayout.prototype = $.extend({}, $.wpbStage.prototype, {
        init:function () {
            this.initContent();
            this.initHelperText();
            this.checkIsEmpty();
        },
        initHelperText:function () {
            var that = this;
            this.$contentView.unbind('click.newElementCreate').on('click.newElementCreate', '.add-element-to-layout', function (e) {
                e.preventDefault();
                var modal = new $.wpbModal(that);
                modal.showList();
            });
        },
        _initDragAndDrop:function () {
            var that = this;
            this.$contentView.droppable({
                greedy:true,
                accept:function (dropable_el) {
                    if (dropable_el.hasClass('dropable_el') && $(this).hasClass('ui-droppable') && dropable_el.hasClass('not_dropable_in_third_level_nav')) {
                        return false;
                    } else if (dropable_el.hasClass('dropable_el')) {
                        return true;
                    }
                },
                hoverClass:"wpb_ui-state-active",
                over:function (event, ui) {
                    $(this).parent().addClass("wpb_ui-state-active");
                },
                out:function (event, ui) {
                    $(this).parent().removeClass("wpb_ui-state-active");
                },
                drop:function (event, ui) {
                    $(this).parent().removeClass("wpb_ui-state-active");
                    if (ui.draggable.is('#wpb-add-new-element')) {
                        var modal = new $.wpbModal(that);
                        modal.showList();
                    } else {
                        var shortCode = new $.wpbShortcode(ui.draggable.attr('data-element'), ui.draggable.attr('data-width'), that);
                    }
                }
            });
            this._setSortable();
        }
    });

}(window.jQuery);