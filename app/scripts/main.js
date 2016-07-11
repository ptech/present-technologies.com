/* global $:false, Foundation:false, jsPlumb:false, Waypoint:false */
(function(window, document) {
  'use strict';

  // Start Foundation
  $(document).foundation();

  // Work with the DOM
  $(document).ready(function() {
    $('a[rel*="external"]').attr('target', '_blank');

    $('#responsive-menu a').on('click', function() {
      $('[data-responsive-toggle]').foundation('toggleMenu');
    });

    $('.maps').on('click', function() {
      $('.maps iframe').css('pointer-events', 'auto');
    });

    $('.maps').on('mouseleave', function() {
      $('.maps iframe').css('pointer-events', 'none');
    });

    setTimeout(function() {
      initAnimations();
    });
  });

  // Initialize jsPlumb
  jsPlumb.ready(function() {
    setTimeout(function() {
      initJsPlumb(Foundation.MediaQuery.current === 'small');
    });
  });

  // Foundation events watchers
  $('#main').on('resizeme.zf.trigger', function() {
    setTimeout(function() {
      jsPlumb.repaintEverything();
    }, 10);
  });
  $(window).on('changed.zf.mediaquery', function(event, newSize, oldSize) { // eslint-disable-line no-unused-vars
    // setTimeout(function() {
    jsPlumb.reset();
    initJsPlumb(newSize === 'small');
    // });
  });


  // ///////////////// //
  // Private Functions //
  // ///////////////// //

  /*
   * Animate.css
   */
  function initAnimations() {
    if (Foundation.MediaQuery.atLeast('medium')) {
      $('.animated').each(function() {
        var inview = new Waypoint.Inview({ // eslint-disable-line no-unused-vars
          element: this,
          enter: function(direction) { // eslint-disable-line no-unused-vars
            var el = $(this.element);
            var animation = el.data('animation');
            var delay = el.data('animation-delay') || 0;
            setTimeout(function() {
              el.addClass(animation);
              el.addClass('showing');
              el.removeClass('hiding');
            }, delay);
          },
          offset: 60
        });
      });
    } else {
      $('.animated').each(function() {
        $(this).removeClass('hiding');
      });
    }
  }

  /*
   * jsPlumb
   */
  function initJsPlumb(mobile) {
    // Styles
    var endpointStyle = { fillStyle: 'none' };
    var connectorStyle = { lineWidth: 1, strokeStyle: 'white', dashstyle: '4' };

    // Endpoints
    var needEndpoint1 = jsPlumb.addEndpoint('need', {
      anchor: 'Left',
      isSource: true,
      paintStyle: endpointStyle
    });
    var needEndpoint2 = jsPlumb.addEndpoint('need', {
      anchor: 'Right',
      isSource: true,
      paintStyle: endpointStyle
    });

    var solutionEndpoint;
    var teamEndpoint;
    if (mobile) {
      solutionEndpoint = jsPlumb.addEndpoint('solution-small', {
        anchor: 'Top',
        isTarget: true,
        paintStyle: endpointStyle
      });
      teamEndpoint = jsPlumb.addEndpoint('team-small', {
        anchor: 'Top',
        isTarget: true,
        paintStyle: endpointStyle
      });
    } else {
      solutionEndpoint = jsPlumb.addEndpoint('solution-medium', {
        anchor: 'TopRight',
        isTarget: true,
        paintStyle: endpointStyle
      });
      teamEndpoint = jsPlumb.addEndpoint('team-medium', {
        anchor: 'TopLeft',
        isTarget: true,
        paintStyle: endpointStyle
      });
    }

    // Connector Types
    var straightConnectorType = ['Straight', { stub: 0, gap: 0 }];

    // Connectors
    jsPlumb.connect({
      source: needEndpoint1,
      target: solutionEndpoint,
      connector: straightConnectorType,
      paintStyle: connectorStyle,
      overlays: [
        ['Arrow', { width: 10, length: 10, location: 1, id: 'solutionArrow' }]
      ]
    });
    jsPlumb.connect({
      source: needEndpoint2,
      target: teamEndpoint,
      connector: straightConnectorType,
      paintStyle: connectorStyle,
      overlays: [
        ['Arrow', { width: 10, length: 10, location: 1, id: 'teamArrow' }]
      ]
    });
  }
})(window, document);
