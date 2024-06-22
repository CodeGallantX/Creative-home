(function($) {
    "use strict";

  //   $( window ).on( 'elementor/frontend/init', function() {
		// elementor.hooks.addAction( 'etc-custom-section-classes', function( settings ) {
		// 	settings.custom_section_classes = '312312312';
  //       	return settings;
		// } );
  //   } );

    var subMegamenu = $('.sub-megamenu');
    $.each(subMegamenu, function (index, megamenu) {
        megamenu = $(megamenu);
        if (megamenu.find('.menu .current-menu-item').length > 0) {
            megamenu.parents('.megamenu').addClass('current-menu-ancestor current-menu-parent');
        }
    });
}(jQuery));