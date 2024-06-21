(function($) {
    "use strict";

    $(window).on('elementor/frontend/init', function() {
        var _elementor = typeof elementor != 'undefined' ? elementor : elementorFrontend;
        // lazy load image
        var GlobalLazyLoad = function($scope, $) {
            elementorFrontend.waypoint($scope.find('.cms-lazy'), function() {
                // remove css class
                $(this).removeClass('lazy-loading').addClass('cms-lazy-loaded');
                // add style
                var duration = $(this).data('duration');
                if(typeof duration != 'undefined'){
                    $(this).css({'animation-duration': duration+'ms'});
                }
            }, {
                //offset: 'top-in-view'
            });
        };
        elementorFrontend.hooks.addAction('frontend/element_ready/global', GlobalLazyLoad);
        // Animate
        var GlobalWidgetAnimateHandler = function($scope, $) {
            elementorFrontend.waypoint($scope.find('.elementor-invisible'), function() {
                var $heading = $(this),
                    data = $heading.data('settings');

                if (typeof data['_animation'] != 'undefined') {
                    //$heading.addClass(data['_animation']+' animated').removeClass('elementor-invisible');
                    setTimeout(function() {
                        $heading.removeClass('elementor-invisible').addClass('animated ' + data['_animation']);
                    }, data['animation_delay']);
                }
            });
        };
        elementorFrontend.hooks.addAction('frontend/element_ready/global', GlobalWidgetAnimateHandler);
        // CMS Text Scroll
        var CMSTextScrollHandler = function($scope, $) {
            // Swiper Scroll
            const Swiper = elementorFrontend.utils.swiper,
                carousel = $scope.find(".cms-swiper-container"),
                carousel_settings = {
                    wrapperClass: 'cms-swiper-wrapper',
                    slideClass: 'cms-swiper-slide',
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    spaceBetween: 10,
                    speed: 4000,
                    watchSlidesProgress: true,
                    watchSlidesVisibility: true,
                    autoplay: {
                        delay: 0,
                        pauseOnMouseEnter: false
                    },
                    loop: true,
                    navigation: false,
                    pagination: false
                };
            carousel.each(function(index, element) {
                var swiper = new Swiper(carousel, carousel_settings);
            });
            // GSAP Text Parallax
            gsap.registerPlugin(ScrollTrigger);
            var cmsScroll = $scope.find( '.cms-text-parallax' ),
                maskImage   = cmsScroll.find( '.mask-img' ),
                maskContent = cmsScroll.find( '.cms-text-parallax-content-mask' ),
                sections = gsap.utils.toArray(".cms-text-parallax-item"),
                slides = document.querySelectorAll(".fromRight"); 
            cmsScroll.each(function(){
                ScrollTrigger.create({
                    trigger: $(this),
                    start: 'top top',
                    end: () =>  "+=" + ($(this).find('.cms-text-parallax-item').outerHeight()),
                    pin: true,
                });
                if ( maskImage.length ) {
                    gsap.to(
                        maskImage, //[0] is for passing as pure js
                        {
                            scrollTrigger: {
                                trigger: maskImage,
                                start: '50% center',
                                scrub: 1,
                                toggleActions: 'restart pause reverse none',
                            },
                            webkitClipPath: 'inset(0% 0% 0% 0%)',
                            clipPath: 'inset(0% 0% 0% 0%)',
                            duration: 3,
                        }
                    );
                }

                if ( maskContent.length ) {
                    gsap.to(
                        maskContent, //[0] is for passing as pure js
                        {
                            scrollTrigger: {
                                trigger: maskContent,
                                start: '50% center',
                                scrub: 2.5,
                                toggleActions: 'restart pause reverse none',
                            },
                            webkitClipPath: 'inset(0% 0% 0% 0%)',
                            clipPath: 'inset(0% 0% 0% 0%)',
                            duration: 3,
                        }
                    );
                }
            });
        };
        // Make sure you run this code under Elementor.
        elementorFrontend.hooks.addAction('frontend/element_ready/cms_text_scroll.default', CMSTextScrollHandler);

        // CMS Swiper Split Slider
        var CMSSplitSliderHandler = function($scope, $) {
            // Swiper Scroll
            const Swiper = elementorFrontend.utils.swiper,
                carousel = $scope.find(".cms-swiper-splits"),
                carousel_settings = {
                    wrapperClass: 'swiper-split-wrapper',
                    slideClass: 'cms-swiper-split',
                    slidesPerView: 1,
                    
                    direction: 'vertical',
                    loop: false,
                    mousewheel: true,
                    sensitivity: 0.1,
                    keyboard: true,
                    releaseOnEdges: true,
                    
                    spaceBetween: 0,
                    speed: 300,
                    watchSlidesProgress: true,
                    watchSlidesVisibility: true,
                    autoplay: {
                        delay: 60000,
                        pauseOnMouseEnter: true
                    },
                    navigation: false,
                    pagination: {
                        el: '.cms-swiper-splits-dots',
                        type: 'bullets',
                        bulletClass: 'cms-swiper-pagination-bullet',
                        bulletActiveClass: 'cms-swiper-pagination-bullet-active',
                        clickable: true,
                        renderBullet: function (index, className) {
                            var number = (index + 1);
                            if(number < 10) number = '0' + number;
                            return '<span class="' + className + '">' + number + "</span>";
                        }
                    }
                };
            carousel.each(function(index, element) {
                var swiper = new Swiper(carousel, carousel_settings);
            });
        }
        elementorFrontend.hooks.addAction('frontend/element_ready/global', CMSSplitSliderHandler);
        // CMS multiScroll Split Slider
        var CMSmultiScrollHandler = function($scope, $) {
            // multiScroll
            const multiScroll = $scope.find('.cms-multiScroll'),
                  data_settings =   multiScroll.data('settings'),
                  multiScroll_settings = {
                    menu: false,
                    sectionsColor: [],
                    navigation: true,
                    navigationPosition: 'right',
                    navigationColor: '#000',
                    navigationTooltips: [],
                  };
            multiScroll.each(function(){
                $(this).multiscroll({
                    licenseKey: 'YOUR KEY HERE',
                    //sectionsColor: ['#00b3d7', '#ed2', '#ff73a1'],
                    //anchors: ['first', 'second', 'third'],
                    //menu: '#menu',
                    loopTop: false,
                    loopBottom: false,
                    navigation: true,
                    navigationPosition: 'right',
                    // selector
                    sectionSelector: '.ms-section',
                    leftSelector: '.ms-left',
                    rightSelector: '.ms-right',
                    // responsive
                    responsiveWidth: 880,
                    responsiveHeight: 600,
                    responsiveExpand: true,
                    // events
                    afterRender: function(){
                        multiScroll.addClass('cms-rendered');
                        $('body').addClass(multiScroll.data('class'));
                        $('body').find('#multiscroll-nav').addClass(multiScroll.data('menu-class'));
                        //alert("The resulting DOM structure is ready");
                    },
                    // Resize
                    afterResize: function(){  
                    }
                });
                // Fix Responsive
                if ($(window).width() < 768){
                    $(this).multiscroll.destroy(); 
                    // fix
                    $(this).parents('html').css({'overflow': '', 'height':''});
                    $(this).parents('body').css({'overflow': '', 'height':''});
                } else{
                    $(this).multiscroll.build(); 
                    // fix
                    $(this).parents('html').css({'overflow': 'hidden', 'height':'100%'});
                    $(this).parents('body').css({'overflow': 'hidden', 'height':'100%'});
                }
                $(window).on('resize', function() {
                    if ($(window).width() < 768){
                        multiScroll.multiscroll.destroy();
                        // fix
                        $scope.parents('html').css({'overflow': '', 'height':''});
                        $scope.parents('body').css({'overflow': '', 'height':''});
                    } else{
                        multiScroll.multiscroll.build();
                        // fix
                        $scope.parents('html').css({'overflow': 'hidden', 'height':'100%'});
                        $scope.parents('body').css({'overflow': 'hidden', 'height':'100%'});
                    }
                });
            });
        }
        elementorFrontend.hooks.addAction('frontend/element_ready/cms_products_showcase.default', CMSmultiScrollHandler);
        // CMS Progress Bar
        var WidgetCMSProgressBarHandler = function($scope, $) {
            elementorFrontend.waypoint($scope.find('.cms-progress-bar-wrap'), function() {
                var $progressbar = $(this).find('.cms-progress-bar');
                $progressbar.css('width', $progressbar.data('max') + '%');

                var $number = $(this).find('.cms-progress-bar-number'),
                    data = $number.data(),
                    decimalDigits = data.toValue.toString().match(/\.(.*)/);
                if (decimalDigits) {
                    data.rounding = decimalDigits[1].length;
                }
                $number.numerator(data);
            });
        };
        elementorFrontend.hooks.addAction('frontend/element_ready/global', WidgetCMSProgressBarHandler);
        // CMS Image Cursor
        var WidgetCMSPointerImageCursor = function ($scope, $){
            var $links            = $scope.find( '.cms-img-cursor' ),
                x                 = 0,
                y                 = 0,
                currentXCPosition = 0,
                currentYCPosition = 0;

            if ( $links.length ) {
                $links.on(
                    'mouseenter',
                    function () {
                        $links.removeClass( 'cms--active' );
                        $( this ).addClass( 'cms--active' );
                    }
                ).on(
                    'mousemove',
                    function ( event ) {
                        var $thisLink         = $( this ),
                            $followInfoHolder = $thisLink.find( '.cms-cursor-pointer' ),
                            $followImage      = $followInfoHolder.find( '.cms-cursor--pointer' ),
                            $followImageItem  = $followImage.find( 'img' ),
                            followImageWidth  = $followImageItem.width(),
                            followImagesCount = parseInt( $followImage.data( 'images-count' ), 10 ),
                            followImagesSrc   = $followImage.data( 'images' ),
                            $followTitle      = $followInfoHolder.find( '.cms-cursor--title' ),
                            itemWidth         = $thisLink.outerWidth(),
                            itemHeight        = $thisLink.outerHeight(),
                            itemOffsetTop     = $thisLink.offset().top - $( window ).scrollTop(),
                            itemOffsetLeft    = $thisLink.offset().left;
                        x = (event.clientX - itemOffsetLeft) >> 0;
                        y = (event.clientY - itemOffsetTop) >> 0;

                        if ( x > itemWidth ) {
                            currentXCPosition = itemWidth;
                        } else if ( x < 0 ) {
                            currentXCPosition = 0;
                        } else {
                            currentXCPosition = x;
                        }

                        if ( y > itemHeight ) {
                            currentYCPosition = itemHeight;
                        } else if ( y < 0 ) {
                            currentYCPosition = 0;
                        } else {
                            currentYCPosition = y;
                        }

                        if ( followImagesCount > 1 ) {
                            var imagesUrl    = followImagesSrc.split( '|' ),
                                itemPartSize = itemWidth / followImagesCount;

                            $followImageItem.removeAttr( 'srcset' );

                            if ( currentXCPosition < itemPartSize ) {
                                $followImageItem.attr( 'src', imagesUrl[0] );
                            }

                            // -2 is constant - to remove first and last item from the loop
                            for ( var index = 1; index <= (followImagesCount - 2); index++ ) {
                                if ( currentXCPosition >= itemPartSize * index && currentXCPosition < itemPartSize * (index + 1) ) {
                                    $followImageItem.attr( 'src', imagesUrl[index] );
                                }
                            }

                            if ( currentXCPosition >= itemWidth - itemPartSize ) {
                                $followImageItem.attr( 'src', imagesUrl[followImagesCount - 1] );
                            }
                        }

                        $followImage.css(
                            {
                                'top': itemHeight / 2,
                            }
                        );
                        $followTitle.css(
                            {
                                'transform': 'translateY(' + -(parseInt( itemHeight, 10 ) / 2 + currentYCPosition) + 'px)',
                                'left': -(currentXCPosition - followImageWidth / 2),
                            }
                        );
                        $followInfoHolder.css( { 'top': currentYCPosition, 'left': currentXCPosition } );
                    }
                ).on(
                    'mouseleave',
                    function () {
                        $links.removeClass( 'cms--active' );
                    }
                );
            }
        }
        elementorFrontend.hooks.addAction('frontend/element_ready/global', WidgetCMSPointerImageCursor);
    });
}(jQuery));