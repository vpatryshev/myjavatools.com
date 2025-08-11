KBD_loadme({
  id: 'ML,ML:Malayalam:\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02 \u0D2E\u0D4A\u0D34\u0D3F',
  name: 'Malayalam',
  tooltip: 'Type in Manglish (Malayalam Phonetic Keyboard)',
  msgOpen: '\u0D24\u0D41\u0D31\u0D15\u0D4D\u0D15\u0D42',
  msgClose: '\u0D05\u0D1F\u0D2F\u0D4D\u0D15\u0D4D\u0D15\u0D42',

  mappings: {
    'c,sc': {
    },

    // mozhi keyboard
    '': {
      '\u00c01234567890m=': '`1234567890-=',

      'Q': '\u0d16\u0d4d',
      'W': '\u0d35\u0d4d',
      'E': '\u0d0e',
      'R': '\u0d30\u0d4d\u200d',
      'T': '\u0d31\u0d4d\u0d31\u0d4d',
      'Y': '\u0d2f\u0d4d',
      'U': '\u0d09',
      'I': '\u0d07',
      'O': '\u0d12',
      'P': '\u0d2a\u0d4d',
       
      '\u00db\u00dd\u00dc': '[]\\',


      'A': '\u0d05',
      'S': '\u0d38\u0d4d',
      'D': '\u0d26\u0d4d',
      'F': '\u0d2b\u0d4d',
      'G': '\u0d17\u0d4d',
      'H': '\u0d39\u0d4d',
      'J': '\u0d1c\u0d4d',
      'K': '\u0d15\u0d4d',
      'L': '\u0d32\u0d4d\u200d',

      ';': ';',
      '\u00de':'\'' ,

      'Z': '\u0d36\u0d4d',
      'X': '\u0d15\u0d4d\u0d38\u0d4d',
      'C': '\u0d15\u0d4d',
      'V': '\u0d35\u0d4d',
      'B': '\u0d2c\u0d4d',
      'N': '\u0d28\u0d4d\u200d',
      'M': '\u0d02',

      '\u00bc':',',
      '\u00be':'.',
      '\u00bf':'/'
    },

    's': {
      '\u00c0': '\u0d4d\u200c',
      '1' : '!',
      '2' : '\u200b\u200d\u0d4d',       // @ = ZWS + ZWNJ + ~
      '34567890m=': '#$%^&*()_+',
      'Q': '\u0d16\u0d4d',
      'W': '\u0d35\u0d4d\u0d35\u0d4d',
      'E': '\u0d0f',
      'R': '\u0d0b',
      'T': '\u0d1f\u0d4d',
      'Y': '\u0d2f\u0d4d\u0d2f\u0d4d',
      'U': '\u0d0a',
      'I': '\u0d08',
      'O': '\u0d13',
      'P': '\u0d2a\u0d4d\u0d2a\u0d4d',
       
      '\u00db\u00dd\u00dc': '{}|',


      'A': '\u0d06',
      'S': '\u0d36\u0d4d',
      'D': '\u0d21\u0d4d',
      'F': '\u0d2b\u0d4d\u0d2b\u0d4d',
      'G': '\u0d17\u0d4d\u0d17\u0d4d\u0d4d',
      'H': '\u0d03',
      'J': '\u0d1c\u0d4d\u0d1c\u0d4d',
      'K': '\u0d15\u0d4d\u0d15\u0d4d',
      'L': '\u0d33\u0d4d\u200d',

      ';': ':',
      '\u00de': '"',

      'Z': '\u0d36\u0d4d\u0d36\u0d4d',
      'X': '\u0d15\u0d4d\u0d37\u0d4d',
      'C': '\u0d18\u0d4d\u0d18\u0d4d',
      'V': '\u0d35\u0d4d\u0d35\u0d4d',
      'B': '\u0d2C\u0d4d\u0d2C\u0d4d',
      'N': '\u0d23\u0d4d\u200d',
      'M': '\u0d2E\u0d4d\u0d2E\u0d4d',

      '\u00bc':'<',
      '\u00be':'>',
      '\u00bf':'?'
    }
  },

  transform: {

    '_' : '\u200c',
    '\u0d4d\u0d4d' : '\u0d4d', //~~ = ~
    '\u0d4d\u200d\u0d4d\u200c' : '\u0d4d\u200c', // chill + ~ = cons + ~ + zwnj


    '\u0d05\u0d05' : '\u0d06', // a + a = aa
    '\u0d0e\u0d0e' : '\u0d08', // e + e = ii
    '\u0d07\u0d07' : '\u0d08', // i + i = ii
    '\u0d12\u0d12' : '\u0d0a', // o + o = uu
    '\u0d12\u0d09' : '\u0d14', // o + u = ou
    '\u0d09\u0d09' : '\u0d0a', // u + u = uu
    '\u0d05\u0d07' : '\u0d10', // a + i = ai
    '\u0d05\u0d09' : '\u0d14', // a + u = au
    '\u0d0b\u0d0b' : '\u0d60', // R + R = RR

    '\u0d30\u0d4d\u200d^' : '\u0d0b', // r^ as R
    '\u0d33\u0d4d\u200d\u0d32\u0d4d\u200d' : '\u0d0c', // Ll
    '\u0d0c\u0d32\u0d4d\u200d' : '\u0d61', // Lll


    '\u0d4d\u0d05' : '', // ~a = null
    '\u0d4d\u0d07' : '\u0d3f', // vir + i = i-sign
    '\u0d4d\u0d09' : '\u0d41', // vir + u = u-sign
    '\u0d4d\u0d0e' : '\u0d46', // vir + e = e-sign
    '\u0d4d\u0d0f' : '\u0d47', // vir + E = E-sign
    '\u0d4d\u0d12' : '\u0d4A', // vir + o = o-sign
    '\u0d4d\u0d13' : '\u0d4B', // vir + O = O-sign
    '\u0d4d\u0d0b' : '\u0d43', // vir + R = R-sign

    '\u0d4d\u0d30\u0d4d\u200d^' : '\u0d43', // vir + r^ = R-sign
    '\u0d4d\u0d32\u0d4d\u200d\u0d32\u0d4d\u200d' : '\u0d62', // vir + L_l_ = Ll-sign
    // only applicable in 'kLlptham' case. - does not work as of now.
    '\u0d4d\u0d32\u0d4d\u0d32\u0d4d\u200d' : '\u0d62', // vir + l + l_ = Ll-sign


    '\u200b\u200d\u0d05' : '\u200b\u200d\u0d3e', // @ + a = ZWS + ZWNJ + aa-sign
    '\u200b\u200d\u0d09' : '\u200b\u200d\u0d57', // @ + u = ZWS + ZWNJ + au-sign
    '\u200b\u200d\u0d07' : '\u200b\u200d\u0d48', // @ + i = ZWS + ZWNJ + ai-sign


    '\u0D15\u0d05' : '\u0D15\u0d3e', // ka + a = kaa
    '\u0D16\u0d05' : '\u0D16\u0d3e', // kha + a = khaa
    '\u0D17\u0d05' : '\u0D17\u0d3e', // ga + a = gaa
    '\u0D18\u0d05' : '\u0D18\u0d3e', // gha + a = ghaa
    '\u0D19\u0d05' : '\u0D19\u0d3e', // nga + a = ngaa

    '\u0D1A\u0d05' : '\u0D1A\u0d3e', // cha + a = chaa
    '\u0D1B\u0d05' : '\u0D1B\u0d3e', // chha + a = chhaa
    '\u0D1C\u0d05' : '\u0D1C\u0d3e', // ja + a = jaa
    '\u0D1D\u0d05' : '\u0D1D\u0d3e', // jha + a = jhaa
    '\u0D1E\u0d05' : '\u0D1E\u0d3e', // nja + a = njaa

    '\u0D1F\u0d05' : '\u0D1F\u0d3e', // Ta + a = Taa
    '\u0D20\u0d05' : '\u0D20\u0d3e', // Tha + a = Thaa
    '\u0D21\u0d05' : '\u0D21\u0d3e', // Da + a = Daa
    '\u0D22\u0d05' : '\u0D22\u0d3e', // Dha + a = Dhaa
    '\u0D23\u0d05' : '\u0D23\u0d3e', // Na + a = Naa

    '\u0D24\u0d05' : '\u0D24\u0d3e', // tha + a = thaa
    '\u0D25\u0d05' : '\u0D25\u0d3e', // thha + a = thhaa
    '\u0D26\u0d05' : '\u0D26\u0d3e', // da + a = daa
    '\u0D27\u0d05' : '\u0D27\u0d3e', // dha + a = dhaa
    '\u0D28\u0d05' : '\u0D28\u0d3e', // na + a = naa

    '\u0D2A\u0d05' : '\u0D2A\u0d3e', // pa + a = paa
    '\u0D2B\u0d05' : '\u0D2B\u0d3e', // pha + a = phaa
    '\u0D2C\u0d05' : '\u0D2C\u0d3e', // ba + a = baa
    '\u0D2D\u0d05' : '\u0D2D\u0d3e', // bha + a = bhaa
    '\u0D2E\u0d05' : '\u0D2E\u0d3e', // ma + a = maa

    '\u0D2F\u0d05' : '\u0D2F\u0d3e', // ya + a = yaa
    '\u0D30\u0d05' : '\u0D30\u0d3e', // ra + a = raa
    '\u0D32\u0d05' : '\u0D32\u0d3e', // la + a = laa
    '\u0D35\u0d05' : '\u0D35\u0d3e', // va + a = vaa

    '\u0D36\u0d05' : '\u0D36\u0d3e', // Sa + a = Saa
    '\u0D37\u0d05' : '\u0D37\u0d3e', // sha + a = shaa
    '\u0D38\u0d05' : '\u0D38\u0d3e', // sa + a = saa
    '\u0D39\u0d05' : '\u0D39\u0d3e', // ha + a = haa

    '\u0D33\u0d05' : '\u0D33\u0d3e', // La + a = Laa
    '\u0D34\u0d05' : '\u0D34\u0d3e', // zha + a = zhaa
    '\u0D31\u0d05' : '\u0D31\u0d3e', // rra + a = rraa


    '\u0D15\u0d07' : '\u0D15\u0d48', // ka + i = kai
    '\u0D16\u0d07' : '\u0D16\u0d48', // kha + i = khai
    '\u0D17\u0d07' : '\u0D17\u0d48', // ga + i = gai
    '\u0D18\u0d07' : '\u0D18\u0d48', // gha + i = ghai
    '\u0D19\u0d07' : '\u0D19\u0d48', // nga + i = ngai

    '\u0D1A\u0d07' : '\u0D1A\u0d48', // cha + i = chai
    '\u0D1B\u0d07' : '\u0D1B\u0d48', // chha + i = chhai
    '\u0D1C\u0d07' : '\u0D1C\u0d48', // ja + i = jai
    '\u0D1D\u0d07' : '\u0D1D\u0d48', // jha + i = jhai
    '\u0D1E\u0d07' : '\u0D1E\u0d48', // nja + i = njai

    '\u0D1F\u0d07' : '\u0D1F\u0d48', // Ta + i = Tai
    '\u0D20\u0d07' : '\u0D20\u0d48', // Tha + i = Thai
    '\u0D21\u0d07' : '\u0D21\u0d48', // Da + i = Dai
    '\u0D22\u0d07' : '\u0D22\u0d48', // Dha + i = Dhai
    '\u0D23\u0d07' : '\u0D23\u0d48', // Na + i = Nai

    '\u0D24\u0d07' : '\u0D24\u0d48', // tha + i = thai
    '\u0D25\u0d07' : '\u0D25\u0d48', // thha + i = thhai
    '\u0D26\u0d07' : '\u0D26\u0d48', // da + i = dai
    '\u0D27\u0d07' : '\u0D27\u0d48', // dha + i = dhai
    '\u0D28\u0d07' : '\u0D28\u0d48', // na + i = nai

    '\u0D2A\u0d07' : '\u0D2A\u0d48', // pa + i = pai
    '\u0D2B\u0d07' : '\u0D2B\u0d48', // pha + i = phai
    '\u0D2C\u0d07' : '\u0D2C\u0d48', // ba + i = bai
    '\u0D2D\u0d07' : '\u0D2D\u0d48', // bha + i = bhai
    '\u0D2E\u0d07' : '\u0D2E\u0d48', // ma + i = mai

    '\u0D2F\u0d07' : '\u0D2F\u0d48', // ya + i = yai
    '\u0D30\u0d07' : '\u0D30\u0d48', // ra + i = rai
    '\u0D32\u0d07' : '\u0D32\u0d48', // la + i = lai
    '\u0D35\u0d07' : '\u0D35\u0d48', // va + i = vai

    '\u0D36\u0d07' : '\u0D36\u0d48', // Sa + i = Sai
    '\u0D37\u0d07' : '\u0D37\u0d48', // sha + i = shai
    '\u0D38\u0d07' : '\u0D38\u0d48', // sa + i = sai
    '\u0D39\u0d07' : '\u0D39\u0d48', // ha + i = hai

    '\u0D33\u0d07' : '\u0D33\u0d48', // La + i = Lai
    '\u0D34\u0d07' : '\u0D34\u0d48', // zha + i = zhai
    '\u0D31\u0d07' : '\u0D31\u0d48', // rra + i = rrai



    '\u0D15\u0d09' : '\u0D15\u0d57', // ka + u = kau
    '\u0D16\u0d09' : '\u0D16\u0d57', // kha + u = khau
    '\u0D17\u0d09' : '\u0D17\u0d57', // ga + u = gau
    '\u0D18\u0d09' : '\u0D18\u0d57', // gha + u = ghau
    '\u0D19\u0d09' : '\u0D19\u0d57', // nga + u = ngau

    '\u0D1A\u0d09' : '\u0D1A\u0d57', // cha + u = chau
    '\u0D1B\u0d09' : '\u0D1B\u0d57', // chha + u = chhau
    '\u0D1C\u0d09' : '\u0D1C\u0d57', // ja + u = jau
    '\u0D1D\u0d09' : '\u0D1D\u0d57', // jha + u = jhau
    '\u0D1E\u0d09' : '\u0D1E\u0d57', // nja + u = njau

    '\u0D1F\u0d09' : '\u0D1F\u0d57', // Ta + u = Tau
    '\u0D20\u0d09' : '\u0D20\u0d57', // Tha + u = Thau
    '\u0D21\u0d09' : '\u0D21\u0d57', // Da + u = Dau
    '\u0D22\u0d09' : '\u0D22\u0d57', // Dha + u = Dhau
    '\u0D23\u0d09' : '\u0D23\u0d57', // Na + u = Nau

    '\u0D24\u0d09' : '\u0D24\u0d57', // tha + u = thau
    '\u0D25\u0d09' : '\u0D25\u0d57', // thha + u = thhau
    '\u0D26\u0d09' : '\u0D26\u0d57', // da + u = dau
    '\u0D27\u0d09' : '\u0D27\u0d57', // dha + u = dhau
    '\u0D28\u0d09' : '\u0D28\u0d57', // na + u = nau

    '\u0D2A\u0d09' : '\u0D2A\u0d57', // pa + u = pau
    '\u0D2B\u0d09' : '\u0D2B\u0d57', // pha + u = phau
    '\u0D2C\u0d09' : '\u0D2C\u0d57', // ba + u = bau
    '\u0D2D\u0d09' : '\u0D2D\u0d57', // bha + u = bhau
    '\u0D2E\u0d09' : '\u0D2E\u0d57', // ma + u = mau

    '\u0D2F\u0d09' : '\u0D2F\u0d57', // ya + u = yau
    '\u0D30\u0d09' : '\u0D30\u0d57', // ra + u = rau
    '\u0D32\u0d09' : '\u0D32\u0d57', // la + u = lau
    '\u0D35\u0d09' : '\u0D35\u0d57', // va + u = vau

    '\u0D36\u0d09' : '\u0D36\u0d57', // Sa + u = Sau
    '\u0D37\u0d09' : '\u0D37\u0d57', // sha + u = shau
    '\u0D38\u0d09' : '\u0D38\u0d57', // sa + u = sau
    '\u0D39\u0d09' : '\u0D39\u0d57', // ha + u = hau

    '\u0D33\u0d09' : '\u0D33\u0d57', // La + u = Lau
    '\u0D34\u0d09' : '\u0D34\u0d57', // zha + u = zhau
    '\u0D31\u0d09' : '\u0D31\u0d57', // rra + u = rrau


    '\u0d3f\u0d07' : '\u0d40', // i-sign + i = ii-sign
    '\u0d46\u0d0e' : '\u0d40', // e-sign + e = ii-sign
    '\u0d4a\u0d12' : '\u0d42', // o-sign + o = uu-sign
    '\u0d4a\u0d09' : '\u0d4c', // o-sign + u = ou-sign
    '\u0d41\u0d09' : '\u0d42', // u-sign + u = uu-sign
    '\u0d43\u0d0b' : '\u0d44', // R-sign + R = RR-sign
    '\u0d62\u0d32\u0d4d\u200d' : '\u0d63', // Ll-sign + l_ = Lll-sign

    '\u0d3e\u0d05' : '\u0d3e\u200b\u200d\u0d3e', // aa-sign + a = aa-sign, aa-sign
    '\u0d40\u0d07' : '\u0d40\u200b\u200d\u0d40', // ee-sign + i = ee-sign, ee-sign
    '\u0d40\u0d0e' : '\u0d40\u200b\u200d\u0d40', // ee-sign + e = ee-sign, ee-sign
    '\u0d42\u0d12' : '\u0d42\u200b\u200d\u0d42', // oo-sign + o = oo-sign, oo-sign
    '\u0d4B\u0d13' : '\u0d4B\u200b\u200d\u0d3e', // O-sign  + O = O-sign,  aa-sign
    '\u0d3e\u0d13' : '\u0d3e\u200b\u200d\u0d3e', // aa-sign + O = aa-sign, aa-sign
    '\u0d4c\u0d09' : '\u0d4c\u200b\u200d\u0d57', // ou-sign + u = ou-sign, au-sign
    '\u0d57\u0d09' : '\u0d57\u200b\u200d\u0d57', // au-sign + u = au-sign, au-sign
    '\u0d57\u0d07' : '\u0d57\u200b\u200d\u0d57', // au-sign + i = au-sign, au-sign for iiiii
    '\u0d57\u0d0e' : '\u0d57\u200b\u200d\u0d57', // au-sign + e = au-sign, au-sign for eeeee
    '\u0d42\u0d09' : '\u0d42\u200b\u200d\u0d42', // oo-sign + u = oo-sign, oo-sign
    '\u0d44\u0d0b' : '\u0d44\u200b\u200d\u0d44', // RR-sign + R = RR-sign, RR-sign
    '\u0d63\u0d32\u0d4d\u200d' : '\u0d63\u200b\u200d\u0d63', // Lll-sign + l_ = Lll-sign, Lll-sign

    '\u0d06\u0d05' : '\u0d06\u200b\u200d\u0d3e', // aa + a = aa, aa-sign
    '\u0d08\u0d07' : '\u0d08\u200b\u200d\u0d57', // ii + i = ee, ee-sign
    '\u0d08\u0d0e' : '\u0d08\u200b\u200d\u0d57', // ee + e = ee, ee-sign
    '\u0d0a\u0d12' : '\u0d0a\u200b\u200d\u0d42', // oo + o = oo, oo-sign
    '\u0d0a\u0d09' : '\u0d0a\u200b\u200d\u0d42', // uu + u = oo, oo-sign
    '\u0d13\u0d13' : '\u0d13\u200b\u200d\u0d3e', // O  + O = O,  aa-sign
    '\u0d14\u0d09' : '\u0d14\u200b\u200d\u0d57', // ou + u = ou, au-sign
    '\u0d60\u0d0b' : '\u0d60\u200b\u200d\u0d44', // RR + R = RR, RR-sign
    '\u0d61\u0d32\u0d4d\u200d' : '\u0d61\u200b\u200d\u0d63', // Lll + l_ = Lll, Lll-sign

    '\u0d4d\u200d\u0d05' : '', // chill + a = cons
    '\u0d4d\u200d\u0d07' : '\u0d3f', // chill + i = i-sign
    '\u0d4d\u200d\u0d09' : '\u0d41', // chill + u = u-sign
    '\u0d4d\u200d\u0d0e' : '\u0d46', // chill + e = e-sign
    '\u0d4d\u200d\u0d0f' : '\u0d47', // chill + E = E-sign
    '\u0d4d\u200d\u0d12' : '\u0d4A', // chill + o = o-sign
    '\u0d4d\u200d\u0d13' : '\u0d4B', // chill + O = O-sign
    '\u0d4d\u200d\u0d0b' : '\u0d43', // chill + R = R-sign

    '\u0d0b\u0d05' : '\u0d31',       // R + a = rra
    '\u0d0b\u0d07' : '\u0d31\u0d3f', // R + i = rra + i-sign
    '\u0d0b\u0d09' : '\u0d31\u0d41', // R + u = rra + u-sign
    '\u0d0b\u0d0e' : '\u0d31\u0d46', // R + e = rra + e-sign
    '\u0d0b\u0d0f' : '\u0d31\u0d47', // R + E = rra + E-sign
    '\u0d0b\u0d12' : '\u0d31\u0d4A', // R + o = rra + o-sign
    '\u0d0b\u0d13' : '\u0d31\u0d4B', // R + O = rra + O-sign
    '\u0d0b\u0d4d\u200c' : '\u0d31\u0d4d\u200c', // R + ~ = rra + ~

    '\u0d02\u0d05' : '\u0d2e', // m_ + a = ma
    '\u0d02\u0d07' : '\u0d2e\u0d3f', // m_ + i = mi
    '\u0d02\u0d09' : '\u0d2e\u0d41', // m_ + u = mu
    '\u0d02\u0d0e' : '\u0d2e\u0d46', // m_ + e = me
    '\u0d02\u0d0f' : '\u0d2e\u0d47', // m_ + E = mE
    '\u0d02\u0d12' : '\u0d2e\u0d4A', // m_ + o = mo
    '\u0d02\u0d13' : '\u0d2e\u0d4B', // m_ + O = mO

    '\u0d15\u0d4d\u200d\u0d39' : '\u0d16', // kh
    '\u0d17\u0d4d\u0d39' : '\u0d18', // gh
    '\u0d28\u0d4d\u200d\u0d17' : '\u0d19', // ng

    '\u0d15\u0d4d\u0d39' : '\u0d1a', // ch
    '\u0d1a\u0d4d\u0d39' : '\u0d1b', // chh
    '\u0d1c\u0d4d\u0d39' : '\u0d1d', // jh
    '\u0d28\u0d4d\u200d\u0d1c' : '\u0d1e', // nj

    '\u0d1f\u0d4d\u0d39' : '\u0d20', // Th
    '\u0d21\u0d4d\u0d39' : '\u0d22', // Dh

    '\u0d31\u0d4d\u0d31\u0d4d\u0d39' : '\u0d24', // t + h = th
    '\u0d24\u0d4d\u0d39' : '\u0d25', // thh
    '\u0d26\u0d4d\u0d39' : '\u0d27', // dh
    '\u0d28\u0d4d\u200d\u0d31\u0d4d\u0d31' : '\u0d28\u0d4d\u0d31', // nt
    '\u0d31\u0d4d\u0d39' : '\u0d24', // t + h = th for nth

    '\u0d2a\u0d4d\u0d39' : '\u0d2b', // ph
    '\u0d2c\u0d4d\u0d39' : '\u0d2d', // bh

    '\u0d38\u0d4d\u0d39' : '\u0d37', // sh
    '\u0d36\u0d4d\u0d39' : '\u0d34', // zh

    '\u0d28\u0d4d\u200d\u0d15' : '\u0d19\u0d4d\u0d15', // n_ + k = nk
    '\u0d19\u0d4d\u0d15\u0d4d\u0d39' : '\u0d1e\u0d4d\u0d1a', // n + c + h = njch

    '\u0d30\u0d4d\u200d\u0d30\u0d4d\u200d' : '\u0d31\u0d4d', // r-chillu r-chillu = rr
    '\u0d31\u0d4d\u0d31\u0d4d\u0d31\u0d4d\u0d31' : '\u0d31\u0d4d\u0d31', // t + t = tt

    '\\0' : '\u0d66', // 0
    '\\1' : '\u0d67', // 0
    '\\2' : '\u0d68', // 0
    '\\3' : '\u0d69', // 0
    '\\4' : '\u0d6a', // 0
    '\\5' : '\u0d6b', // 0
    '\\6' : '\u0d6c', // 0
    '\\7' : '\u0d6d', // 0
    '\\8' : '\u0d6e', // 0
    '\\9' : '\u0d6f', // 0

    '\u0d670' : '\u0d70', // 10
    '\u0d700' : '\u0d71', // 100
    '\u0d710' : '\u0d72', // 1000

    '\u0d67\/4' : '\u0d73', // 1/4
    '\u0d67\/2' : '\u0d74', // 1/2
    '\u0d69\/4' : '\u0d75', // 3/4

    '\/\/' : '\u0d3d', // praslesham(avagraha)

    //anuswaram handling
    '\u0d02\u0d28' : '\u0d2e\u0d4d\u0d28', //mna
    '\u0d02\u0d2a' : '\u0d2e\u0d4d\u0d2a', //mpa
    '\u0d02\u0d02' : '\u0d2e\u0d4d\u0d2e\u0d4d', //mma
    '\u0d02\u0d2f' : '\u0d2e\u0d4d\u0d2f', //mya
    '\u0d02\u0d30' : '\u0d2e\u0d4d\u0d30', //mra
    '\u0d02\u0d32' : '\u0d2e\u0d4d\u0d32', //mla
    '\u0d02\u0d33' : '\u0d2e\u0d4d\u0d32', //mLa
    //'\u0d02\u0d35' : '\u0d2e\u0d4d\u0d35', //mva - not found any word

    '\u0d38\u0d02\u0d2f' : '\u0d38\u0d02\u0d2f', //sam + ya = sam_ya

    // chillu handling: does chillu + cons form a conjunct or not ?
    '\u0d15\u0d4d\u200d\u0d15' : '\u0d15\u0d4d\u0d15', //kka
    '\u0d15\u0d4d\u200d\u0d1f' : '\u0d15\u0d4d\u0d1f', //kTa
    '\u0d15\u0d4d\u200d\u0d23' : '\u0d15\u0d4d\u0d23', //kNa
    '\u0d15\u0d4d\u200d\u0d31' : '\u0d15\u0d4d\u0d31', //ktha - using RA
    '\u0d15\u0d4d\u200d\u0d28' : '\u0d15\u0d4d\u0d28', //kna
    '\u0d15\u0d4d\u200d\u0d02' : '\u0d15\u0d4d\u0d2e\u0d4d', //kma
    '\u0d15\u0d4d\u200d\u0d37' : '\u0d15\u0d4d\u0d37', //ksha
    '\u0d15\u0d4d\u200d\u0d38' : '\u0d15\u0d4d\u0d38', //ksa

    '\u0d23\u0d4d\u200d\u0d1f' : '\u0d23\u0d4d\u0d1f', //NTa
    '\u0d23\u0d4d\u200d\u0d20' : '\u0d23\u0d4d\u0d20', //NTha
    '\u0d23\u0d4d\u200d\u0d21' : '\u0d23\u0d4d\u0d21', //NDa
    '\u0d23\u0d4d\u200d\u0d22' : '\u0d23\u0d4d\u0d22', //NDha
    '\u0d23\u0d4d\u200d\u0d23' : '\u0d23\u0d4d\u0d23', //NNa
    '\u0d23\u0d4d\u200d\u0d02' : '\u0d23\u0d4d\u0d2e\u0d4d', //Nma

    '\u0d28\u0d4d\u200d\u0d24' : '\u0d28\u0d4d\u0d24', //ntha
    '\u0d28\u0d4d\u200d\u0d25' : '\u0d28\u0d4d\u0d25', //nthha
    '\u0d28\u0d4d\u200d\u0d26' : '\u0d28\u0d4d\u0d26', //nda
    '\u0d28\u0d4d\u200d\u0d27' : '\u0d28\u0d4d\u0d27', //ndha
    '\u0d28\u0d4d\u200d\u0d28' : '\u0d28\u0d4d\u0d28', //nna
    '\u0d28\u0d4d\u200d\u0d02' : '\u0d28\u0d4d\u0d2e\u0d4d', //nma

    //'\u0d32\u0d4d\u200d\u0d02' : '\u0d32\u0d4d\u0d2e\u0d4d', //lma - not used
    '\u0d33\u0d4d\u200d\u0d33' : '\u0d33\u0d4d\u0d33', //LLa

    '\u0d4d\u200d\u0d2f' : '\u0d4d\u0d2f', //chillu + ya = cons + vir + ya
    '\u0d4d\u200d\u0d30' : '\u0d4d\u0d30', //chillu + ra = cons + vir + ra
    '\u0d4d\u200d\u0d32' : '\u0d4d\u0d32', //chillu + la = cons + vir + la
    '\u0d4d\u200d\u0d33' : '\u0d4d\u0d32', //chillu + La = cons + vir + la
    '\u0d4d\u200d\u0d35' : '\u0d4d\u0d35', //chillu + va = cons + vir + va

    '\u0d4d\u0d33' : '\u0d4d\u0d32', //vir + La = vir + la

    // exceptions to above chillu + semi-vowels rules
    '\u0d30\u0d4d\u200d\u0d35' : '\u0d30\u0d4d\u200d\u0d35', //r_ + va = r_ + va
    '\u0d2f\u0d4d\u0d35' : '\u0d2f\u0d4d\u200c\u0d35', //y + va = y_ + va
    '\u0d2f\u0d4d\u0d30' : '\u0d2f\u0d4d\u200c\u0d30', //y + ra = y_ + ra

    '\u0d15\u0d4d_' : '\u0d7f' // k + _ = k_
  }
});
