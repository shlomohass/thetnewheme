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
        this.engine = {
          maxele   : 0,
          curele   : 0,
          header   : null,
          overlay  : null,
          controls : null, 
          timer    : null,
          pause    : false
        };
    }
    
    //Private methods:
    var _set = function() {
        var inst = this;
        
        //Set the width:
        if (inst.config.size > -1 && inst.config.size < 101) {
            inst.$ele.css("width", "" + inst.config.size + "%");
        }

        //Set Li's:
        console.log(inst.engine);
        inst.$ele.children('li').not(".crtt-slide-header").each(function(i,e) {
            var $e = $(e);
            if (i !== inst.config.startAt) {
                $e.addClass("hideSlide");
            }
            $e.addClass("crtt-slide");
            inst.engine.maxele++;
        });

        //Set header:
        inst.engine.header = inst.$ele.children('li.crtt-slide-header');

        //Set overlay:
        if (inst.config.overlay !== false) {
            inst.engine.header = $("<li class='crtt-slide-overlay' />").css({ "backgroundColor" : inst.config.overlay });
            inst.$ele.prepend(inst.engine.header);
        }
        
        //Set controls - pages:
        inst.engine.controls = $("<li class='crtt-controls crtt-" + inst.config.controlsSize + "'><div class='crtt-controls-pages'></div><div class='crtt-controls-down'></div></li>");
        inst.$ele.append(inst.engine.controls);
        if (inst.config.showPages) {
            for (var i = 0; i < inst.engine.maxele; i++) {
                inst.engine.controls.children(".crtt-controls-pages").append(
                    $("<div class='crtt-controls-page' data-slide='" + i + "' />")
                    .css({ "backgroundColor" : i === inst.config.startAt ? inst.config.controlsColor[1] : inst.config.controlsColor[0] })
                    .addClass(i === inst.config.startAt ? "crtt-cur" : "")
                    .click(function() {
                        var $el = $(this);
                        var plug = $el.closest("ul.crtt-slider").data("crttSlider");
                        var who = $el.data("slide");
                        plug.showSlide(true, who);
                    })
                );
            }
        }
        
        //Set controls - play:
        if (inst.config.showControls) {
            inst.engine.controls.children(".crtt-controls-pages").append(
                $("<div class='crtt-controls-play pause' />")
                .css({ "color" : inst.config.controlsColor[0] })
                .addClass(inst.config.start ? "crtt-pause" : "")
                .click(function(){
                    var $el = $(this);
                    var plug = $el.closest("ul.crtt-slider").data("crttSlider");
                    plug.togglePlay();
                    var state = plug.getState();
                    if (state.play) {
                        $el.addClass("crtt-pause");
                    } else {
                        $el.removeClass("crtt-pause");
                    }
                })
            );
        }
        
        //Set controls - pagedown:
        if (inst.config.pageDown) {
            
        }
        
        //Set Cur:
        inst.engine.curele = inst.config.startAt;

        //Set state:
        inst.engine.pause = !inst.config.start;

        //Set timer
        _addTimer.call(inst);

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
            size         : 50,
            startAt      : 0,
            delay        : 2, //sec
            start        : false,
            overlay      : "rgba(0,0,0,.15)",
            showPages    : true,
            showControls : true,
            controlsSize : "medium", //small, medium, large
            pageDown     : true,
            controlsColor : ["#ffffff","#ff9238"], //Normal, Hover/Active
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
                
                //Show the slide:
                var $show = inst.$ele.children('li.crtt-slide').eq(num);
                $show.removeClass("hideSlide");
                inst.$ele.children('li.crtt-slide').not($show).addClass("hideSlide");
                
                //Show the controls:
                if (inst.config.showPages) {
                    inst.engine.controls.find('div.crtt-controls-page').removeClass("crtt-cur").css({ "backgroundColor": inst.config.controlsColor[0]});
                    inst.engine.controls.find('div.crtt-controls-page').eq(num).addClass("crtt-cur").css({"backgroundColor": inst.config.controlsColor[1] });
                }
                
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
        getState : function() {
            return {
                cur : this.engine.curele,
                play : !this.engine.pause
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
        this.each(function(index, ele) {
            var inst = new CrttSlider(ele, options).init();
            $(ele).data("crttSlider", inst);
        });
    };
    
}(jQuery, window, document));

/********************** 1. crtt-gallery ***********************/
;(function($, window, document, undefined) {

    // constructor
    var CrttGal = function( element, options ) {
        this.ele = element;
        this.$ele = $(element);
        this.$shower = null;
        this.options = options;
        this.metadata = this.$ele.data('options');
        this.model = [];
    }
    
    //Private methods:
    var _set = function() {
        var inst = this;
        
        //Add the display:
        _addDisplay.call(inst);
        
        //Loop Set:
        inst.$ele.find("li > div.img").each(function(index, ele) {
            
            //Set Images:
            $(ele).css({ "backgroundImage" : "url(" + $(ele).data("src") + ")" });

            //Set Overlays:
            var icon = $(ele).data("trigger");
            if (icon == "video" || icon == "link" || icon == "image") { icon = icon; } else { icon = ""; }
            $(ele).append(
                $("<div class='crtt-gal-overlay " + icon + "' />").click(function() {
                    var $this = $(this);
                    $(this).closest(".crtt-gallery").data("crttgal").show($this);
                })
            );
            
        });
        
    };
    
    var _addDisplay = function() {
        var inst = this;
        var $dis = $(
            "<div class='crtt-gal-display-wrapper'>" + 
                "<div class='crtt-gal-display'>" +
                    "<img class='cell-one' src='' />" +
                    "<img class='cell-two' src='' style='display:none;' />" +
                    "<div class='crtt-gal-cont-left'><span class='flaticon-play-button'></span></div>" +
                    "<div class='crtt-gal-cont-right'><span class='flaticon-play-button'></span></div>" +
                    "<div class='crtt-gal-cont-close'><span class='flaticon-error'></span></div>" +
                "</div>" +
            "</div>"
        );
        $("body").append($dis);
        inst.$shower = $dis;
        $dis.find(".crtt-gal-cont-close").click(function(){ 
            inst.close();
        });
        $dis.find(".crtt-gal-cont-left").click(function(){ 
            inst.slideLeft();
        });
        $dis.find(".crtt-gal-cont-right").click(function(){ 
            inst.slideRight();
        });
    };
    //The proto:
    CrttGal.prototype = {

        defaults : {
        },
        init: function() {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);
            _set.call(this);
            return this;
        },
        show: function($e) {
            
            var $ele = $e.closest("div.img");        
            var $row = $ele.closest("li"),
                mul = this.hasMul(),
                src = $ele.data("src"),
                meta = $ele.data("meta");
            
            if ($ele.data("trigger") == "image") {
                this.navsDisplay(mul);
                this.buildModel();
                this.$ele.find("li").not($row).removeClass("scrtt-showing");
                $row.addClass("scrtt-showing");
                this.setShowerMain(src);
                this.$shower.fadeIn();
            }
        },
        close: function() {
            this.$ele.find("li").removeClass("scrtt-showing");
            this.$shower.fadeOut();
        },
        hasMul: function() {
            return this.$ele.find("[data-trigger='video'], [data-trigger='image']").length > 1
        },
        buildModel : function() {
            var $all = this.$ele.find("[data-trigger='video'], [data-trigger='image']");
            var inst = this;
            inst.model = [];
            if ($all.length < 2) return;
            $all.each(function(index, ele){
                $(ele).data("tab", index);
                inst.model.push(ele);
            });
        },
        navsDisplay : function(show) {
            if (show)
                this.$shower.find(".crtt-gal-cont-right, .crtt-gal-cont-left").show();
            else 
                this.$shower.find(".crtt-gal-cont-right, .crtt-gal-cont-left").hide();
        },
        setShowerMain: function(img) {
            var $one = this.$shower.find(".cell-one").eq(0),
                $two = this.$shower.find(".cell-two").eq(0).hide();
                $one.attr("src", img);
        },
        slideRight: function() {
            //All needed:
            var $one = this.$shower.find(".cell-one").eq(0),
                $two = this.$shower.find(".cell-two").eq(0),
                $cur = this.$ele.find(".scrtt-showing"),
                $all = this.$ele.find("[data-trigger='video'], [data-trigger='image']");
            if (this.model.length > 1) {
                var tab = $cur.children("div").data("tab");
                var $next;
                //Get the next:
                if (tab + 1 < this.model.length) { $next = $(this.model[tab + 1]); } else { $next = $(this.model[0]); }
                //Toggle:
                console.log(tab, $next);
                if ($one.is(":visible")) {
                       $two.attr("src", $next.data("src")); 
                       $two.fadeIn();
                       $one.fadeOut();
                } else {
                       $one.attr("src", $next.data("src"));
                       $one.fadeIn();
                       $two.fadeOut();
                }
            }
        },
        slideLeft: function() {
            var $one = this.$shower.find(".cell-one").eq(0),
                $two = this.$shower.find(".cell-two").eq(0).hide();
            $one.attr("src", img);
        }
    };
    
    CrttGal.defaults = CrttGal.prototype.defaults;
    
    $.fn.crttGal = function(opt) {
        var options = opt || {};
        this.each(function(index, ele) {
            var inst = new CrttGal(ele, options).init();
            $(ele).data("crttgal", inst);
        });
    };
    
}(jQuery, window, document));


/********************** 1. FitHeight *************************/
jQuery(function($){
    
    setTimeout(function(){
        $("[data-fitheight]").each(function(inde, ele){
            var $ele = $(ele);
            var to = $ele.data('fitheight');
            var target;
            if (to != null) {
                target = $ele.closest(to);
            } else {
                target = $ele.parent();
            }
            $ele.css("height",target.height());
        });
    },500);
});
/********************** 1. Main *************************/
jQuery(function($){
    
    $("ul.crtt-main-slider").crttSlider();   
    $("ul.crtt-gallery").crttGal();  
    
    //Delaye for the fit to kick in:
    setTimeout(function(){ 
        $("ul.crtt-work-slider").crttSlider();    
    },600);
    
});


/********************** 1. bigText ***********************/
;(function($){
    
	"use strict";
    var bigtextOptions = {
        maxfontsize: 60 // default is 528 (in px)
    };
    
    $('.bigtext').bigtext(bigtextOptions);
	$(window).resize( function() {
		$('.bigtext').bigtext(bigtextOptions);
		setTimeout( function() {
			$('.bigtext').bigtext(bigtextOptions);
		}, 100 );
		setTimeout( function() {
			$('.bigtext').bigtext(bigtextOptions);
		}, 400 );
		setTimeout( function() {
			$('.bigtext').bigtext(bigtextOptions);
		}, 1400 );
		setTimeout( function() {
			$('.bigtext').bigtext(bigtextOptions);
		}, 2400 );
	});
	setTimeout(function() {
		$(window).trigger('resize scroll');
	}, 1000);
    setTimeout( function() {
		$(window).trigger('resize scroll');
	}, 3000 );
    $(window).load( function() {
		$('.bigtext').bigtext(bigtextOptions);
		$( window ).trigger('resize scroll');
		setTimeout( function() {
			$('.bigtext').bigtext(bigtextOptions);
		}, 1000 );
		setTimeout( function() {
			$('.bigtext').bigtext(bigtextOptions);
		}, 1300 );
	
    });


})(jQuery);