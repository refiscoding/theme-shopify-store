window.slate = window.slate || {};
window.theme = window.theme || {};

/*================ Slate ================*/
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {

  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element.first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element.first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on('click', function(evt) {
      this.pageLinkFocus($(evt.currentTarget.hash));
    }.bind(this));
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).on(eventName, function(evt) {
      if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
        options.$container.focus();
      }
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  }
};

/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

slate.cart = {

  /**
   * Browser cookies are required to use the cart. This function checks if
   * cookies are enabled in the browser.
   */
  cookiesEnabled: function() {
    var cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled){
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }
    return cookieEnabled;
  }
};

/**
 * Utility helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions for dealing with arrays and objects
 *
 * @namespace utils
 */

slate.utils = {

  /**
   * Return an object from an array of objects that matches the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  findInstance: function(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
  },

  /**
   * Remove an object from an array of objects by matching the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  removeInstance: function(array, key, value) {
    var i = array.length;
    while(i--) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        break;
      }
    }

    return array;
  },

  /**
   * _.compact from lodash
   * Remove empty/false items from array
   * Source: https://github.com/lodash/lodash/blob/master/compact.js
   *
   * @param {array} array
   */
  compact: function(array) {
    var index = -1;
    var length = array == null ? 0 : array.length;
    var resIndex = 0;
    var result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  },

  /**
   * _.defaultTo from lodash
   * Checks `value` to determine whether a default value should be returned in
   * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
   * or `undefined`.
   * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
   *
   * @param {*} value - Value to check
   * @param {*} defaultValue - Default value
   * @returns {*} - Returns the resolved value
   */
  defaultTo: function(value, defaultValue) {
    return (value == null || value !== value) ? defaultValue : value
  }
};
/**
 * Rich Text Editor
 * -----------------------------------------------------------------------------
 * Wrap iframes and tables in div tags to force responsive/scrollable layout.
 *
 * @namespace rte
 */

slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable: function(options) {
    var tableWrapperClass = typeof options.tableWrapperClass === "undefined" ? '' : options.tableWrapperClass;

    options.$tables.wrap('<div class="' + tableWrapperClass + '"></div>');
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe: function(options) {
    var iframeWrapperClass = typeof options.iframeWrapperClass === "undefined" ? '' : options.iframeWrapperClass;

    options.$iframes.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="' + iframeWrapperClass + '"></div>');

      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

slate.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:section:reorder', this._onReorder.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

slate.Sections.prototype = $.extend({}, slate.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (typeof constructor === 'undefined') {
      return;
    }

    var instance = $.extend(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (!instance) {
      return;
    }

    if (typeof instance.onUnload === 'function') {
      instance.onUnload(evt);
    }

    this.instances = slate.utils.removeInstance(this.instances, 'id', evt.detail.sectionId);
  },

  _onSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onSelect === 'function') {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onDeselect === 'function') {
      instance.onDeselect(evt);
    }
  },

  _onReorder: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onReorder === 'function') {
      instance.onReorder(evt);
    }
  },

  _onBlockSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockSelect === 'function') {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockDeselect === 'function') {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(function(index, container) {
      this._createInstance(container, constructor);
    }.bind(this));
  }
});

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

slate.Currency = (function () {
  var moneyFormat = '${{amount}}';

  /**
   * Format money values based on your shop currency settings
   * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
   * or 3.00 dollars
   * @param  {String} format - shop money_format setting
   * @return {String} value - formatted value
   */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || moneyFormat);

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = slate.utils.defaultTo(precision, 2);
      thousands = slate.utils.defaultTo(thousands, ',');
      decimal = slate.utils.defaultTo(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? (decimal + parts[1]) : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

slate.Image = (function() {

  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    if (match) {
      return match[1];
    } else {
      return null;
    }
  }

  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    } else {
      return null;
    }
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist. Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {

  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on('change', this._onSelectChange.bind(this));
  }

  Variants.prototype = $.extend({}, Variants.prototype, {

    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function() {
      var currentOptions = $.map($(this.singleOptionSelector, this.$container), function(element) {
        var $element = $(element);
        var type = $element.attr('type');
        var currentOption = {};

        if (type === 'radio' || type === 'checkbox') {
          if ($element[0].checked) {
            currentOption.value = $element.val();
            currentOption.index = $element.data('index');

            return currentOption;
          } else {
            return false;
          }
        } else {
          currentOption.value = $element.val();
          currentOption.index = $element.data('index');

          return currentOption;
        }
      });

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = slate.utils.compact(currentOptions);

      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function() {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;
      var found = false;

      variants.forEach(function(variant) {
        var satisfied = true;

        selectedValues.forEach(function(option) {
          if (satisfied) {
            satisfied = (option.value === variant[option.index]);
          }
        });

        if (satisfied) {
          found = variant;
        }
      });

      return found || null;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function() {
      var variant = this._getVariantFromOptions();

      this.$container.trigger({
        type: 'variantChange',
        variant: variant
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function(variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
        return;
      }

      this.$container.trigger({
        type: 'variantImageChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function(variant) {
      if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
        return;
      }

      this.$container.trigger({
        type: 'variantPriceChange',
        variant: variant
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param {object} variant - Currently selected variant
     */
    _updateHistoryState: function(variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
      window.history.replaceState({path: newurl}, '', newurl);
    },

    /**
     * Update hidden master select of variant change
     *
     * @param {object} variant - Currently selected variant
     */
    _updateMasterSelect: function(variant) {
      $(this.originalSelectorId, this.$container)[0].value = variant.id;
    }
  });

  return Variants;
})();


/*================ Sections ================*/
/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
   * @namespace product
 */

theme.Product = (function() {

  var selectors = {
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    originalSelectorId: '[data-product-select]',
    priceWrapper: '[data-price-wrapper]',
    productFeaturedImage: '[data-product-featured-image]',
    productJson: '[data-product-json]',
    productPrice: '[data-product-price]',
    productThumbs: '[data-product-single-thumbnail]',
    singleOptionSelector: '[data-single-option-selector]',
    productQuantity:'[data-product-quantity]'
  };

  /**
   * Product section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Product(container) {
    this.$container = $(container);

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$(selectors.productJson, this.$container).html()) {
      return;
    }

    var sectionId = this.$container.attr('data-section-id');
    this.productSingleObject = JSON.parse($(selectors.productJson, this.$container).html());

    var options = {
      $container: this.$container,
      enableHistoryState: this.$container.data('enable-history-state') || false,
      singleOptionSelector: selectors.singleOptionSelector,
      originalSelectorId: selectors.originalSelectorId,
      product: this.productSingleObject
    };

    this.settings = {};
    this.namespace = '.product';
    this.variants = new slate.Variants(options);
    this.$featuredImage = $(selectors.productFeaturedImage, this.$container);

    this.$container.on('variantChange' + this.namespace, this.updateAddToCartState.bind(this));
    this.$container.on('variantPriceChange' + this.namespace, this.updateProductPrices.bind(this));

    if (this.$featuredImage.length > 0) {
      this.settings.imageSize = slate.Image.imageSize(this.$featuredImage.attr('src'));
      slate.Image.preload(this.productSingleObject.images, this.settings.imageSize);

      this.$container.on('variantImageChange' + this.namespace, this.updateProductImage.bind(this));
    }

    this.quantityChange(this);
    this.imagesCarousel(this);
    this.expandCollapseDescription(this);
  }

  Product.prototype = $.extend({}, Product.prototype, {

    /**
     * Updates the DOM state of the add to cart button
     *
     * @param {boolean} enabled - Decides whether cart is enabled or disabled
     * @param {string} text - Updates the text notification content of the cart
     */
    updateAddToCartState: function(evt) {
      var variant = evt.variant;

      if (variant) {
        $(selectors.priceWrapper, this.$container).removeClass('hide');
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.unavailable);
        $(selectors.priceWrapper, this.$container).addClass('hide');
        return;
      }

      if (variant.available) {
        $(selectors.addToCart, this.$container).prop('disabled', false);
        $(selectors.addToCartText, this.$container).html(theme.strings.addToCart);
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
      }
    },

    /**
     * Updates the DOM with specified prices
     *
     * @param {string} productPrice - The current price of the product
     * @param {string} comparePrice - The original price of the product
     */
    updateProductPrices: function(evt) {
      var variant = evt.variant;
      var $comparePrice = $(selectors.comparePrice, this.$container);
      var $compareEls = $comparePrice.add(selectors.comparePriceText, this.$container);

      $(selectors.productPrice, this.$container).html(slate.Currency.formatMoney(variant.price, theme.moneyFormat));

      if (variant.compare_at_price > variant.price) {
        $comparePrice.html(slate.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat));
        $compareEls.removeClass('hide');
      } else {
        $comparePrice.html('');
        $compareEls.addClass('hide');
      }
    },

    /**
     * Updates the DOM with the specified image URL
     *
     * @param {string} src - Image src URL
     */
    updateProductImage: function(evt) {
      var variant = evt.variant;
      var sizedImgUrl = slate.Image.getSizedImageUrl(variant.featured_image.src, this.settings.imageSize);

      this.$featuredImage.attr('src', sizedImgUrl);
    },

    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload: function() {
      this.$container.off(this.namespace);
    },

    quantityChange: function() {
      var input = $(selectors.productQuantity, this.$container);
      var buttonMinus = input.siblings('.minus');
      var buttonPlus = input.siblings('.plus');

      buttonMinus.on('click', function(event){
        var curVal = input.val();
        event.preventDefault();
        curVal > 1 ? input.attr("value", parseInt( curVal ) - 1 ) : 0;
      });
      buttonPlus.on('click', function(event){
        var curVal = input.val();
        event.preventDefault();
        input.attr("value", parseInt( curVal ) + 1 );
      });
    },

    imagesCarousel: function(){
      $('.product__image-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        dots: true,
        mobileFirst: true,
        responsive: [{
          breakpoint: 750,
          settings: {
            dots: false,
            asNavFor: '.product__image-slider-nav'
          }
        }]
      });
      $('.product__image-slider-nav').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        dots: false,
        focusOnSelect: true,
        infinite: false,
        arrows: false,
        asNavFor: '.product__image-slider'
      });
    },

    expandCollapseDescription: function(){
      var controller = $('.collapse-control');
      // slate.utils.collapseSection(targetElm);

      controller.on('click', function(e){
        e.preventDefault();
        var targetElm = $('.'+$(this).attr('collapse-target'));
        // var content = targetElm.find('product__description');
        console.log(targetElm);

        if (targetElm.hasClass('open')){
          targetElm.removeClass('open');
          $(this).text('Show More');
          // collapseSection(targetElm);
        }
        else{
          targetElm.addClass('open');
          $(this).text('Show Less');
          // expandSection(targetElm);
        }
      });
    },

    collapseSection: function(element){
      // get the height of the element's inner content, regardless of its actual size
      var sectionHeight = element.scrollHeight;

      // temporarily disable all css transitions
      var elementTransition = element.style.transition;
      element.style.transition = '';

      // on the next frame (as soon as the previous style change has taken effect),
      // explicitly set the element's height to its current pixel height, so we
      // aren't transitioning out of 'auto'
      requestAnimationFrame(function() {
        element.style.height = sectionHeight + 'px';
        element.style.transition = elementTransition;

        // on the next frame (as soon as the previous style change has taken effect),
        // have the element transition to height: 0
        requestAnimationFrame(function() {
          element.style.height = 200 + 'px';
        });
      });

      // mark the section as "currently collapsed"
      element.setAttribute('data-collapsed', 'true');
    },

    expandSection: function(element){
      // get the height of the element's inner content, regardless of its actual size
      var sectionHeight = element.scrollHeight;

      // have the element transition to the height of its inner content
      element.style.height = sectionHeight + 'px';

      // when the next css transition finishes (which should be the one we just triggered)
      element.addEventListener('transitionend', function(e) {
        // remove this event listener so it only gets triggered once
        element.removeEventListener('transitionend', arguments.callee);

        // remove "height" from the element's inline styles, so it can return to its initial value
        element.style.height = null;
      });

      // mark the section as "currently not collapsed"
      element.setAttribute('data-collapsed', 'false');
    }

  });

  return Product;
})();

var headerFunctions = {

    bt_menuOpen: $('.header__hamburger'),
    bt_menuClose: $('.header__menu-close'),
    bt_search: $('.header__search-button'),
    searchForm: $('.header__nav .header__search'),
    mainMenu: $('.header__main-menu'),

    openCloseMenu: function () {

        headerFunctions.bt_menuOpen.on('click', function () {
            headerFunctions.mainMenu.addClass('header__main-menu--open');
            $('body').css('position', 'fixed');
        });

        headerFunctions.bt_menuClose.on('click', function () {
            headerFunctions.mainMenu.removeClass('header__main-menu--open');
            $('body').css('position', 'static');
        });
    },

    openSearch: function () {

        headerFunctions.bt_search.on('click', function (e) {
            e.preventDefault();
            headerFunctions.searchForm.addClass('open');
            $(this).addClass('medium-up--hide');
        });
    }

}

headerFunctions.openCloseMenu();
headerFunctions.openSearch();
var collectionFunctions = {

    tabs: $('.collection-list-products__tabs h3'),
    container: $('.collections-container .collection-list'),

    tabsController: function(){
        collectionFunctions.hideContent( collectionFunctions.container );
        collectionFunctions.tabs.first().addClass('active');
        collectionFunctions.showContent( collectionFunctions.container.first() );
        collectionFunctions.makeSlick( collectionFunctions.container.first() );

        collectionFunctions.tabs.on('click', function(){

            var target = $(this).attr('data-target');
            var content = $("[data-collection-id='"+target+"']");
            $('.slick-slider').slick('unslick');

            if( $(this).hasClass('active') == false ){
                collectionFunctions.tabs.removeClass('active');
                $(this).addClass('active');
                collectionFunctions.hideContent( collectionFunctions.container );
                collectionFunctions.showContent( content );
                collectionFunctions.makeSlick( content );
            }
        });
    },

    makeSlick: function(element){
        element.slick({
            mobileFirst: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            responsive: [{
                breakpoint: 750,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    dots: false,
                    arrows: true
                }
            }]
        });
    },

    hideContent: function(element){
        element.addClass('small--hide medium-up--hide');
    },

    showContent: function(element){
        element.removeClass('small--hide medium-up--hide');
    }

}

collectionFunctions.tabsController();

/*================ Templates ================*/
/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

theme.customerAddresses = (function() {
  var $newAddressForm = $('#AddressNewForm');

  if (!$newAddressForm.length) {
    return;
  }

  // Initialize observers on address selectors, defined in shopify_common.js
  if (Shopify) {
    new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
      hideElement: 'AddressProvinceContainerNew'
    });
  }

  // Initialize each edit form's country/province selector
  $('.address-country-option').each(function() {
    var formId = $(this).data('form-id');
    var countrySelector = 'AddressCountry_' + formId;
    var provinceSelector = 'AddressProvince_' + formId;
    var containerSelector = 'AddressProvinceContainer_' + formId;

    new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
      hideElement: containerSelector
    });
  });

  // Toggle new/edit address forms
  $('.address-new-toggle').on('click', function() {
    $newAddressForm.toggleClass('hide');
  });

  $('.address-edit-toggle').on('click', function() {
    var formId = $(this).data('form-id');
    $('#EditAddress_' + formId).toggleClass('hide');
  });

  $('.address-delete').on('click', function() {
    var $el = $(this);
    var formId = $el.data('form-id');
    var confirmMessage = $el.data('confirm-message');
    if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
      Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
    }
  });
})();

/**
 * Password Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Password template.
 *
 * @namespace password
 */

theme.customerLogin = (function() {
  var config = {
    recoverPasswordForm: '#RecoverPassword',
    hideRecoverPasswordLink: '#HideRecoverPasswordLink'
  };

  if (!$(config.recoverPasswordForm).length) {
    return;
  }

  checkUrlHash();
  resetPasswordSuccess();

  $(config.recoverPasswordForm).on('click', onShowHidePasswordForm);
  $(config.hideRecoverPasswordLink).on('click', onShowHidePasswordForm);

  function onShowHidePasswordForm(evt) {
    evt.preventDefault();
    toggleRecoverPasswordForm();
  }

  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }
  }

  /**
   *  Show/Hide recover password form
   */
  function toggleRecoverPasswordForm() {
    $('#RecoverPasswordForm').toggleClass('hide');
    $('#CustomerLoginForm').toggleClass('hide');
  }

  /**
   *  Show reset password success message
   */
  function resetPasswordSuccess() {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess').removeClass('hide');
  }
})();

var cartFunctions = {

    buttonMinus: $('.template-cart .minus'),
    buttonPlus: $('.template-cart .plus'),

    quantityChange: function() {

        cartFunctions.buttonMinus.on('click', function(event){
            var input = $(this).siblings('input');
            var curVal = input.val();
            curVal > 1 ? input.attr("value", parseInt( curVal ) - 1 ) : event.preventDefault();
        });
        cartFunctions.buttonPlus.on('click', function(){
            var input = $(this).siblings('input');
            var curVal = input.val();
            input.attr("value", parseInt( curVal ) + 1 );
        });
    }
}
cartFunctions.quantityChange();
var collectionPageFunctions = {

  sort_by: function (param) {

    $('.sort-by__option').click(function (e) {
      Shopify.queryParams.sort_by = $(this).attr('data-value');
      location.search = $.param(Shopify.queryParams).replace(/\+/g, '%20');
    });

    $('.sort-by__option').each(function () {
      var data_value = $(this).attr('data-value');
      if (data_value == param) {
        $('.sort-by__option').removeClass('active');
        $(this).addClass('active');
        return false;
      }
    });
  },

  sort_by_menu: function () {
    $('.sort-by__indicator').click(function (e) {
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        $(this).parent('.sort-by').removeClass('active');
      } else {
        $(this).addClass('active');
        $(this).parent('.sort-by').addClass('active');
      }
    });
  },

  filters: function () {

    var filterToggle = $('.filters__indicator .btn, .filters__close');
    var filterContainer = $('.filters');
    var filterItem = $('.filters__item');

    filterToggle.on('click', function () {
      filterContainer.hasClass('active') ? filterContainer.removeClass('active') : filterContainer.addClass('active');
      filterContainer.hasClass('active') ? $('body').css('position', 'fixed') : $('body').css('position', 'static');
    });

    filterItem.on('click', function () {
      $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active');
    });

  }

}

Shopify.queryParams = {};
if (location.search.length) {
  for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
    aKeyValue = aCouples[i].split('=');
    if (aKeyValue.length > 1) {
      Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
      collectionPageFunctions.sort_by(aKeyValue[1]);
    }
  }
} else {
  var data_value = $('.sort-by__options').attr('data-value');
  collectionPageFunctions.sort_by(data_value);
}
collectionPageFunctions.sort_by_menu();
collectionPageFunctions.filters();

$(document).ready(function() {
  var sections = new slate.Sections();
  sections.register('product', theme.Product);

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  var tableSelectors = '.rte table';

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'rte__table-wrapper',
  });

  // Target iframes to make them responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }
});

// tabs
$('div.product-detail-content').hide();
$('.tab-stage div:first').show();
$('ul.product-banner-filter li:first').addClass('tab-active');

$('ul.product-banner-filter a').on('click', function(event){
  event.preventDefault();
  $('ul.product-banner-filter li').removeClass('tab-active');
  $(this).parent().addClass('tab-active');
  $('.tab-stage div.product-detail-content').hide();
  $($(this).attr('href')).show();
})

// product fixed bar
$(window).bind('scroll', function() {
  var infoHeight = $('.product-info-flex').height();
		if ($(window).scrollTop() < infoHeight ) {
			$('.product-fixed-bar').removeClass('fixed');
		 }
		else {
			$('.product-fixed-bar').addClass('fixed');
		 }
	});

//read more
$('.product-faq > .btn-second').on('click', function(){
    $('.product-faq').toggleClass('clicked');
  })


// Mobile menu
$('.mobile-menu').addClass('slideR');

$('#menu-btn').on("click", function(){
  $(this).toggleClass('blue');
  $('.mobile-menu').toggleClass('slideR');
});

// paypal button

$('.paypal-button-logo').append("<p>Check out with</p>");

// TagSort

$(function(){
  $('ul#tag-container > li.mac').addClass('device');
  $('ul#tag-container > li.pc').addClass('device');
  $('ul#tag-container > li.2011').addClass('year');
  $('ul#tag-container > li.2013').addClass('year');
  $('ul#tag-container > li.2016').addClass('year');
  $('ul#tag-container > li.2019').addClass('year');
  $('ul#tag-container > li.home.and.student').addClass('cat');
  $('ul#tag-container > li.home.and.business').addClass('cat');
  $('ul#tag-container > li.professional').addClass('cat');
  $('ul#tag-container > li.professional.plus').addClass('cat');
  $('ul#tag-container > li.visio').addClass('cat');
  $('ul#tag-container > li.project').addClass('cat');
  $('ul#tag-container > li.publisher').addClass('cat');
  $('ul#tag-container > li.outlook').addClass('cat');
  $('ul#tag-container > li.excel').addClass('cat');
  $('ul#tag-container > li.word').addClass('cat');
  $('ul#tag-container > li.access').addClass('cat');
  $('ul#tag-container > li.standard').addClass('cat');
  $('ul#tag-container > li.64.bit').addClass('cat');
  $('ul#tag-container > li.32.bit').addClass('cat');
  $('ul#tag-container > li.pro').addClass('cat');
  $('ul#tag-container > li.windows.10').addClass('cat');
  $('ul#tag-container > li.windows.7').addClass('cat');
  $('ul#tag-container > li.ultimate').addClass('cat');
  $('ul#tag-container > li.home.premium').addClass('cat');
  $('ul#tag-container > li.home').addClass('cat');
  $('ul#tag-container > li.enterprise').addClass('cat');
})

// accordion

$("#accordion > li > div.acc-item ").hide();

  $("#accordion > li > div").click(function () {
    $('.active').not(this).removeClass('active').next().hide(300);

    $(this).toggleClass('active');
                  if (false == $(this).next().is(':visible')) {
                    $('#accordion > ul').slideUp(300);
                  }
                  $(this).next().slideToggle(300);
                });

$("#menuItem > ul.menuUl").hide();

  $("#menuItem > li#menuItemli").click(function () {
    $('.active').not(this).removeClass('active').next().hide(300);

    $(this).toggleClass('active');
                  if (false == $(this).next().is(':visible')) {
                    $('#menuItem > li#menuItemli >ul#menuUl').slideUp(300);
                  }
                  $(this).next().slideToggle(300);
                });


$('.deals-collection').slick({
    mobileFirst: true,
    responsive: [
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          arrows: false
        }
      },
      {
        breakpoint: 1024,
        settings: "unslick"
      }
    ]
  });

$('.product-reviews-container').slick({
      mobileFirst: true,
      responsive: [
        {
          breakpoint: 320,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: true,
            arrows: false
          }
        },
        {
          breakpoint: 1024,
          settings: "unslick"
        }
      ]
});

$('.promo-banner-blocks').slick({
      mobileFirst: true,
      responsive: [
        {
          breakpoint: 320,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: true,
            arrows: false
          }
        },
        {
          breakpoint: 1024,
          settings: "unslick"
        }
      ]
});

$(".banner-windows11 h2").click(function() {
    $('html, body').animate({
        scrollTop: $(".bg-comparison").offset().top -200
    }, 1000);
});

$('.slider-text').slick({
        mobileFirst: true,
      dots: false,
      arrows: true,
      slidesToShow: 1,
      centerMode: false,
      adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: "unslick"
            },
            {
                breakpoint: 1199,
                settings: {
                    infinite: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: '0',
                }
            },
            {
                breakpoint: 768,
                settings: {
                    infinite: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: '0',
                }
            }
        ]
});
$('.slider-news-office').slick({
        mobileFirst: true,
        dots: true,
        arrows: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: "unslick"
            }
        ]
});

$('.compare-windows-page-10-products-slider').slick({
        mobileFirst: true,
        dots: false,
        arrows: true,
        slidesToShow: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: "unslick"
            },
            {
                breakpoint: 1199,
                settings: {
                    infinite: true,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    infinite: true,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
});
    
$(document).ready(function(){

  $(".table-mobile .tabs-list li a").click(function(e){
     e.preventDefault();
  });

  $(".table-mobile .tabs-list li").click(function(){
     var tabid = $(this).find("a").attr("href");
     $(".table-mobile .tabs-list li,.tabs div.tab").removeClass("active");   // removing active class from tab

     $(".table-mobile .tab").hide();   // hiding open tab
     $(tabid).show();    // show tab
     $(this).addClass("active"); //  adding active class to clicked tab

  });

});
$(window).on('scroll', function() {
  var currentScrollTop = $(this).scrollTop()
  if (currentScrollTop >= $(window).scrollTop() && $(this).scrollTop() > 380) {
    $('.take-quiz').addClass('show-quiz');
  } else {
    $('.take-quiz').removeClass('show-quiz');
  }
});
    $(".close-quiz").on("click", function(){
      $('.take-quiz').removeClass('show-quiz');
    });
// tagSort

!function(e){e.fn.tagSort=function(t){var s={items:".item-tagsort",tagElement:"span",tagClassPrefix:!1,itemTagsView:!1,itemTagsSeperator:" ",itemTagsElement:!1,sortType:"exclusive",fadeTime:0,reset:!1};t=e.extend(s,t);var i={generateTags:function(s){var a={},n={pointers:[],tags:[]},o=e(document.createElement(t.tagElement));return s.each(function(s){$element=e(this);var r=$element.data("item-tags"),c=r.match(/,\s+/)?r.split(", "):r.split(",");e.each(c,function(n,r){var c=r.toLowerCase();a[c]||(a[c]=[],i.container.append(t.tagClassPrefix!==!1?o.clone().text(r).addClass((t.tagClassPrefix+r.toLowerCase()).replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g,"")):o.clone().text(r))),t.itemTagsView!==!1&&(t.itemTagsElement!==!1?$element.find(t.itemTagsView).append(e(document.createElement(t.itemTagsElement)).clone().text(r)):$element.find(t.itemTagsView).append(n>0?t.itemTagsSeperator+r:r)),a[c].push(s)}),"exclusive"==t.sortType&&(n.pointers.push(s),n.tags.push(c))}),"inclusive"==t.sortType||"single"==t.sortType?a:"exclusive"==t.sortType?n:void 0},exclusiveSort:function(t){var s=[[],[]];return e.each(t.pointers,function(a,n){var o=!0;i.container.find(".tagsort-active").each(function(i){-1==t.tags[a].indexOf(e(this).text())&&(o=!1,s[0].push(n))}),1==o&&s[1].push(n)}),s},inclusiveSort:function(t,s){var a=[s,[]];return i.container.find(".tagsort-active").each(function(s){e.each(t[e(this).text().toLowerCase()],function(e,t){a[0].splice(a[0].indexOf(t),1),a[1].push(t)})}),a},showElements:function(s,i){e.each(s,function(e,s){i.eq(s).fadeIn(t.fadeTime)})},hideElements:function(s,i){e.each(s,function(e,s){i.eq(s).fadeOut(t.fadeTime)})},inititalize:function(s){i.container=s;for(var a,n=e(t.items),o=[],r=t.reset,c=0;c<n.length;c++)o.push(c);i.tags=i.generateTags(n,i.container);var l=i.container.find(t.tagElement);l.click(function(){"single"==t.sortType?e(this).hasClass("tagsort-active")?e(this).toggleClass("tagsort-active"):(e(".tagsort-active").removeClass("tagsort-active"),e(this).toggleClass("tagsort-active"),a=i.inclusiveSort(i.tags,o.slice())):(e(this).toggleClass("tagsort-active"),a="inclusive"==t.sortType?i.inclusiveSort(i.tags,o.slice()):i.exclusiveSort(i.tags)),l.hasClass("tagsort-active")||(a=[[],o.slice()]),a[0].length>0&&i.hideElements(a[0],n),a[1].length>0&&i.showElements(a[1],n)}),r&&e(r).click(function(){e(".tagsort-active").removeClass("tagsort-active"),a=[[],o.slice()],i.showElements(a[1],n)})}};return i.inititalize(this),e(this)}}(jQuery);


$('ul#tag-container').tagSort({
  items: '.collection-product',
  tagElement: 'li',
  tagClassPrefix: '',
  itemTagsView: false,
  itemTagsSeperator: ' ',
  itemTagsElement: false,
  sortType: 'exclusive',
  fadeTime: 0,
  reset: true,
  sortAlphabetical: true
  });


