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
            radioUncheckedClass: 'fu-radio-o'
        }, options);


        return this.each(function() {
            $(this).on('click', function(e) {
                var $this = $(this);

                if ($this.is('.disabled, :disabled')) return;

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
                    } else {//这个条件分支主要为了初始检查
                        $check.addClass(settings.radioUncheckedClass).removeClass(settings.radioCheckedClass);
                    }
                } 
            }).triggerHandler('click');//触发点击处理事件消除初始状态图标和控件不一致

        });

    };
})(jQuery);