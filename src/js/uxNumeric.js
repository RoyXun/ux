+function($) {
    var UXNumeric = function(element, options) {
        this.element = element;
        this.options = $.extend({}, UXNumeric.DEFAULTS, options);
        this.lastValidValue = getValidValue(this.options.initValue, this.options.min, this.options.max, this.options.step);
        element.val(this.lastValidValue);
    };

    UXNumeric.DEFAULTS = {
        step: 1,
        min: 1,
        max: 10,
        initValue: 1,
        limitCallback: $.noop
    }


    UXNumeric.prototype.increase = function() {
        var element = this.element;
        var options = this.options;
        var value = parseFloat(element.val()) || options.min;

        if (value + options.step > options.max) {
            element.val(value);
            options.limitCallback.call(element, 'max');
            return;
        }

        element.val((this.lastValidValue = value + options.step));
        element.trigger('ux.numericChange', [element, 'increase']);
    };

    UXNumeric.prototype.decrease = function() {
        var element = this.element;
        var options = this.options;
        var value = parseFloat(element.val()) || options.min;

        if (value - options.step < options.min) {
            element.val(value);
            options.limitCallback.call(element, 'min');
            return;
        }

        element.val((this.lastValidValue = value - options.step));
        element.trigger('ux.numericChange', [element, 'decrease']);
    };

    UXNumeric.prototype.checkValidity = function() {
        var element = this.element;
        var value = getValidValue(element.val(), this.options.min, this.options.max, this.options.step);

        element.val(value);
        if (value != this.lastValidValue) {
            this.lastValidValue = value;
            element.trigger('ux.numericChange', [element, 'blur']);
        }

    };

    function getValidValue(input, min, max, step) {
        var value = parseFloat(input) || min;
        step = +step || 1;
        if (value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }

        value = Math.round(value / step) * step;
        if (value < min) {
            value += step;
        } else if (value > max) {
            value -= step;
        }
        return value;
    }

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('ux.numeric');

            if (!data) {
                $this.data('ux.numeric', (data = new UXNumeric($this, option)));
            }
        });
    }

    $.fn.uxNumeric = Plugin;
    $.fn.uxNumeric.constuctor = UXNumeric;

    $(document).on('click', '[data-ux-numeric="inc"]', function(e) {
        $input = $(e.target).closest('[data-ux-numeric="group"]').find('[data-ux-numeric="input"]');

        UXNumeric.prototype.increase.call($input.data('ux.numeric'));
    }).on('click', '[data-ux-numeric="dec"]', function(e) {
        $input = $(e.target).closest('[data-ux-numeric="group"]').find('[data-ux-numeric="input"]');

        UXNumeric.prototype.decrease.call($input.data('ux.numeric'));
    }).on('blur', '[data-ux-numeric="input"]', function() {
        UXNumeric.prototype.checkValidity.call($(this).data('ux.numeric'));
    });
}(jQuery);