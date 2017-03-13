(function ($) {
    'use strict';

    $.fn.uxCheck = function(options) {
        var settings = $.extend({
            checkboxCheckedClass: 'fu-checkbox',
            checkboxUncheckedClass: 'fu-checkbox-o',
            radioCheckedClass: 'fu-radio',
            radioUncheckedClass: 'fu-radio-o',
            disabledClass: 'disabled'
        }, options);

        this.on('click', function(e) {
            var $this = $(this);

            if ($this.prop('disabled')) {
                return;
            } 

            var $check = $this.siblings();
            var isChecked = $this.prop('checked');

            if ($this.is(':checkbox')) {
                var aClass = isChecked ? settings.checkboxCheckedClass : settings.checkboxUncheckedClass;
                var rClass = isChecked ? settings.checkboxUncheckedClass : settings.checkboxCheckedClass;
                $check.addClass(aClass).removeClass(rClass);
            } else if ($this.is(':radio')) {
                var $siblings = $(':radio[name="' + this.name + '"]').not(this).siblings();
                if (isChecked) {//如果当前元素选中，则把其余元素取消选中
                    $check.addClass(settings.radioCheckedClass).removeClass(settings.radioUncheckedClass);
                    $siblings.addClass(settings.radioUncheckedClass).removeClass(settings.radioCheckedClass);
                } 
            } 
        });

        return this.each(function() {
            //消除初始状态类名与状态不一致
            var $self = $(this);
            var isChecked = $self.prop('checked');
            var type = $self.attr('type');
            var aClass = isChecked ? settings[type + 'CheckedClass'] : settings[type + 'UncheckedClass'];
            var rClass = isChecked ? settings[type + 'UncheckedClass'] : settings[type + 'CheckedClass'];

            $self.siblings().addClass(aClass).removeClass(rClass);

            if ($self.prop('disabled')) {
                $self.parent().addClass(settings.disabledClass);
            }
        });

    };
})(jQuery);

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