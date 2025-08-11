// Copyright 2005 Google Inc.
// All Rights Reserved.
//
// msamuel@google.com

// functions for dealing with layout and geometry of page elements.
// Requires shapes.js

/** returns the bounding box of the given DOM node in document space.
  *
  * @param obj a DOM node.
  * @return a Rect instance.
  */
function nodeBounds(obj) {
  var refWindow;
  if (obj.ownerDocument && obj.ownerDocument.parentWindow) {
    refWindow = obj.ownerDocument.parentWindow;
  } else {
    refWindow = window;
  }

  // Mozilla
  if (obj.ownerDocument && obj.ownerDocument.getBoxObjectFor) {
    var box = obj.ownerDocument.getBoxObjectFor(obj);
    return new Rect(box.x, box.y, box.width, box.height, refWindow);
  }

  // IE
  if (obj.getBoundingClientRect) {
    var rect = obj.getBoundingClientRect();

    return new Rect(rect.left + GetScrollLeft(refWindow),
                    rect.top + GetScrollTop(refWindow),
                    rect.right - rect.left,
                    rect.bottom - rect.top,
                    refWindow);
  }

  // Fallback to recursively computing this
  var left = 0;
  var top = 0;
  for (var o = obj; o.offsetParent; o = o.offsetParent) {
    left += o.offsetLeft;
    top += o.offsetTop;
  }
  return new Rect(left, top, obj.offsetWidth, obj.offsetHeight, refWindow);
}

/** returns the coordinates of the top-left of the given DOM node in document
  * space.
  *
  * @param obj a DOM node.
  * @return a Point instance.
  */
function nodeLoc(obj) {
  var bounds = nodeBounds(obj);

  return new Point(bounds.x, bounds.y, bounds.coordinateFrame);
}

/** the bounding rect of the content of a node in the window's coordinate frame
  *
  * @param element {HTMLElement} non null.
  * @return {Rect}
  */
function geom_innerBounds(element /* : HTMLElement*/) {
  var x, y;
  if (element.ownerDocument && element.ownerDocument.getBoxObjectFor) {
    var box = element.ownerDocument.getBoxObjectFor(element);
    x = box.x;
    y = box.y;
    for (var el = element; el; el = el.offsetParent){
      x -= el.scrollLeft;
      y -= el.scrollTop;
    }
  } else {
    x = element.offsetWidth - element.clientWidth;
    y = element.offsetHeight - element.clientHeight;
    for (var el = element; el; el = el.offsetParent){
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
    }
    // x and y seem to be off by 1.  why?
  }
  return new Rect(x, y, element.clientWidth, element.clientHeight, window);
}

/** the bounding rect of the content of a node in the window's coordinate frame
  *
  * @param element {HTMLElement} non null.
  * @return {Point}
  */
function geom_innerLoc(element /* : HTMLElement*/) {
  var x, y;
  if (element.ownerDocument && element.ownerDocument.getBoxObjectFor) {
    var box = element.ownerDocument.getBoxObjectFor(element);
    x = box.x;
    y = box.y;
    for (var el = element; el; el = el.offsetParent){
      x -= el.scrollLeft;
      y -= el.scrollTop;
    }
  } else {
    x = element.offsetWidth - element.clientWidth;
    y = element.offsetHeight - element.clientHeight;
    for (var el = element; el; el = el.offsetParent){
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
    }
    // x and y seem to be off by 1.  why?
  }
  return new Point(x, y, window);
}

/** Returns the distance between p1 and p2 as a float */
function Distance(/*Point or Rect*/ p1, /*Point or Rect*/ p2) {
  AssertTrue(p1, "p1 passed to Distance is undefined");
  AssertTrue(p2, "p2 passed to Distance is undefined");
  AssertTrue(p1.coordinateFrame == p2.coordinateFrame);
  var dx = p1.x - p2.x;
  var dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function GetMousePosition(e) {
  // copied from http://www.quirksmode.org/js/events_compinfo.html
  var posx = 0;
  var posy = 0;
  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    var obj = (e.target ? e.target : e.srcElement);
    var refWindow;
    if (obj.ownerDocument && obj.ownerDocument.parentWindow) {
      refWindow = obj.ownerDocument.parentWindow;
    } else {
      refWindow = window;
    }
    posx = e.clientX + GetScrollLeft(refWindow);
    posy = e.clientY + GetScrollTop(refWindow);
  }
  return new Point(posx, posy, window);
}
