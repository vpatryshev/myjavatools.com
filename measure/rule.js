/* This javascript draws two draggable rules on the client window,
 *  one horizontal, and one vertical.
 *  Author: Vlad Patryshev
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */

function Rule(layer) {
  this.layer = layer;
  var self = this;
  this.drag = false;
  this.markX = -1;
  this.markY = -1;

  this.layer.onmousedown = function() {
    self.drag = true;
    return false;
  }

  this.layer.onclick = function(event) {
    if (!event) {
      event = window.event;
    }
    self.markX = event.clientX;
    self.markY = event.clientY;
    window.status = self.markX + "," + self.markY;
  }
}

Rule.prototype.dragme = function(event) {
  if (this.drag) {
    this.moveTo(event.clientX, event.clientY);
  }
}

Rule.prototype.setHeight= function(h) {
}

var hrule = null;
var vrule = null;

function Rule_layout(debug) {
  if (hrule == null) {
    var wh = window.innerHeight ? window.innerHeight : document.body.clientHeight;
    var ww = window.innerWidth  ? window.innerWidth  : document.body.clientWidth;

    document.write('<div id="hrule" style="border-color:#006699;border:none;cursor:move;position:absolute; ' +
                   'top:' + (wh / 2) +
                   ';left:-100; height:10; z-index:999; overflow: clip"></div>');

    document.write('<div id="vrule" style="border-color:#006699;border:none;cursor:move;position:absolute; ' +
                   'left:' + (ww / 2) +
                   '; top:-100; width:10; z-index:999; overflow: clip"></div>');
  }

  hrule = new Rule(document.getElementById("hrule"));

  hrule.redraw = function() {
    var w = 200 + (window.innerWidth ? window.innerWidth  : document.body.clientWidth);

    if (document.layers) {
      this.layer.clip.width = w;
    } else {
      this.layer.style.width = w + "px";
    }

    var code = '';
    for (var x = 0; x < w - 100; x += 100) {
      code += '<img src="h10.gif"/>';
    }
    this.layer.innerHTML = code;
  }

  hrule.moveTo = function(x, y) {
    this.layer.style.left = (x + 100) % 100 - 100;
    this.layer.style.top  = y;
  }

  vrule = new Rule(document.getElementById("vrule"));

  vrule.redraw = function() {
    var h = 200 + (window.innerHeight ? window.innerHeight : document.body.clientHeight);

    if (document.layers) {
      this.layer.clip.height = h;
    } else {
      this.layer.style.height = h + "px";
    }
    this.setHeight(h + 100);
    var code = '';
    for (var y = 0; y < h; y += 100) {
      code += '<img src="v10.gif"/>';
    }
    this.layer.innerHTML = code;
  }

  vrule.moveTo = function(x, y) {
    this.layer.style.left = x;
    this.layer.style.top = (y + 100) % 100 - 100;
  }

  window.onresize = function() {
    hrule.redraw();
    vrule.redraw();
  };

  hrule.redraw();
  vrule.redraw();

  document.onmouseup = function() {
    hrule.drag = false;
    vrule.drag = false;
  }

  document.onmousemove = function(event) {
    if (!event) {
      event = window.event;
    }
    hrule.dragme(event);
    vrule.dragme(event);
    return false;
  }
}

Rule_layout(true);
