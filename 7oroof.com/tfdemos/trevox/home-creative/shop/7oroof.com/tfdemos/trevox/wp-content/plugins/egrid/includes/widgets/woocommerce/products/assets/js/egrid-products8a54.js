(function($) {
    /**
     * @param $scope The Widget wrapper element as a jQuery element
     * @param $ The jQuery alias
     */
    var WidgetEGridProductsHandler = function($scope, $) {
        var element_id = $scope.data('id');

        $scope.on('open-loader', function() {
            $scope.find('.egrid-products-wrapper').addClass('loading');
        });

        $scope.on('close-loader', function() {
            $scope.find('.egrid-products-wrapper').removeClass('loading');
        });

        $scope.on('load', function() {
            var filters = $scope.data('filters') || {};
            var orderby = $scope.data('orderby') || '';
            var order = $scope.data('order') || '';
            var page = $scope.data('page') || 1;
            var columns = $scope.data('columns') || '';
            var loadmore = $scope.data('loadmore') || false;
            if (page == 1) {
                loadmore = false;
            }

            $.ajax({
                url: egrid_products.ajax_url,
                type: 'POST',
                beforeSend: function() {
                    $scope.trigger('open-loader');
                },
                data: {
                    action: 'egrid_products',
                    element_id: element_id,
                    post_id: egrid_products.post_id,
                    page: page,
                    orderby: orderby,
                    order: order,
                    columns: columns,
                    loadmore: loadmore,
                    filters: JSON.stringify(filters),
                }
            }).done(function(res) {
                if (res.success) {
                    var $newScope = $(res.data);
                    if (loadmore == true) {
                        $scope.find('[egrid-products-loadmore]').data('current-page', page);
                        $scope.find('.egrid-products-content .products').append($newScope.find('.products').html());
                    } else {
                        $newScope.data('filters', filters);
                        $newScope.data('orderby', orderby);
                        $newScope.data('order', order);
                        $newScope.data('columns', columns);
                        $scope.replaceWith($newScope);
                        $('html,body').animate({ scrollTop: $newScope.offset().top - 100 }, 750);
                    }
                    if ( typeof wc_add_to_cart_variation_params !== 'undefined' ) {
                        $( '.variations_form' ).each( function() {
                            $( this ).wc_variation_form();
                        });
                    }
                    elementorFrontend.elementsHandler.runReadyTrigger($newScope);
                } else {
                    console.log(res.message);
                }
            }).fail(function(res) {
                console.log(res);
            }).always(function() {
                $scope.trigger('close-loader');
            });
        });
    };

    // Make sure you run this code under Elementor.
    $(window).on('elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction('frontend/element_ready/egrid-products.default', WidgetEGridProductsHandler);
    });
})(jQuery);