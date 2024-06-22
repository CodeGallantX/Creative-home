;
(function($) {
    "use strict";
    /* ===================
     Page reload 
     ===================== */
    var scroll_top;
    var last_scroll_top = 0;
    var $imgLogo = $('#cms-header .site-logo img');
    var srcLogo = $imgLogo.attr('src'),
        srcLogoMobile = $imgLogo.data('mobile'),
        logo_tablet_mobile_size = 1025;
    var dataSticky = $imgLogo.data('sticky');
    var dataStickyMobile = $imgLogo.data('sticky-mobile');
    var $header = $('#cms-header');
    var header_height = $header.outerHeight();
    var header_btn1 = $header.find('.h-btn1'),
        header_btn1_classes = header_btn1.data('classes'),
        header_btn2 = $header.find('.h-btn2'),
        header_btn2_classes = header_btn2.data('classes'),
        header_btn_phone = $header.find('.site-header-phone .btn'),
        header_btn_phone_classes = header_btn_phone.data('classes');

    $(window).on('load', function() {
        $(".cms-loader").fadeOut("slow");
        scroll_top = $(this).scrollTop();
        if (scroll_top > header_height) {
            $header.addClass('header-sticky-hidden');
        }
        if ($(window).outerWidth() < logo_tablet_mobile_size && srcLogoMobile != null) {
            $($imgLogo).attr('src', srcLogoMobile);
        }
        // change class for header button
        if ($header.hasClass('header-transparent')) {
            setTimeout(function() {
                $('body').css('--cms-wrap-header-height', $('.header-transparent').outerHeight() + 'px');
            }, 1000);

            if (header_btn1.length > 0) {
                header_btn1.removeClass(header_btn1_classes['default'].replace('+', ' ')).addClass(header_btn1_classes['transparent'].replace('+', ' '));
            }
            if (header_btn2.length > 0) {
                header_btn2.removeClass(header_btn2_classes['default'].replace('+', ' ')).addClass(header_btn2_classes['transparent'].replace('+', ' '));
            }
            if (header_btn_phone.length > 0) {
                //header_btn_phone.removeClass(header_btn_phone_classes['default']).addClass(header_btn_phone_classes['transparent']);
            }
        } else {
            if (header_btn1.length > 0) {
                header_btn1.removeClass(header_btn1_classes['transparent'].replace('+', ' ')).addClass(header_btn1_classes['default'].replace('+', ' '));
            }
            if (header_btn2.length > 0) {
                header_btn2.removeClass(header_btn2_classes['transparent'].replace('+', ' ')).addClass(header_btn2_classes['default'].replace('+', ' '));
            }
            if (header_btn_phone.length > 0) {
                header_btn_phone.removeClass(header_btn_phone_classes['transparent'].replace('+', ' ')).addClass(header_btn_phone_classes['default'].replace('+', ' '));
            }
        }
        //
        trevox_dropdown_touched_side();
        //trevox_header_cart_dropdown();
        // WooCommerce
        trevox_single_product_gallery_arrows();
    });

    $(window).on('resize', function() {
        if ($header.hasClass('header-transparent')) {
            setTimeout(function() {
                $('body').css('--cms-wrap-header-height', $('.header-transparent').outerHeight()+'px');
            }, 0);
        }
        if ($header.hasClass('header-sticky-show')) {
            $header.addClass('header-sticky-hidden').removeClass('header-sticky-show');
        }

        if ($(window).outerWidth() < logo_tablet_mobile_size && srcLogoMobile != null) {
            $($imgLogo).attr('src', srcLogoMobile);
        } else {
            $($imgLogo).attr('src', srcLogo);
        }
        $('.cms-primary-menu-dropdown .sub-menu').removeClass('submenu-open').attr('style','');
        // Dropdown Mega Menu
        trevox_dropdown_mega_menu_full_width();
        //trevox_header_cart_dropdown();
        trevox_dropdown_touched_side();
        // WooCommerce
        trevox_single_product_gallery_arrows();
    });

    // load more
    $(document).on('click', '.cms-load-more', function() {
        var loadmore = $(this).data('loadmore');
        var _this = $(this).parents(".cms-grid");
        var layout_type = _this.data('layout');
        var loading_text = $(this).data('loading-text');
        var no_text = $(this).data('no-text');

        loadmore.maxPages = parseInt(_this.data('max-pages'));
        loadmore.paged = parseInt(_this.data('start-page')) + 1;

        _this.find('.cms-grid-overlay').addClass('loader');
        $(this).addClass('loading');
        $(this).find('.cms-btn-icon').addClass('loading');
        $(this).find('.cms-btn-text').text(loading_text);
        $.ajax({
                url: main_data.ajax_url,
                type: 'POST',
                beforeSend: function() {

                },
                data: {
                    action: 'trevox_load_more_post_grid',
                    settings: loadmore
                }
            })
            .done(function(res) {
                if (res.status == true) {
                    _this.find('.cms-grid-content').append(res.data.html);
                    _this.data('start-page', res.data.paged);
                    _this.find('.cms-grid-overlay').removeClass('loader');
                    _this.find('.cms-load-more').removeClass('loading');
                    _this.find('.cms-btn-icon').removeClass('loading');
                    _this.find('.cms-btn-text').text('Load More');
                    if (res.data.paged == loadmore.maxPages) {
                        _this.find('.cms-load-more').addClass('no-more');
                        _this.find('.cms-btn-text').text(no_text);
                    }
                    if (layout_type == 'masonry') {
                        $.sep_grid_refresh();
                    }
                } else if (res.status == false) {
                    _this.find('.cms-load-more').addClass('no-more');
                }
            })
            .fail(function(res) {
                _this.find('.cms-load-more').addClass('no-more');
                return false;
            })
            .always(function() {
                return false;
            });
    });

    // pagination
    $(document).on('click', '.cms-grid-pagination .ajax a.page-numbers', function() {
        var _this = $(this).parents(".cms-grid");
        var loadmore = _this.find(".cms-grid-pagination").data('loadmore');
        var query_vars = _this.find(".cms-grid-pagination").data('query');
        var layout_type = _this.data('layout');
        var paged = $(this).attr('href');
        paged = paged.replace('#', '');
        loadmore.paged = parseInt(paged);
        query_vars.paged = parseInt(paged);
        _this.find('.cms-grid-overlay').addClass('loader');
        $('html,body').animate({ scrollTop: _this.offset().top - 100 }, 750);
        // reload pagination
        $.ajax({
            url: main_data.ajax_url,
            type: 'POST',
            beforeSend: function() {

            },
            data: {
                action: 'trevox_get_pagination_html',
                query_vars: query_vars
            }
        }).done(function(res) {
            if (res.status == true) {
                _this.find(".cms-grid-pagination").html(res.data.html);
                _this.find('.cms-grid-overlay').removeClass('loader');
            } else if (res.status == false) {}
        }).fail(function(res) {
            return false;
        }).always(function() {
            return false;
        });
        // load post
        $.ajax({
            url: main_data.ajax_url,
            type: 'POST',
            beforeSend: function() {

            },
            data: {
                action: 'trevox_load_more_post_grid',
                settings: loadmore
            }
        }).done(function(res) {
            if (res.status == true) {
                _this.find('.cms-grid-content .cms-item').remove();
                _this.find('.cms-grid-content').append(res.data.html);
                _this.data('start-page', res.data.paged);
                if (layout_type == 'masonry') {
                    $.sep_grid_refresh();
                }
            } else if (res.status == false) {}
        }).fail(function(res) {
            return false;
        }).always(function() {
            return false;
        });
        return false;
    });

    // post filter
    $(document).on('click', '.cms-grid .grid-filter-wrap .filter-item', function() {
        if ($(this).hasClass('active')) {
            return false;
        }
        let gridEl = $(this).parents('.cms-grid');
        gridEl.find('.grid-filter-wrap .filter-item').removeClass('active');
        $(this).addClass('active');

        let loadmore = gridEl.find(".cms-grid-pagination").data('loadmore') || gridEl.find(".cms-load-more").data('loadmore'); 
        loadmore = $.extend({}, loadmore);
        let query_vars = gridEl.find(".cms-grid-pagination").data('query') || gridEl.find(".cms-load-more").data('query');
        let layout_type = gridEl.data('layout');
        let filter = $(this).data('filter');
        if (typeof filter == 'undefined' || filter == "*" || filter == '') {
            filter = '';
        } else {
            loadmore.source = [filter];
        }

        loadmore.paged = 1;
        query_vars.paged = 1;
        gridEl.find('.cms-grid-overlay').addClass('loader');
        // reload pagination
        $.ajax({
            url: main_data.ajax_url,
            type: 'POST',
            beforeSend: function() {

            },
            data: {
                action: 'trevox_get_pagination_html',
                query_vars: query_vars,
                filter: filter,
            }
        }).done(function(res) {
            if (res.status == true) {
                gridEl.find(".cms-grid-pagination").html(res.data.html);
                gridEl.find('.cms-grid-overlay').removeClass('loader');
            } else if (res.status == false) {}
        }).fail(function(res) {
            return false;
        }).always(function() {
            return false;
        });
        // load post
        $.ajax({
            url: main_data.ajax_url,
            type: 'POST',
            beforeSend: function() {

            },
            data: {
                action: 'trevox_load_more_post_grid',
                settings: loadmore
            }
        }).done(function(res) {
            if (res.status == true) {
                gridEl.find('.cms-grid-content .cms-item').remove();
                gridEl.find('.cms-grid-content').append(res.data.html);
                gridEl.data('start-page', res.data.paged);
            } else if (res.status == false) {}
        }).fail(function(res) {
            return false;
        }).always(function() {
            return false;
        });
        return false;
    });

    /* ====================
        Scroll To Top
    ====================== */
    $(window).on('scroll', function() {
        scroll_top = $(this).scrollTop();
        trevox_header_sticky();
        trevox_scroll_to_top();
        last_scroll_top = scroll_top;
    });

    function trevox_scroll_to_top() {
        if (scroll_top > last_scroll_top && scroll_top > header_height + 300) {
            $('.scroll-top').removeClass('to-top-show').addClass('to-top-hidden');
        } else {
            $('.scroll-top').removeClass('to-top-hidden').addClass('to-top-show');
            if (scroll_top < header_height + 300) {
                $('.scroll-top').removeClass('to-top-hidden').removeClass('to-top-show');
            }
        }
    }
    /* ====================
        Header Sticky
    ====================== */
    function trevox_header_sticky() {
        //if($header.hasClass('sticky-on')){
        if (scroll_top > 2 && scroll_top < header_height && $header.hasClass('transparent-on')) {
            $header.addClass('header-sticky-show');
            $imgLogo.attr('src', dataSticky);
            if ($(window).outerWidth() < logo_tablet_mobile_size && dataStickyMobile != null) {
                $($imgLogo).attr('src', dataStickyMobile);
            }
            // change class for header button
            if (header_btn1.length > 0) {
                header_btn1.removeClass(header_btn1_classes['transparent']).addClass(header_btn1_classes['default']);
            }
            if (header_btn2.length > 0) {
                header_btn2.removeClass(header_btn2_classes['transparent']).addClass(header_btn2_classes['default']);
            }
            if (header_btn_phone.length > 0) {
                header_btn_phone.removeClass(header_btn_phone_classes['transparent']).addClass(header_btn_phone_classes['default']);
            }
        }

        if (scroll_top > last_scroll_top && scroll_top > header_height) {
            if (!$header.hasClass('header-sticky-hidden')) {
                $header.removeClass('header-sticky-show').addClass('header-sticky-hidden');
                $($imgLogo).attr('src', srcLogo);
                if ($(window).outerWidth() < logo_tablet_mobile_size) {
                    $($imgLogo).attr('src', srcLogoMobile);
                }
                // change class for header button
                if (header_btn1.length > 0) {
                    header_btn1.removeClass(header_btn1_classes['default']).addClass(header_btn1_classes['transparent']);
                }
                if (header_btn2.length > 0) {
                    header_btn2.removeClass(header_btn2_classes['default']).addClass(header_btn2_classes['transparent']);
                }
                if (header_btn_phone.length > 0) {
                    header_btn_phone.removeClass(header_btn_phone_classes['default']).addClass(header_btn_phone_classes['transparent']);
                }
            }
            if ($header.hasClass('header-mobile-open')) {
                $imgLogo.attr('src', dataSticky);
                if ($(window).outerWidth() < logo_tablet_mobile_size) {
                    $($imgLogo).attr('src', dataStickyMobile);
                }
            }
        } else {
            if ($header.hasClass('header-sticky-hidden') && $header.hasClass('sticky-on')) {
                $header.removeClass('header-sticky-hidden').addClass('header-sticky-show');
                $imgLogo.attr('src', dataSticky);
                if ($(window).outerWidth() < logo_tablet_mobile_size) {
                    $($imgLogo).attr('src', dataStickyMobile);
                }
                if (!$header.hasClass('transparent-on')) {
                    $('#cms-header-wrap').height(header_height);
                }
                // change class for header button
                if (header_btn1.length > 0) {
                    header_btn1.removeClass(header_btn1_classes['transparent']).addClass(header_btn1_classes['default']);
                }
                if (header_btn2.length > 0) {
                    header_btn2.removeClass(header_btn2_classes['transparent']).addClass(header_btn2_classes['default']);
                }

                if (header_btn_phone.length > 0) {
                    header_btn_phone.removeClass(header_btn_phone_classes['transparent']).addClass(header_btn_phone_classes['default']);
                }
            }
            if (scroll_top < header_height) {
                $header.removeClass('header-sticky-hidden').removeClass('header-sticky-show');
                if (!$header.hasClass('transparent-on')) {
                    $('#cms-header-wrap').height('auto');
                }

                // change class for header button
                if (header_btn1.length > 0) {
                    header_btn1.removeClass(header_btn1_classes['default']).addClass(header_btn1_classes['transparent']);
                }
                if (header_btn2.length > 0) {
                    header_btn2.removeClass(header_btn2_classes['default']).addClass(header_btn2_classes['transparent']);
                }
                if (header_btn_phone.length > 0 && $header.hasClass('transparent-on')) {
                    header_btn_phone.removeClass(header_btn_phone_classes['default']).addClass(header_btn_phone_classes['transparent']);
                }

                $imgLogo.attr('src', srcLogo);
                if ($(window).outerWidth() < logo_tablet_mobile_size) {
                    $($imgLogo).attr('src', srcLogoMobile);
                }
                if ($header.hasClass('transparent-on') && $header.hasClass('header-mobile-open')) {
                    $($imgLogo).attr('src', dataSticky);
                } else {
                    $($imgLogo).attr('src', srcLogo);
                }
                if ($(window).outerWidth() < logo_tablet_mobile_size) {
                    if ($header.hasClass('transparent-on') && $header.hasClass('header-mobile-open')) {
                        $($imgLogo).attr('src', dataStickyMobile);
                    } else {
                        $($imgLogo).attr('src', srcLogoMobile);
                    }
                }
            }
            if ($header.hasClass('header-mobile-open')) {
                $header.removeClass('header-sticky-hidden').addClass('header-sticky-show');
            }
        }
        //} 
    }

    $(document).ready(function() {
        /* =================
         Menu Dropdown
         =================== */
        var $menu = $('.site-navigation-dropdown');
        $menu.find('.cms-primary-menu-dropdown li').each(function() {
            var $submenu = $(this).find('> ul.sub-menu');
            if ($submenu.length == 1) {
                $(this).on('hover', function() {
                    if ($submenu.offset().left + $submenu.width() > $(window).width()) {
                        $submenu.addClass('back');
                    } else if ($submenu.offset().left < 0) {
                        $submenu.addClass('back');
                    }
                }, function() {
                    $submenu.removeClass('back');
                });
            }
        });

        $('.sub-menu .current-menu-item').parents('.menu-item-has-children').addClass('current-menu-ancestor');
        $('.mega-auto-width').parents('.megamenu').addClass('remove-pos');
        // add current ancestor for mega parent 
        $('.cms-emenu-6 > .cms-title').each(function(){
           var mega_url  = $(this).attr("href"); 
           var mega_root = window.location.href;
            if(mega_url == mega_root){
                $('.cms-emenu-6 > .cms-title').addClass('current');
                $('.cms-emenu-6 > .cms-title').parents('.menu-item-has-children').addClass('current-menu-ancestor');
            }
        });
        /* =================
         Menu Mobile
         =================== */
        $("#main-menu-mobile").on('click', function(e) {
            e.preventDefault();
            $('#cms-header').toggleClass('header-mobile-open');
            $(this).find('.open-menu').toggleClass('opened');
            $('.site-navigation').toggleClass('navigation-open');
            if (scroll_top < header_height) {
                $header.removeClass('header-sticky-hidden').removeClass('header-sticky-show');
            }
            if (scroll_top < header_height) {
                if ($header.hasClass('transparent-on') && $header.hasClass('header-mobile-open')) {
                    //$($imgLogo).attr('src', dataSticky);
                } else {
                    //$($imgLogo).attr('src', srcLogo);
                }
            }
            if ($(window).outerWidth() < logo_tablet_mobile_size) {
                if (scroll_top < header_height) {
                    if ($header.hasClass('transparent-on') && $header.hasClass('header-mobile-open')) {
                        $($imgLogo).attr('src', dataStickyMobile);
                    } else {
                        $($imgLogo).attr('src', srcLogoMobile);
                    }
                }
            }
        });
        $("#main-menu-mobile-close").on('click', function() {
            $('#cms-header').removeClass('header-mobile-open');
            $('.site-navigation').removeClass('navigation-open');
            $('.open-menu').removeClass('opened');
        });
        /* Mobile Sub Menu */
        $('.main-menu-toggle').on('click', function(e) {
            e.preventDefault();
            $(this).toggleClass('open');
            $(this).parents('.menu-item').find('> .sub-menu').toggleClass('submenu-open');
            $(this).parent('.cms-menu-link').next('.sub-menu').slideToggle();
        });

        // HTML Checkbox
        $('.cms-checkbox').on('click', function(){
            $(this).toggleClass('checked')
        });
        $('input[type=checkbox], input[type=radio]').on('change', function () {
          $(this).parent().toggleClass("checked");
        });
        // Modal
        trevox_modal();
        // Dropdown Mega Menu
        trevox_dropdown_mega_menu_full_width();
        // Dropdown touched side
        trevox_dropdown_touched_side();
        // Lazy load
        trevox_lazy_images();
        // Woo
        trevox_quantity_plus_minus_action();
        trevox_header_cart_dropdown();
        trevox_single_product_gallery_arrows();
        trevox_woo_checkout_place_order_button();
        trevox_woocs_menu_change_currency();

        // WPCF7
        trevox_wpcf7();
        // Select 2 
        trevox_select2();
    });
    // Ajax Complete
    $(document).ajaxComplete(function(event, xhr, settings){
        "use strict";
        // Modal
        //trevox_modal();
        // WPCF7
        trevox_wpcf7();
        // WooCommerce
        trevox_woo_checkout_place_order_button();
        trevox_single_product_gallery_arrows();
        // Select 2 
        trevox_select2();
    });
    /**
     * Modal
     * 
     * */
    function trevox_modal(){
        "use strict";
        $('.cms-modal').each(function() {
            var modal_open = $(this).data('modal'),
                modal_mode = $(this).data('modal-mode'),
                modal_slide = $(this).data('modal-slide'),
                modal_class = $(this).data('modal-class'),
                modal_width = $(this).data('modal-width'),
                modal_space = $(this).data('modal-space'),
                modal_space_top = parseInt($(modal_open).find('.cms-modal-content').css('padding-top')),
                modal_space_bot = parseInt($(modal_open).find('.cms-modal-content').css('padding-bottom')),
                modal_hidden = $(this).data('modal-hidden'),
                modal_placeholder = $(this).data('modal-placeholder'),
                close_text = $(this).data('close-text');

            $(modal_open).addClass('cms-modal-' + modal_mode);
            $(modal_open).addClass('cms-modal-' + modal_mode + '-' + modal_slide);
            $(modal_open).addClass(modal_class);
            $(modal_open).css('--cms-modal-width', modal_width);
            $(modal_open).css('--cms-modal-content-space', modal_space);
            $(modal_open).css('--cms-modal-mousewheel-space', modal_space_top + modal_space_bot+'px');
            if (typeof modal_placeholder != 'undefined') {
                $(modal_open).find('.search-popup .cms-search-popup-input').attr('placeholder', modal_placeholder);
            }
            if (typeof close_text != 'undefined' && typeof close_text != '') {
                $(modal_open).find('.cms-close').prepend('<span class="close-text">' + close_text + '</span>');
            }
            if (typeof modal_hidden != 'undefined') {
                $(modal_open).find('.cms-close').attr('data-modal-hidden', modal_hidden);
            }
        });
        $('.cms-modal').on('click', function(e) {
            e.preventDefault();
            var modal_open = $(this).data('modal'),
                focus = $(this).data('focus'),
                modal_slide = $(this).data('modal-slide'),
                overlay_class = $(this).data('overlay-class'),
                modal_space_top = parseInt($(modal_open).find('.cms-modal-content').css('padding-top')),
                modal_space_bot = parseInt($(modal_open).find('.cms-modal-content').css('padding-bottom')),
                modal_hidden = $(this).data('modal-hidden');
            $(this).toggleClass('open');
            $(modal_open).toggleClass('open');
            $(modal_open).css('--cms-modal-mousewheel-space', modal_space_top + modal_space_bot +'px');
            if (typeof focus != 'undefined') {
                setTimeout(function() {
                    $(focus).focus();
                }, 300);
            }
            //
            $('html').toggleClass('cms-modal-opened');
            $('body').find('.cms-modal-overlay').addClass(overlay_class);
            $('body').find('.cms-modal-overlay').toggleClass('open');
            $('body').find('.cms-modal-overlay').attr('data-modal-hidden', modal_hidden);
            $(modal_hidden).css({ 'opacity': '0', 'visibility': 'hidden' });
        });
        $('.cms-close').on('click', function(e) {
            e.preventDefault();
            var modal_hidden = $(this).data('modal-hidden');
            $('html').removeClass('cms-modal-opened');
            $(this).parents('.cms-modal-html').removeClass('open');
            $(this).parents('body').find('.cms-modal.open').removeClass('open');
            $(this).parents('body').find('.cms-modal-overlay.open').removeClass('open');
            // get back
            $(modal_hidden).css({ 'opacity': '', 'visibility': '' });
        });
        $('.cms-modal-overlay').on('click', function(e) {
            e.preventDefault();
            var modal_hidden = $(this).data('modal-hidden');
            $(this).removeClass('open');
            $('html').removeClass('cms-modal-opened');
            $(this).parent().find('.cms-modal.open').removeClass('open');
            $(this).parent().find('.cms-modal-html.open').removeClass('open');
            // get back
            $(modal_hidden).css({ 'opacity': '', 'visibility': '' });
        });
    }
    /**
     * Dropdown Mega Menu
     * Full Width
    **/
    function trevox_dropdown_mega_menu_full_width(){
        'use strict';
        var parentPos     = $('.cms-primary-menu'),
            window_width = $(window).width();
        parentPos.find('.megamenu').each(function () {
            var megamenu      = $(this).find('> .cms-megamenu-full');
            if(megamenu.length == 1 && $(this).offset().left != 'undefined'){
                var megamenuPos    = $(this).offset().left;
                if(window_width > 1279){
                    if(trevox_is_rtl()){
                        megamenu.css({'right': megamenuPos, 'left':'auto'});
                    } else {
                        megamenu.css({'left':megamenuPos*-1, 'right':'auto'});
                    }
                } else {
                    megamenu.css({'left':'', 'right':''});
                }
            }
            // Mega menu container
            var megamenu_container      = $(this).find('> .cms-megamenu-container');
            if(megamenu_container.length == 1 && $(this).offset().left != 'undefined'){
                var megamenu_container_w = megamenu_container.outerWidth(),
                    menuoffset    = megamenu_container.offset().left,
                    megamenuPos = (menuoffset + megamenu_container_w - window_width)/-1;
                  
                if ( (menuoffset + megamenu_container_w) > window_width) {
                    if(trevox_is_rtl()){
                        megamenu_container.css({'right': megamenuPos, 'left':'auto'});
                    } else {
                        megamenu_container.css({'left':megamenuPos, 'right':'auto'});
                    }
                } else {
                    megamenu_container.css({'left':'', 'right':''});
                }
            }
        });
    }
    /**
     * Dropdown Touched Side
     * */
    function trevox_dropdown_touched_side(){
        setTimeout(function() {
            $('.cms-touchedside').each(function(){
                var content = $(this).find('.cms--touchedside'),
                    content_w = content.outerWidth(),
                    window_width = $(window).width(),
                    offsetLeft = $(this).offset().left,
                    offsetRight = window_width - offsetLeft - $(this).outerWidth();
                    content.removeClass('back');
                    $(this).attr('data-offset',offsetLeft);
                    $(this).attr('data-w',content_w);
                    $(this).attr('data-ww',window_width);
                if(content.length == 1){
                    if(trevox_is_rtl()){
                        if(offsetRight + content_w > window_width){
                            var position = offsetRight + content_w - window_width;
                            content.css({'right': '0', 'left':'auto'});
                            content.addClass('back');
                        } else {
                            content.css({'left':'', 'right':''});
                            content.removeClass('back');
                        }
                    } else {
                        if(offsetLeft + content_w > window_width){
                            var position = offsetLeft + content_w - window_width;
                            //content.css({'left': position*-1, 'right':'auto'});
                            content.css({'left': 'auto', 'right':'0'});
                            content.addClass('back');
                        } else {
                            content.css({'left': '0', 'right':'auto'});
                            content.removeClass('back');
                        }
                    }
                }
            });
        }, 1000);
    }
    /*
     * Lazy Images
     */
    function trevox_lazy_images() {
        'use strict';
        setTimeout(function() {
            $('.cms-lazy').each(function() {
                $(this).removeClass('lazy-loading').addClass('cms-lazy-loaded');
            });
        }, 100);
    }
    /**
     * Check right to left
    */
    function trevox_is_rtl(){
        "use strict"; 
        var rtl = $('html[dir="rtl"]'),
            is_rtl = rtl.length ? true : false;
        return is_rtl;
    }
    /**
     * Header WooCommerce Cart Dropdown
     * */
    function trevox_header_cart_dropdown(){
        "use strict";
        var header_cart = $('.site-header-cart'),
            header_cart_content = $('.cms-header-cart-dropdown');

        if(header_cart_content.length == 1){
            $(window).on( 'scroll', function() {
                header_cart_content.removeClass('open');
            });
            header_cart.on('click touch', function() {
                //$(this).toggleClass('active');
                //header_cart_content.toggleClass('open');
            });
            header_cart.on('click', function(e){
                //e.preventDefault();
                $(this).toggleClass('open');
                header_cart_content.toggleClass("open");
            });
            $('body').on('click', function(){
                //header_cart.removeClass('open');
                //header_cart_content.removeClass('open');
            });
        }
    }
    /**
     * WooCommerce 
     * Select 2 form product order form
     * */
    function trevox_select2(){
        'use strict';
        if (typeof jQuery.fn.select2 != 'undefined') {
            $('.woocommerce-ordering select').select2({
                theme : 'cms-dropdown',
                minimumResultsForSearch : -1
            });
        } else {
            $('.woocommerce-ordering select').addClass('no-select2');
        }
    }
    /*
     * WooCommerce Quantity action
     */
    function trevox_quantity_plus_minus_action() {
        "use strict";
        $(document).on('click', '.quantity .cms-qty-act', function() {
            var $this = $(this),
                spinner = $this.parents('.quantity'),
                input = spinner.find('input.qty'),
                step = input.attr('step'),
                min = input.attr('min'),
                max = input.attr('max'),
                value = parseInt(input.val());
            if (!value) value = 0;
            if (!step) step = 1;
            step = parseInt(step);
            if (!min) min = 0;
            var type = $this.hasClass('cms-qty-up') ? 'up' : 'down';
            switch (type) {
                case 'up':
                    if (!(max && value >= max))
                        input.val(value + step).change();
                    break;
                case 'down':
                    if (value > min)
                        input.val(value - step).change();
                    break;
            }
            if (max && (parseInt(input.val()) > max))
                input.val(max).change();
            if (parseInt(input.val()) < min)
                input.val(min).change();
        });
    }
    /**
     * WooCommerce Product Gallery
     * Flex direction Nav position
     * 
     * */
    function trevox_single_product_gallery_arrows(){
        'use strict';
        // fix arrow position
        if(typeof $.flexslider != 'undefined'){
            setTimeout(function() {
                $('.woocommerce-product-gallery').each(function (){
                var flex_viewport = $(this).find('.flex-viewport'),
                flex_viewport_h = flex_viewport.outerHeight(),
                arrow_pos = (flex_viewport_h/2),
                arrow = $(this).find('.flex-direction-nav li');
                arrow.css('top', arrow_pos);
            }), 1000});
        }
    }
    /**
     * WooCommerce
     * Place Order Button
     * Wrap text by Span
     * */
    function trevox_woo_checkout_place_order_button(){
        'use strict';
        setTimeout(function() {
            $('#place_order').wrapInner('<span class="cms-place-order"></span>');
        }, 1000);
    }
    /**
     * WooCommerce Currency Switcher
     * 
     * Add currency to menu
     * **/
    function trevox_woocs_menu_change_currency(){
        'use strict';
         $('.cms-woocs').on('click' , function (e) {
            e.preventDefault();
            var currency = $(this).data('currency');
            window.location.href = location.protocol + '//' + location.host + location.pathname + '?currency=' + currency;
         });
    }
    // Contact form 7
    function trevox_wpcf7(){
        'use strict';
        // add radio class active for default item
        $('.wpcf7-radio').each(function(){
            $('input[checked="checked"]').parents('.wpcf7-list-item').addClass('active');
        });
        // add radio class active on click
        $('.wpcf7-radio .wpcf7-list-item').on('click', function(){
            $(this).parent().find('.wpcf7-list-item').removeClass('active');
            $(this).toggleClass('active');
        });
        // add checkbox class active
        $('.wpcf7-checkbox .wpcf7-list-item').on('click', function(){
            $(this).toggleClass('active');
        });
        // date time
        $('.wpcf7-form-control-wrap.cms-date-time').on('click', function() {
            $(this).addClass('active');
        });
    }
    // ELementor
    $( window ).on( 'elementor/frontend/init', function() {
        // Hover add/remove class active
        var WidgetCMSHoverAddRemoveClasses = function( $scope, $ ) {
            $scope.find(".cms-hover-active").on('hover', function(e){
                e.preventDefault();
                var parent = $(this).parents(".elementor-widget-container");
                // hide all
                parent.find(".cms-hover-active").removeClass('active');
                // Show current
                $(this).addClass("active");
            });
            //$scope.find(".cms-bg-parallax").stellar();
        };
        elementorFrontend.hooks.addAction( 'frontend/element_ready/global', WidgetCMSHoverAddRemoveClasses);
    } );
})(jQuery);

// Animate on Scroll
(function( $ ) {
    "use strict";
    window.trevox_requestAnimFrame = function() {
        return (
            window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ) {
                window.setTimeout( callback, 1000 / 60 );
            }
        );
    }();
    window.trevox_floating_image_loop = function() {
        var win_w = window.innerWidth;
        var win_h = window.innerHeight;
        $( '.cms_floating_image_image' ).each(function() {
            //var elem = $(this).find('.cms_floating_image_image');
            var bounds = this.getBoundingClientRect();
            if ( bounds.top < win_h && bounds.bottom > 0 ) {
                var speed = $(this).attr( 'data-speed' ) / 10;
                //var speed = elem.attr( 'data-speed' ) / 10;
                var ypos = ( bounds.top - win_h/5 ) * speed;
               // elem.css( 'transform', 'translateY(' + ypos + 'px)' );
                $(this).css( 'transform', 'translateY(' + ypos + 'px)' );
            }

        });
        window.trevox_floating_image_lock = false;
    }
    
    window.trevox_floating_image_lock = false;
    
    $( window ).on( 'scroll', function() {
        if ( ! window.trevox_floating_image_lock ) {
            window.trevox_floating_image_lock = true;
            trevox_requestAnimFrame( trevox_floating_image_loop );
        }
    });
    
    trevox_requestAnimFrame( trevox_floating_image_loop );

    $( window ).on( "load", function() {  
        trevox_requestAnimFrame( trevox_floating_image_loop );
    });
})( jQuery );
/**
 * WPC Smart Wishlist
 * update wishlist count on header 
*/
jQuery( document ).on( 'woosw_change_count', function( event, count ) {
    jQuery('.wishlist-count').html(count);
    jQuery('.wishlist-icon').attr('data-count',count);
} );
/**
 * WPC Smart Wishlist
 * update custom icon
*/
jQuery('.cms-woosw-btn:not(.woosw-added)').on('click', function(){
    jQuery(this).find('.cms-woosw-btn-icon').addClass(cms_woosw_vars.icon_loadding).removeClass(cms_woosw_vars.icon_normal);
});
jQuery( document ).on( 'woosw_add', function( event, id ) {
    jQuery('.woosw-btn-'+id).find('.cms-woosw-btn-icon').addClass(cms_woosw_vars.icon_loadding).removeClass(cms_woosw_vars.icon_normal);
    if(jQuery('.woosw-btn-'+id).hasClass('woosw-added')){
        jQuery('.woosw-btn-'+id).find('.cms-woosw-btn-icon').addClass(cms_woosw_vars.icon_added).removeClass(cms_woosw_vars.icon_loadding).removeClass(cms_woosw_vars.icon_normal);
    }
} );
jQuery( document ).on( 'woosw_remove', function( event, product_id ) {
    if(jQuery('.woosw-btn-'+product_id).not('.woosw-added')){
        jQuery('.woosw-btn-'+product_id).find('.cms-woosw-btn-icon').addClass(cms_woosw_vars.icon_normal).removeClass(cms_woosw_vars.icon_added);
    }
});

/**
 * WPC Smart Compare
 * update compare count on header 
*/
jQuery( document ).on( 'woosc_change_count', function( event, count ) {
    jQuery('.compare-count').html(count);
    jQuery('.compare-icon').attr('data-count',count);
} );

/**
 * Popup Newsletter
 * 
 * */
(function ( $ ) {
    'use strict';
    window.Core                = {};
    Core.body         = $( 'body' );
    Core.html         = $( 'html' );
    Core.windowWidth  = $( window ).width();
    Core.windowHeight = $( window ).height();
    Core.scroll       = 0;
    $( window ).on(
        'load',
        function () {
            SubscribeModal.init();
        }
    );

    var SubscribeModal = {
        init: function () {
            this.holder = $( '#cms-subscribe-popup' );

            if ( this.holder.length ) {
                var $preventHolder = this.holder.find( '.cms-sp-prevent-inner' ),
                    $modalClose    = $( '.cms-sp-close' ),
                    disabledPopup  = 'no';

                if ( $preventHolder.length ) {
                    var isLocalStorage = this.holder.hasClass( 'cms-sp-prevent-cookies' ),
                        $preventInput  = $preventHolder.find( '.cms-sp-prevent-input' );

                    if ( isLocalStorage ) {
                        disabledPopup = localStorage.getItem( 'disabledPopup' );
                        sessionStorage.removeItem( 'disabledPopup' );
                    } else {
                        disabledPopup = sessionStorage.getItem( 'disabledPopup' );
                        localStorage.removeItem( 'disabledPopup' );
                    }

                    $preventHolder.children().on(
                        'click',
                        function ( e ) {
                            $preventInput.val(this.checked);

                            if ( $preventInput.attr('value') === 'true' ) {
                                if ( isLocalStorage ) {
                                    localStorage.setItem( 'disabledPopup', 'yes' );
                                } else {
                                    sessionStorage.setItem( 'disabledPopup', 'yes' );
                                }
                            } else {
                                if ( isLocalStorage ) {
                                    localStorage.setItem( 'disabledPopup', 'no' );
                                } else {
                                    sessionStorage.setItem( 'disabledPopup', 'no' );
                                }
                            }
                        }
                    );
                }

                if ( disabledPopup !== 'yes' ) {
                    if ( Core.body.hasClass( 'cms-sp-opened' ) ) {
                        SubscribeModal.handleClassAndScroll( 'remove' );
                    } else {
                        SubscribeModal.handleClassAndScroll( 'add' );
                    }

                    $modalClose.on(
                        'click',
                        function ( e ) {
                            e.preventDefault();

                            SubscribeModal.handleClassAndScroll( 'remove' );
                        }
                    );

                    // Close on escape
                    $( document ).keyup(
                        function ( e ) {
                            if ( e.keyCode === 27 ) { // KeyCode for ESC button is 27
                                SubscribeModal.handleClassAndScroll( 'remove' );
                            }
                        }
                    );
                }
            }
        },

        handleClassAndScroll: function ( option ) {
            if ( option === 'remove' ) {
                Core.body.removeClass( 'cms-sp-opened' );
            }

            if ( option === 'add' ) {
                Core.body.addClass( 'cms-sp-opened' );
            }
        },
    };

})( jQuery );