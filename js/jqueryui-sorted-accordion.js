/**
 * LEAPS - Low Energy Accurate Positioning System.
 *
 * Sorted accordion JQuery UI extension to the accordion UI element
 *
 * Copyright (c) 2016-2018, LEAPS. All rights reserved.
 *
 */
(function($){
    $.widget("ui.sortedAccordion", $.ui.accordion, {
        sort: function() {
            var $sorted = $('.node-type-data .node-ui', this.element).sort(function($a, $b){
                var aText = $('.node-name', $a).text(),
                    bText = $('.node-name', $b).text(),
                    retVal = aText > bText ? 1 : -1;
                return retVal;
            });
            $sorted.detach().appendTo($('.node-type-data', this.element))
        }
    });
})(jQuery)
