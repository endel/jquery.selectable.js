/*
 * jquery.selectable.js
 * --------------------
 * Requires jQuery >= 1.3.2
 * Version: 0.3.2
 *
 * Copyright (c) 2012 Endel Dreyer (http://endel.me)
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

(function($) {
    "use strict";

    $.fn.selectable = function(options) {

        var defaults = {
                'radio': false,
                'class': 'selected',
                'onChange': function(e) {},
                'onSelected': function(e) {}
            },
            opts = $.extend(defaults, options),
            selector = this.selector,
            allSelected = false,
            that;

        that = {

            // Register element click (select / unselect)
            elements: $(selector).live('click', function() {
                var selection_index = $(this).find('.selection-index'),
                is_selected = $(this).hasClass(opts['class']);

                // If radio option is true, check radio button and
                // Just give class to the last checked element
                if (opts.radio) {
                    $(selector).removeClass(opts['class']);
                    $(selector).find(':radio').attr('checked', false);
                    $(this).find(':radio').attr('checked', true);
                } else {
                    var checkbox = $(this).find(':checkbox');
                    if (checkbox.length > 0) {
                        checkbox.attr('checked', !checkbox.attr('checked'));
                    }
                }

                if (is_selected) {
                    $(selection_index).remove();
                } else {
                    $(this).append($('<input type="hidden" class="selection-index" value="'+that._itemsSelected().size()+'" />'));
                }

                // Swap class
                $(this).toggleClass(opts['class']);
                if ($(this).hasClass(opts['class'])) {
                    opts.onSelected($(this));
                }

                // Call custom toggle function
                that.onChange();
            }),

            toggleSelectAll: function() {
                if (allSelected) {
                    this.deselectAll();
                } else {
                    this.selectAll();
                }
            },

            selectAll: function() {
                this.deselectAll();
                $(selector).each(function() {
                    $(this).addClass(opts['class']);
                });
                this.onChange();
            },

            deselectAll: function() {
                $(selector).each(function() {
                    $(this).removeClass(opts['class']);
                });
                this.onChange();
            },

            removeSelected: function() {
                $(selector + '.' + opts['class']).each(function() {
                    $(this).remove();
                });
                this.onChange();
            },

            onChange: function() {
                // Update element list
                opts.onChange(this.data());
            },

            data: function() {
                var total = this._items().size(),
                selected = this._itemsSelected(),
                totalSelected = selected.size();
                allSelected = (total === totalSelected) && total !== 0;

                return {
                    selected: selected.sort(function(a,b){
                        return (parseInt($(a).find('.selection-index').val(), 10) > parseInt($(b).find('.selection-index').val(), 10));
                    }),
                    totalSelected: totalSelected,
                    total: total,
                    allSelected: allSelected
                };
            },

            refresh: function() {
                // Supports only radio selectable
                $(selector + ' input[checked]').each(function() {
                    $(this).parent().addClass(opts['class']);
                });
                this.onChange();
            },

            _items: function() {
                return $(selector);
            },

            _itemsSelected: function() {
                return $(selector + '.' + opts['class']);
            }
        };

        // Add selected class to already selected elements
        $(selector).find(':checked').each(function() {
            $(this).closest(selector).addClass(opts['class']);
        });

        // Let user setup interface with onChange
        that.onChange();
        return that;
    };

})(jQuery);
