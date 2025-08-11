KBD_loadme({
  id:'FI,FI:Finnish:suomalainen n\u00e4pp\u00e4imist\u00f6',
  tooltip: 'Finnish keyboard',
  msgOpen: 'p\u00e4\u00e4lle',
  msgClose: 'pois',
  
  mappings: {
    'sl': {
      '': '\u00bd!\"#\u00a4%&/()=?`' +
          'QWERTYUIOP\u00c5^*' +
          'ASDFGHJKL\u00d6\u00c4' +
          'ZXCVBNM;:_'
    },
    'scl,sc,cl,c': {
      '23457890m':'@\u00a3$\u20ac{[]}\\',
      'E\u00ddM':'\u20ac~\u00b5'
    },
    'l': {
      '': '\u00a71234567890+\u00b4' +
          'QWERTYUIOP\u00c5\u00a8\'' +
          'ASDFGHJKL\u00d6\u00c4' +
          'ZXCVBNM,.-'
    },
    's': {
      '': '\u00bd!\"#\u00a4%&/()=?`' +
          'QWERTYUIOP\u00c5^*' +
          'ASDFGHJKL\u00d6\u00c4' +
          'ZXCVBNM;:_'
    },
    '': {
      '': '\u00a71234567890+\u00b4' +
          'qwertyuiop\u00e5\u00a8\'' +
          'asdfghjkl\u00f6\u00e4' +
          'zxcvbnm,.-'
    }
  },
  transform: {
    '~ ':'~',
    '~A':'\u00c3', '~N':'\u00d1', '~O':'\u00d5',
    '~a':'\u00e3', '~n':'\u00f1', '~o':'\u00f5',

    '` ':'`',
    '`A':'\u00c0', '`E':'\u00c8', '`I':'\u00cc', '`O':'\u00d2', '`U':'\u00d9',
    '`a':'\u00e0', '`e':'\u00e8', '`i':'\u00ec', '`o':'\u00f2', '`u':'\u00f9',

    '^ ':'^',
    '^a':'\u00e2', '^e':'\u00ea', '^i':'\u00ee', '^o':'\u00f4', '^u':'\u00fb',
    '^A':'\u00c2', '^E':'\u00ca', '^I':'\u00ce', '^O':'\u00d4', '^U':'\u00db',

    '\u00a8 ':'\u00a8',
    '\u00a8A':'\u00c4', '\u00a8E':'\u00cb', '\u00a8I':'\u00cf', '\u00a8O':'\u00d6', '\u00a8U':'\u00dc',
    '\u00a8a':'\u00e4', '\u00a8e':'\u00eb', '\u00a8i':'\u00ef', '\u00a8o':'\u00f6', '\u00a8u':'\u00fc', '\u00a8y':'\u00ff',

    '\u00b4 ':'\u00b4',
    '\u00b4A':'\u00c1', '\u00b4E':'\u00c9', '\u00b4I':'\u00cd', '\u00b4O':'\u00d3', '\u00b4U':'\u00da', '\u00b4Y':'\u00dd',
    '\u00b4a':'\u00e1', '\u00b4e':'\u00e9', '\u00b4i':'\u00ed', '\u00b4o':'\u00f3', '\u00b4u':'\u00fa', '\u00b4y':'\u00fd'
  }
});
