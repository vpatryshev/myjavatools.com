function jstools(location) {
  var JSTOOLS_ID = "JSTOOLS_ID";
  var userAgent = navigator.userAgent.toLowerCase();
  var isIE = userAgent.indexOf('msie') != -1 &&
              userAgent.indexOf('opera') < 0;

  function _(var_args) {
    for (var i = 0; i < arguments.length; i++) {
      document.write(arguments[i]);
    }
  };

  function openElement(name, attributes) {
    _('<', name);
    for (var id in attributes) {
      _(' ', id, '="', attributes[id], '"');
    }
    _('>');
  }

  function closeElement(name) {
    _('</', name, '>');
  }

  function addParameters(parameters) {
    for (var name in parameters) {
      openElement('param', {name: name, value: parameters[name]});
    }
  }

  openElement('object',
    isIE ?
      {
        classid: "clsid:8AD9C840-044E-11D1-B3E9-00805F499D93",
        style: "border-width:0;",
        codebase: "http://java.sun.com/products/plugin/autodl/jinstall-1_4_1-windows-i586.cab#version=1,4,1",
        name: JSTOOLS_ID,
        id: JSTOOLS_ID
      } :
      {
        type: "application/x-java-applet;version=1.4.1",
        name: JSTOOLS_ID,
        id: JSTOOLS_ID
      });

  addParameters({
    archive: (location ? (location + '/') : '') + 'jstools.jar',
    code: "com.google.javascript.keyboard.JsTools",
    mayscript: "yes",
    scriptable: "true",
    name: "jsapplet"});

    closeElement('object');

  return {
    sleep: function sleep(n) {
             document[JSTOOLS_ID].sleep(n);
           }
  };
};
