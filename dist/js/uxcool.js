if (typeof jQuery === 'undefined') {
    throw new Error('Uxcool\'s JavaScript requires jQuery');
}

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