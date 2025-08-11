// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Definition of the Menu class
 *
 * @author Vlad Patryshev (vpatryshev@google.com)
 */
goog.require('goog.ui.NestedMenu');

/**
 * TODO: write the doc.
 *
 * @param {Element} element A DOM element for the popup.
 * @param (Function) opt_action function, takes an event as the parameter.
 * @constructor
 */
function Menu(element, opt_action) {
  goog.ui.NestedMenu.call(this, element, opt_action);
  this.setPinnedCorner(goog.ui.Popup.Corner.TOP_LEFT);
};

Menu.inherits(goog.ui.NestedMenu);

Menu.fontSize = '80%'
Menu.backgroundColor = '#e0ecff';
Menu.selectedColor = '#c3d9ff';
Menu.itemStyle =
    'height:1.5em;line-height:1.5em;vertical-align:middle;margin:2px 2px 2px 2px;font-size:' +
    Menu.fontSize + ';';

Menu.buildMenuItem_ = function(id, text, opt_image) {
  var result = '<tr class="menu-item" style="' + Menu.itemStyle +
         '" id="' + id +
         '" border="0"><td align="left" border="0">&nbsp;&nbsp;' +
         text + '&nbsp;&nbsp;</td>';
  if (opt_image) {
    result += '<td align="right" border="0">&nbsp;&nbsp;<img border="0" src="' +
         opt_image + '"/></td>';
  }
  return result + '</tr>';
}


Menu.buildTopMenuItem_ = function(id, text, imagesDir) {
  return this.buildMenuItem_(id, text, imagesDir + 'triangle.gif');
};


Menu.buildSeparator_ = function() {
  return '<tr><td colspan="2"><hr style="margin:0px 0px 0px 0px"/></td></tr>';
};


Menu.setMenuStyle_ = function(layer) {
  layer.style.position = 'absolute';
  layer.style.backgroundColor = Menu.backgroundColor;
  layer.style.color = 'black';
  layer.style.visibility = 'hidden';
  layer.style.fontSize = Menu.fontSize;
  layer.style.cursor = 'default';
  layer.style.zIndex = 100;
};



Menu.makeLayer_ = function(id, opt_items) {
  var layer = document.createElement("div");
  Menu.setMenuStyle_(layer);
  layer.style.zIndex = 20100;
  layer.setAttribute('id', id);
  layer.className = 'menu';
  document.body.appendChild(layer);
  if (opt_items) {
    layer.innerHTML =
        '<table border="0" ' +
        'style="border-collapse:collapse" cellpadding="0" cellspacing="0">' +
        opt_items.join('') + '</table>';
  }
  return layer;
};


Menu.prototype.setSelectedItem = function(elt) {
  var old = this.getSelectedItem();
  if (old) {
    old.style.backgroundColor = Menu.backgroundColor;
  }
  if (elt) {
    elt.style.backgroundColor = Menu.selectedColor;
  }
  goog.ui.NestedMenu.prototype.setSelectedItem.call(this, elt);
};
