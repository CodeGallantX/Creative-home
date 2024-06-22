( function( $ ) {
    /**
     * Galleries Load more
     * @param $scope The Widget wrapper element as a jQuery element
     * @param $ The jQuery alias
     */
    var WidgetCMSGalleriesHandler = function( $scope, $ ) {
        var galleries = $scope.find(".cms-egallery"),
            data_show = galleries.data('show'),
            data_load = galleries.data('loadmore');
            galleries.find(".cms-gallery-item").slice(0, data_show).show();
            galleries.find('.cms-gallery-load').on('click',  function(e) { // click event for load more
                e.preventDefault();
                galleries.find(".cms-gallery-item:hidden").slice(0, data_load).show(300); // select next 10 hidden divs and show them
                if (galleries.find(".cms-gallery-item:hidden").length == 0) { // check if any hidden divs still exist
                  $(this).hide();
                  $(this).parent().hide();
                }
            });
    };

    // Make sure you run this code under Elementor.
    $( window ).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/cms_gallery.default', WidgetCMSGalleriesHandler );
    } );
} )( jQuery );