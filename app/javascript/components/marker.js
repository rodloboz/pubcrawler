import dynamics from 'dynamics.js';

export class CustomMarker {
  constructor(options) {
    this.setValues(options)
  }
}

CustomMarker.prototype = new google.maps.OverlayView();

CustomMarker.prototype.onAdd = function() {
  var self = this;
    var div = this.div;
    if (!div) {
        div = this.div = $('' +
            '<div>' +
            '<div class="shadow"></div>' +
            '<div class="pulse"></div>' +
            '<div class="pin-wrap">' +
            '<div class="pin"></div>' +
            '</div>' +
            '</div>' +
            '')[0];
        this.pinWrap = this.div.getElementsByClassName('pin-wrap');
        this.pin = this.div.getElementsByClassName('pin');
        this.pinShadow = this.div.getElementsByClassName('shadow');
        div.style.position = 'absolute';
        div.style.cursor = 'pointer';
        var panes = this.getPanes();
        panes.overlayImage.appendChild(div);
        this.animateDrop();
        google.maps.event.addDomListener(div, "click", function(event) {
            google.maps.event.trigger(self, "click", event);
        });
    }
}

CustomMarker.prototype.draw = function() {
    var self = this;
    var point = this.getProjection().fromLatLngToDivPixel(this.position);
    var div = this.div;
    if (point) {
        div.style.left = point.x + 'px';
        div.style.top = point.y + 'px';
    }
};

CustomMarker.prototype.animateDrop = function() {
    dynamics.stop(this.pinWrap);
    dynamics.css(this.pinWrap, {
        'transform': 'scaleY(2) translateY(-'+$('#map').outerHeight()+'px)',
        'opacity': '1',
    });
    dynamics.animate(this.pinWrap, {
        translateY: 0,
        scaleY: 1.0,
    }, {
        type: dynamics.gravity,
        duration: 1800,
    });

    dynamics.stop(this.pin);
    dynamics.css(this.pin, {
        'transform': 'none',
    });
    dynamics.animate(this.pin, {
        scaleY: 0.8
    }, {
        type: dynamics.bounce,
        duration: 1800,
        bounciness: 600,
    })

    dynamics.stop(this.pinShadow);
    dynamics.css(this.pinShadow, {
        'transform': 'scale(0,0)',
    });
    dynamics.animate(this.pinShadow, {
        scale: 1,
    }, {
        type: dynamics.gravity,
        duration: 1800,
    });
}

CustomMarker.prototype.animateBounce = function() {
    dynamics.stop(this.pinWrap);
    dynamics.css(this.pinWrap, {
        'transform': 'none',
    });
    dynamics.animate(this.pinWrap, {
        translateY: -30
    }, {
        type: dynamics.forceWithGravity,
        bounciness: 0,
        duration: 500,
        delay: 150,
    });

    dynamics.stop(this.pin);
    dynamics.css(this.pin, {
        'transform': 'none',
    });
    dynamics.animate(this.pin, {
        scaleY: 0.8
    }, {
        type: dynamics.bounce,
        duration: 800,
        bounciness: 0,
    });
    dynamics.animate(this.pin, {
        scaleY: 0.8
    }, {
        type: dynamics.bounce,
        duration: 800,
        bounciness: 600,
        delay: 650,
    });

    dynamics.stop(this.pinShadow);
    dynamics.css(this.pinShadow, {
        'transform': 'none',
    });
    dynamics.animate(this.pinShadow, {
        scale: 0.6,
    }, {
        type: dynamics.forceWithGravity,
        bounciness: 0,
        duration: 500,
        delay: 150,
    });
}

CustomMarker.prototype.animateWobble = function() {
    dynamics.stop(this.pinWrap);
    dynamics.css(this.pinWrap, {
        'transform': 'none',
    });
    dynamics.animate(this.pinWrap, {
        rotateZ: -45,
    }, {
        type: dynamics.bounce,
        duration: 1800,
    });

    dynamics.stop(this.pin);
    dynamics.css(this.pin, {
        'transform': 'none',
    });
    dynamics.animate(this.pin, {
        scaleX: 0.8
    }, {
        type: dynamics.bounce,
        duration: 800,
        bounciness: 1800,
    });
}

