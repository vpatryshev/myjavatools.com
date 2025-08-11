// Copyright 2005 Google, Inc.
// All Rights Reserved.
//
// msego@google.com
// Altered by davem@google.com to allow custom menus
//
// Simple menu interface for choosing a color, font face, or font size. The
// implementation was extracted from Caribou.

//////////////////////// CONSTANTS /////////////////////////

Menu.COLOR = 0;
Menu.FONT = 1;
Menu.SIZE = 2;

// COLOR MENU CONSTANTS

Menu.COLOR_PALETTE_ID_PREFIX = "menu_cp_";

Menu.COLOR_DEFAULT = "000000";

Menu.COLORS = [
  // blacks
  ["ffffff", "cccccc", "c0c0c0", "999999", "666666", "333333", "000000"], 
  // reds
  ["ffcccc", "ff6666", "ff0000", "cc0000", "990000", "660000", "330000"], 
  // oranges
  ["ffcc99", "ff9966", "ff9900", "ff6600", "cc6600", "993300", "663300"], 
  // yellows
  ["ffff99", "ffff66", "ffcc66", "ffcc33", "cc9933", "996633", "663333"], 
  // olives
  ["ffffcc", "ffff33", "ffff00", "ffcc00", "999900", "666600", "333300"], 
  // greens
  ["99ff99", "66ff99", "33ff33", "33cc00", "009900", "006600", "003300"], 
  // turquoises
  ["99ffff", "33ffff", "66cccc", "00cccc", "339999", "336666", "003333"], 
  // blues
  ["ccffff", "66ffff", "33ccff", "3366ff", "3333ff", "000099", "000066"], 
  // purples
  ["ccccff", "9999ff", "6666cc", "6633ff", "6600cc", "333399", "330099"], 
  // violets
  ["ffccff", "ff99ff", "cc66cc", "cc33cc", "993399", "663366", "330033"] 
];

// FONT MENU CONTSTANTS

Menu.FONT_DEFAULT = 'fontname-default';
Menu.FONT_NORMAL = 'Normal';

Menu.FONTS=[
  ["fontname-times","times new roman,serif","Times New Roman"],
  ["fontname-arial","arial,sans-serif","Arial"],
  ["fontname-courier","courier new,monospace","Courier New"],
  ["fontname-georgia","georgia","Georgia"],
  ["fontname-trebuchet","trebuchet ms","Trebuchet"],
  ["fontname-verdana","verdana","Verdana"]
];

Menu.FONT_MENU_ITEMS = [
  Menu.FONT_DEFAULT,
  Menu.FONTS[0][0],
  Menu.FONTS[1][0],
  Menu.FONTS[2][0],
  Menu.FONTS[3][0],
  Menu.FONTS[4][0],
  Menu.FONTS[5][0]
];

Menu.FONT_VALUE_MAP= {
  "fontname-default":"arial,sans-serif",
  "fontname-times":"times new roman,serif",
  "fontname-arial":"arial,sans-serif",
  "fontname-courier":"courier new,monospace",
  "fontname-georgia":"georgia",
  "fontname-trebuchet":"trebuchet ms",
  "fontname-verdana":"verdana"
};

// SIZE MENU CONSTANTS

Menu.SIZE_MENU_ITEMS = [
  'fontsize-small', 'fontsize-normal', 'fontsize-large', 'fontsize-huge'
];

Menu.SIZE_DEFAULT = Menu.SIZE_MENU_ITEMS[1];

Menu.SIZE_HUGE = 'Huge';
Menu.SIZE_LARGE = 'Large';
Menu.SIZE_NORMAL = 'Normal';
Menu.SIZE_SMALL = 'Small';

// Maps a SIZE Menu item (by id) to a useful value (the actual font size)
Menu.SIZE_VALUE_MAP = {
  'fontsize-huge':6,
  'fontsize-large':4,
  'fontsize-normal':2,
  'fontsize-small':1
};

// Maps a SIZE Menu item (by id) to the html used to display that item
Menu.SIZE_OPTION_HTML_MAP = {
  'fontsize-huge':'<font size=' + Menu.SIZE_VALUE_MAP['fontsize-huge'] +
    ' style="' + Menu.MENU_CHILD_STYLE + '" unselectable=on>' +
     Menu.SIZE_HUGE + '</font>',
  'fontsize-large':'<font size=' + Menu.SIZE_VALUE_MAP['fontsize-large'] +
    ' style="' + Menu.MENU_CHILD_STYLE + '" unselectable=on>' +
     Menu.SIZE_LARGE + '</font>',
  'fontsize-normal':'<font size=' + Menu.SIZE_VALUE_MAP['fontsize-normal'] +
    ' style=' + Menu.MENU_CHILD_STYLE + ' unselectable=on>' +
    Menu.SIZE_NORMAL + '</font>',
  'fontsize-small':'<font size=' + Menu.SIZE_VALUE_MAP['fontsize-small'] +
    ' style=' + Menu.MENU_CHILD_STYLE + ' unselectable=on>' +
    Menu.SIZE_SMALL + '</font>'
};

// SHARED CONSTANTS

Menu.MENU_ID = ["menu_color_", "menu_font_", "menu_size_"];
Menu.DEFAULT_VALUE = [Menu.COLOR_DEFAULT,
                      Menu.FONT_DEFAULT,
                      Menu.SIZE_DEFAULT];

// Styles for both FONT Menu and SIZE Menu
Menu.MENU_STYLE = 
  "font-family:arial;text-decoration:none;display:block;" +
  "padding:2 9 2 4;color:#000;";
Menu.MENU_CHILD_STYLE = "vertical-align:middle";

// Colors for menu options on both FONT Menu and SIZE Menu
Menu.UNHIGHLIGHT_BACK = "#c3d9ff";
Menu.UNHIGHLIGHT_FORE = "#000";
Menu.HIGHLIGHT_BACK = "#5570cc";
Menu.HIGHLIGHT_FORE = "#fff";

// An internal minimum for custom menus
Menu.CUSTOM_MINIMUM = 100;

// How many custom menus have we handed out so far?
Menu.customCount = 0;

// The array to store the custom menus that we have handed out
Menu.custom = new Array();


//////////////////////// PUBLIC METHODS /////////////////////////

/**
 * Instantiates a menu object
 *
 * @param windowObject Browser window that contains the menu.
 * @param onClickFn Function that gets called when a user picks a menu item
 *   it is assumed to be in the form func(id, opt_param)
 * @param menutype The type of menu to create
 *
 * @constructor
 */
function Menu(windowObject, onClickFn, menutype) {
  this.win = windowObject;
  this.onClickFn = onClickFn;
  this.menutype = menutype;
  this.div_id = Menu.MENU_ID[menutype];
  this.selected = Menu.DEFAULT_VALUE[menutype];
}

/**
 * Create a custom menu
 * @param menuOptions an array of strings for the user visible text
     in the form [id1, user visible string1, ...]
 * @return an int which can be used in place of Menu.COLOR for menu type
 */
Menu.addCustom = function(menuOptions) {
  var custom = Menu.customCount;
  Menu.customCount++;
  Menu.custom[custom] = menuOptions;
  return custom + Menu.CUSTOM_MINIMUM;
}

/**
 * Alter a custom menu
 * @param customId the id of a custom menu, previously obtained from addCustom
 * @param menuOptions an array of strings for the user visible text
 */
Menu.alterCustom = function(customId, menuOptions) {
  Menu.custom[customId - Menu.CUSTOM_MINIMUM] = menuOptions;
}

/**
 * Appends the menu to the appropriate document body and absolutely 
 * positions it. If the font menu is already open, this will reposition it.
 * 
 * @param x The x coordinate of the menu, in pixels, measured from the top-left
 * @param y The y coordinate of the menu, in pixels, measured from the top-left
 * @param param to pass back with the user clicks [optional]
 */
Menu.prototype.open = function(x, y, param) {
  var isInit = false; // An optimization - We only need to refresh some
                      // contents when we are first initializing the menu
  var menudiv = this.win.document.getElementById(this.div_id);

  if (menudiv == null) {
    isInit = true;
    menudiv = this.win.document.createElement("div");

    menudiv.id = this.div_id;

    Menu.setStyling_(menudiv, this.menutype);

    this.win.document.body.appendChild(menudiv);    
  }
  this.param = param;
  this.refreshContents_(menudiv, isInit);
  menudiv.style.left = x + "px";
  menudiv.style.top = y + "px";
  menudiv.style.display = "block";
};

/**
 * Closes the font menu by setting its display style to "none", or does nothing
 * if the menu element does not exist or is already not displayed.
 */
Menu.prototype.close = function() { 
  var menudiv = this.win.document.getElementById(this.div_id);

  if (menudiv != null) {
    menudiv.style.display = "none";
  }  
};

/**
 * Returns true if the menu is currently opened.
 */
Menu.prototype.isOpen = function() {
  var menudiv = this.win.document.getElementById(this.div_id);
  return menudiv && menudiv.style.display == "block";
}

/**
 * The user wants the menu hidden right now
 * TODO(bolinfest) - does anyone use this?
 * @return boolean saying if it is now closed
 */
Menu.prototype.deactivate = function(e) {
  if (this.isOpen()) {
    var p = GetMousePosition(e);
    if (nodeBounds(forid(this.div_id)).contains(p)) {
      return false; // user clicked on popup, remain visible
    } else {
      this.close();
      return true; // clicked outside popup, make invisible
    }
  } else {
    return true; // already deactivated, not visible
  }
}

/**
* Gets a pointer to the highest level html elment in the menu.
*
* @return The DOM element for this menu.
*/
Menu.prototype.getContainer = function() {
  return this.win.document.getElementById(this.div_id);
};

/**
 * Sets the selected menu item. Sets it to the default value for the menu
 * if the param is not one of the items selectable on this type of menu.
 */
Menu.prototype.setSelected = function(value) {
  var menuitems = Menu.getMenuItems_(this.menutype);

  for (var i = 0; i < menuitems.length; i++) {
    if (value == Menu.getValueFromId_(menuitems[i], this.menutype)) {
      this.selected = menuitems[i];
      return;
    }
  }

  this.selected = Menu.DEFAULT_VALUE[this.menutype];
};

/**
 * Gets the actual html font settings value that is selected in this menu. 
 * For example, passing in "fontsize-huge" will return "6", the actual size.
 * 
 * @return A String that can be used in HTML for setting the color, size, or
 *   font face.
 */
Menu.prototype.getSelectedValue = function() {
  return Menu.getValueFromId_(this.selected, this.menutype);
}


//////////////////////// PRIVATE METHODS /////////////////////////

/**
 * Adds the html for this menu, as well as add the mouse callback funcitons.
 * 
 * @param menudiv The DOM element for this menu
 * @param (boolean) isInit True if this is the firs time we are trying to open
 *   this menu.
 * 
 * @private
 */
Menu.prototype.refreshContents_ = function(menudiv, isInit) {
  if (isInit || this.menutype != Menu.COLOR) {
    var xx =
    menudiv.innerHTML = "<table cellspacing=0 cellpadding=0 unselectable=on>" +
      Menu.getMenuHtml_(this.menutype, this.selected) + "</table>";
      this.addCallbackFns_(menudiv);
  }
};    

/**
 * Adds mouse callback functions to the menu. The mouse movement functions
 * change the appearance of menu options as the user mouses over them.
 * 
 * @param menudiv The DOM element for this menu
 * 
 * @private
 */
Menu.prototype.addCallbackFns_ = function(menudiv) {
  if (this.menutype == Menu.COLOR) {
    for (var i = 0; i < Menu.COLORS.length; i++) {
      for (var j = 0; j < Menu.COLORS[i].length; j++) {
        var id = Menu.COLOR_PALETTE_ID_PREFIX + 
          Menu.COLORS[i][j];
        var elem = this.win.document.getElementById(id);
        
        elem.onmouseover =
          Menu.color_getMouseMovementCallback_(this, id, "white");
        elem.onmouseout =
          Menu.color_getMouseMovementCallback_(this, id, "#bbb");
        elem.onclick =
          Menu.color_getOnClickCallback_(this, id);
      }
    }
  } else {
    var menuitems = Menu.getMenuItems_(this.menutype);
    
    for (var i = 0; i < menuitems.length; i++) {
      var id = menuitems[i];
      
      var tablerows = menudiv.firstChild.rows;
      tablerows[i].onmouseover = 
        Menu.getHighlightCallback_(this, id, Menu.HIGHLIGHT_FORE, 
                                   Menu.HIGHLIGHT_BACK);
      tablerows[i].onmouseout = 
        Menu.getHighlightCallback_(this, id, Menu.UNHIGHLIGHT_FORE, 
                                   Menu.UNHIGHLIGHT_BACK);
      tablerows[i].onclick = 
        Menu.getOnClickCallback_(this, id);
    }
  }
};

/**
 * Helper function that returns the the ids of all the items on a menu.
 * 
 * @param menutype An int representing the type of menu
 * 
 * @private
 */
Menu.getMenuItems_ = function(menutype) {
  if (menutype == Menu.COLOR) {
    var arr = new Array();

    for (var i = 0; i < Menu.COLORS.length; i++) {
      for (var j = 0; j < Menu.COLORS[i].length; j++) {
        arr.push(Menu.COLORS[i][j]);
      }
    }

    return arr;
  }
  else if (menutype == Menu.FONT) {
    return Menu.FONT_MENU_ITEMS;
  } else if (menutype == Menu.SIZE) {
    return Menu.SIZE_MENU_ITEMS;
  } else if (menutype >= Menu.CUSTOM_MINIMUM) {
    var customArray = Menu.custom[menutype-Menu.CUSTOM_MINIMUM];
    var ids = new Array();
    var j = 0;
    for(var i = 0; i < customArray.length; i += 2) {
      ids[j++] = customArray[i];
    }
    return ids;
  }
};

/**
 * Sets the style of the menu element. Note: Menu.SIZE and Menu.FONT have the
 * same styling
 * 
 * @param menudiv The DOM element for this menu
 * @param menutype An int representing the type of menu
 * 
 * @private
 */
Menu.setStyling_ = function(menudiv, menutype) {
  if (menutype == Menu.COLOR) {
    menudiv.style.background = "#bbb";
    menudiv.style.padding = "2px";
  } else {    
    menudiv.style.cursor = "pointer";
    menudiv.style.border = "2px solid";
    menudiv.style.borderColor = "#e8f1ff #9daecd #9daecd #e8f1ff";
    menudiv.style.padding = "2";
    menudiv.style.background = "#c3d9ff";
    menudiv.style.zIndex = "2";
  }
  menudiv.style.MozUserSelect = "none";
  menudiv.unselectable = "on";
  menudiv.style.position = "absolute";
};

/**
 * Returns the html to display for the menu.
 * 
 * @param menutype An int representing the type of menu
 * @param selected The id of the element that is selected
 * 
 * @private
 */
Menu.getMenuHtml_ = function(menutype, selected) {
  if (menutype == Menu.COLOR) {
    return Menu.color_getMenuHtml_();
  } 
  if (menutype == Menu.FONT) {
    return Menu.formatMenu_(Menu.FONT_MENU_ITEMS,
                            Menu.font_getOptionsHtmlMap_(), selected);
  }
  if (menutype == Menu.SIZE) {
    return Menu.formatMenu_(Menu.SIZE_MENU_ITEMS,
                            Menu.SIZE_OPTION_HTML_MAP, selected);
  }  
  else if (menutype >= Menu.CUSTOM_MINIMUM) {
    return Menu.formatMenu_(Menu.getMenuItems_(menutype),
                            Menu.custom_getOptionsHtmlMap_(
                             menutype - Menu.CUSTOM_MINIMUM), -1);
  }
};

/**
 * Shared code used to format the html of the SIZE and FONT menus.
 * 
 * @param menuitems An array of the ids of the items on this menu
 * @param option_html_map A mapping from ids to html
 * @param selected The id of the element that is selected
 * 
 * @private
 */
Menu.formatMenu_ = function(menuitems, option_html_map, selected) {
  var html = "";
  
  for (var i = 0; i < menuitems.length; i++) {
    var option_id = menuitems[i];
    var option_html = option_html_map[option_id];

    var selected_html = selected == option_id ? '<b>&rsaquo;</b>' : '&nbsp;';

    html += '<tr unselectable=on><td id="' + option_id + '" unselectable=on >' 
            + selected_html + '&nbsp;' + option_html + '</td>' + '</tr>';
  }
  
  return html;
};

/**
 * Returns a callback function to highlight or unhighlight elements of the
 * SIZE or FONT menus when the user mouses over them.
 * 
 * @param menu The Menu object to create this callback for
 * @param id The id of the menu element to create this callback for
 * @param forecolor The color to change the text to
 * @param backcolor The color to change the background to
 * 
 * @return A function that is applied to the onmouseover and onmouseout 
 *   properties of the menu elements.
 * 
 * @private
 */
Menu.getHighlightCallback_ = function(menu, id, forecolor, backcolor) {
  return function() {
    Menu.highlightOption_(menu.win, id, forecolor, backcolor);
  }
};

/**
 * Returns a function to call when clicking on a menu element.
 * 
 * @param menu The Menu object to create this callback for
 * @param id The id of the menu element to create this callback for
 * 
 * @return A function that is applied to the onclick property of the menu
 *   elements.
 * 
 * @private
 */
Menu.getOnClickCallback_ = function(menu, id)  {
  return function() {
    menu.close();
    menu.selected = id;
    Menu.highlightOption_(menu.win, id, Menu.UNHIGHLIGHT_FORE, 
                          Menu.UNHIGHLIGHT_BACK);
    menu.onClickFn(Menu.getValueFromId_(id, menu.menutype), menu.param);
  }
};

/**
 * Simple helper function to set the text color and background of a DOM element
 * with the given id.
 * 
 * @param win Browser window that contains the element
 * @param id The id of the DOM element
 * @param highlight_color_fore The color to change the text to
 * @param highlight_color_back The color to change the background to
 * 
 * @private
 */
Menu.highlightOption_ = function(win, id, highlight_color_fore,
                                         highlight_color_back) {  
  Menu.setCssStyle_(win, id, "color", highlight_color_fore);
  Menu.setCssStyle_(win, id, "background", highlight_color_back);
};

/**
 * Sets a CSS style of an element
 *  
 * @private
 */
Menu.setCssStyle_ = function (win, id, name, value) {
  var elem = win.document.getElementById(id);
  
  // To support blank menu items, we allow this to fail
  if (elem) {
    elem.style[name] = value;
  }
};

/**
 * A helper function for getting the actual usable value from a menu
 * element id.
 * 
 * @param id The id of the menu element
 * @param menutype An int representing the type of menu
 *  
 * @private
 */
Menu.getValueFromId_ = function(id, menutype) {
  if (menutype == Menu.COLOR) {
    return "#" + id;
  }
  if (menutype == Menu.FONT) {
    return Menu.font_getValueMap_()[id];
  }
  if (menutype == Menu.SIZE) {
    return Menu.SIZE_VALUE_MAP[id];
  }
  
  if (menutype >= Menu.CUSTOM_MINIMUM) {
    // In the case of a custom menu, the usable value is the ID
    return id;
  }
};

// COLOR_MENU PRIVATE METHODS

/**
 * Returns the html for the color menu, including the color palette
 *  
 * @private
 */
Menu.color_getMenuHtml_ = function() {
  var html = ["<table cellspacing=0 cellpadding=0 style='background:#bbb'>"];
  for (var i = 0; i < Menu.COLORS.length; i++) {
    html[html.length] = "<tr>";
    for (var j = 0; j < Menu.COLORS[i].length; j++) {
      html[html.length] = "<td id=" + Menu.COLOR_PALETTE_ID_PREFIX +
        Menu.COLORS[i][j] + " bgcolor=#" + 
        Menu.COLORS[i][j] + 
        " unselectable=on style='width:15px;height:15px;padding:0px;" +
        "margin:0px;border:1px solid #bbb;'><img width=1 height=1></td>";
    }
  }
  html[html.length] = "</table>";

  return html.join("");  
};

/**
 * Returns a function to call when mousing over the elements of the 
 * color palette
 *  
 * @private
 */
Menu.color_getMouseMovementCallback_ = function(menu, id, color) {
  return function() {
    Menu.color_setCellBorder_(menu.win, id, color);
  }
};

/**
 * Returns a function to call when clicking on elements of the color palette
 *  
 * @private
 */
Menu.color_getOnClickCallback_ = function(menu, id)  {
  return function() {
    menu.close();
    menu.selected = "#" + id.substr(Menu.COLOR_PALETTE_ID_PREFIX.length);
    Menu.color_setCellBorder_(menu.win, id, "#bbb");
    menu.onClickFn(menu.selected, menu.param);
  }
};

/**
 * Sets the border color of an element
 * 
 * @private
 */
Menu.color_setCellBorder_ = function(win, id, color) {  
  Menu.setCssStyle_(win, id, "borderColor", color);
};

// FONT_NAME_MENU PRIVATE METHODS

/**
 * Returns the mapping from id to html for the font menu elements
 *  
 * @private
 */
Menu.font_getOptionsHtmlMap_ = function() {
  var map = new Object();

  map[Menu.FONT_DEFAULT] = Menu.FONT_NORMAL;

  for (var i = 0; i < Menu.FONTS.length; ++i) {
    var font = Menu.FONTS[i];
    map[font[0]] = '<font face="' + font[1] + '" class=' + 
                   Menu.MENU_CHILD_STYLE + ' unselectable=on >' + 
                   font[2] + '</font>';
  }
  return map;
};


/**
 * Returns the mapping from id to html for custom menu elements
 *  
 * @private
 */
Menu.custom_getOptionsHtmlMap_ = function(menutype) {
  var map = new Object();

  for (var i = 0; i < Menu.custom[menutype].length; i += 2) {
    var item = Menu.custom[menutype][i];
    map[item] = Menu.custom[menutype][i+1];
  }
  return map;
};

/**
 * Returns the mapping from id to value for the font menu elements
 *  
 * @private
 */
Menu.font_getValueMap_ = function() {
  var map = new Object();

  map[Menu.FONT_DEFAULT] = Menu.FONTS[1][1];

  for (var i = 0; i < Menu.FONTS.length; i++) {
    map[Menu.FONTS[i][0]] = Menu.FONTS[i][1];
  }

  return map;
};
