/********************** 1. Modernizer ***********************/
jQuery(function() {
    //Adds a basic vh behavior " crtt-fitscreen " :
    if (!Modernizr.cssvhunit) {
        var windowH = $(window).height();
        $('.crtt-fitscreen').css({'height':($(window).height())+'px'});
    }
});

/********************** 1. crtt-slider ***********************/
;(function($, window, document, undefined) {

    // constructor
    var CrttSlider = function( element, options ) {
        this.ele = element;
        this.$ele = $(element);
        this.options = options;
        this.metadata = this.$ele.data('options');
        
    }
    //Private methods:
    var _set = function() {
        var inst = this;

        //Set the width:
        if (inst.config.size > -1 && inst.config.size < 101) {
            inst.$ele.css("width", "" + inst.config.size + "%");
        }

        //Set Li's:
        inst.$ele.children('li').each(function(i,e){
            var $e = $(e);
            if (i !== inst.config.startAt) {
                $e.addClass("hideSlide");
            }
            inst.engine.maxele++;
        });

        //Set Cur:
        inst.engine.curele = inst.config.startAt;

        //Set state:
        inst.engine.pause = !inst.config.start;

        //Set timer
        _addTimer.call(inst);

        //console.log(this.engine);
        //console.log(this);
    };
    var _addTimer = function() {
        var inst = this;
        clearInterval(inst.engine.timer);
        if (inst.engine.pause) return;
        inst.engine.timer = setInterval(function(){ inst.nextSlide(false); }, inst.config.delay * 1000);
    };
    //The proto:
    CrttSlider.prototype = {

        defaults : {
            size    : 50,
            startAt : 0,
            delay   : 4, //sec
            start   : true 
        },
        engine : {
          maxele : 0,
          curele : 0,
          timer  : null,
          pause  : false
        },
        init: function() {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);
            _set.call(this);
            return this;
        },
        nextSlide : function(_invoke) {
            var invoke = _invoke || true;
            if (this.engine.curele + 1 < this.engine.maxele) {
                this.engine.curele++;
            } else {
                this.engine.curele = 0;
            }
            this.showSlide(invoke);
            return this;
        },
        prevSlide : function(_invoke) {
            var invoke = _invoke || true;
            if (this.engine.curele - 1 > -1) {
                this.engine.curele--;
            } else {
                this.engine.curele = this.engine.maxele - 1;
            }
            this.showSlide(invoke);
            return this;
        },
        showSlide : function(_invoke, n) {
            var inst = this;
            var invoke = _invoke || true;
            var num = 0;
            if (n !== 0) num = n || inst.engine.curele;
            if (num > -1 && num < inst.engine.maxele) {
                inst.engine.curele = num;
                var $show = inst.$ele.children('li').eq(num);
                $show.removeClass("hideSlide");
                inst.$ele.children('li').not($show).addClass("hideSlide");
                if (invoke) _addTimer.call(inst);
            }
            return this;
        },
        pause : function() {
            var inst = this;
            inst.engine.pause = true;
            _addTimer.call(inst);
            return this;
        },
        play : function(_delay) {
            var inst = this;
            if (!inst.engine.pause) return;
            var delay = _delay || inst.config.delay;
            inst.config.delay = delay;
            inst.engine.pause = false;
            _addTimer.call(inst);
            return this;
        },
        togglePlay : function() {
            if (this.engine.pause) {
                return this.play();
            } else {
                return this.pause();
            }
        },
        delay: function(_delay) {
            var delay = _delay || false;
            if (!delay) return this.config.delay;
            this.config.delay = delay;
            if (!this.engine.pause) {
                this.pause().play(delay);
            }
            return this;
        },
        current : function() {
            var inst = this;
            return {
                ele : inst.$ele.children('li').eq(inst.engine.curele),
                index : inst.engine.curele
            };
        },
        slides : function() {
            var inst = this;
            return {
                slides : inst.$ele.children('li'),
                count : inst.engine.maxele,
                current : inst.current()
            };
        }
    };
    
    CrttSlider.defaults = CrttSlider.prototype.defaults;
    
    $.fn.crttSlider = function(opt) {
        var options = opt || {};
        return this.each(function() {
            var inst = new CrttSlider(this, options).init();
            $(this).data("crttSlider", inst);
        });
    };
    
}(jQuery, window, document));


/********************** 1. Main *************************/
jQuery(function($){
    
    $("ul.crtt-slider").crttSlider();
    console.log($("ul.crtt-slider").data("crttSlider"));
    
});
/********************** 1. bigText ***********************/
;(function($){
    
	"use strict";

    $('.bigtext').bigtext();
	$(window).resize( function() {
		$('.bigtext').bigtext();
		setTimeout( function() {
			$('.bigtext').bigtext();
		}, 100 );
		setTimeout( function() {
			$('.bigtext').bigtext();
		}, 400 );
		setTimeout( function() {
			$('.bigtext').bigtext();
		}, 1400 );
		setTimeout( function() {
			$('.bigtext').bigtext();
		}, 2400 );
	});
	setTimeout(function() {
		$(window).trigger('resize scroll');
	}, 1000);
    setTimeout( function() {
		$(window).trigger('resize scroll');
	}, 3000 );
    $(window).load( function() {
		$('.bigtext').bigtext();
		$( window ).trigger('resize scroll');
		setTimeout( function() {
			$('.bigtext').bigtext();
		}, 1000 );
		setTimeout( function() {
			$('.bigtext').bigtext();
		}, 1300 );
	
    });


})(jQuery);