const StreetSuffixClassifier = require('./StreetSuffixClassifier')
const StreetSuffixClassification = require('../classification/StreetSuffixClassification')
const Span = require('../tokenization/Span')
const classifier = new StreetSuffixClassifier()

module.exports.tests = {}

function classify (body) {
  let s = new Span(body)
  classifier.each(s, null, 1)
  return s
}

module.exports.tests.contains_numerals = (test) => {
  test('contains numerals: honours contains.numerals boolean', (t) => {
    let s = new Span('example')
    s.contains.numerals = true
    classifier.each(s, null, 1)
    t.deepEqual(s.classifications, {})
    t.end()
  })
}

module.exports.tests.single_character_tokens = (test) => {
  test('index: does not contain single char tokens', (t) => {
    t.false(Object.keys(classifier.index).some(token => token.length < 2))
    t.end()
  })
}

module.exports.tests.english_suffix = (test) => {
  let valid = {
    'street': { en: true },
    'st': { en: true, sv: true },
    'st.': { en: true, sv: true },
    'road': { en: true },
    'rd': { en: true },
    'boulevard': { af: true, da: true, de: true, en: true, uk: true },
    'blvd': { af: true, en: true, ro: true, uk: true },
    'blvd.': { af: true, en: true, ro: true, uk: true },
    'rd.': { en: true }
  }

  Object.entries(valid).forEach(([ token, langs ]) => {
    test(`english suffix: ${token}`, (t) => {
      let s = classify(token)
      t.deepEqual(s.classifications, {
        StreetSuffixClassification: new StreetSuffixClassification(token.length > 1 ? 1.0 : 0.2, { langs })
      })
      t.end()
    })
  })
}

module.exports.tests.german_suffix = (test) => {
  let valid = {
    'straße': { de: true },
    'strasse': { de: true },
    'str': { af: true, de: true, en: true, it: true, nl: true, ro: true },
    'str.': { af: true, de: true, en: true, it: true, nl: true, ro: true },
    'pl.': { be: true, bg: true, de: true, el: true, en: true, eu: true, gsw: true, lt: true, nb: true, oc: true, pl: true, ru: true, sv: true, uk: true },
    'platz': { de: true, gsw: true },
    'allee': { de: true, et: true },
    'al': { be: true, bs: true, de: true, en: true, fi: true, hr: true, lt: true, pl: true, ro: true, ru: true, uk: true },
    'al.': { be: true, bs: true, de: true, en: true, fi: true, hr: true, lt: true, pl: true, ro: true, ru: true, uk: true },
    'weg': { af: true, de: true, nl: true },
    'w.': { gsw: true }
  }

  Object.entries(valid).forEach(([ token, langs ]) => {
    test(`german suffix: ${token}`, (t) => {
      let s = classify(token)
      t.deepEqual(s.classifications, {
        StreetSuffixClassification: new StreetSuffixClassification(token.length > 1 ? 1.0 : 0.2, { langs })
      })
      t.end()
    })
  })
}

module.exports.tests.valid_pelias_street_types = (test) => {
  let valid = { 'paku': { en: true } }

  Object.entries(valid).forEach(([ token, langs ]) => {
    test(`valid pelias street types: ${token}`, (t) => {
      let s = classify(token)
      t.deepEqual(s.classifications, {
        StreetSuffixClassification: new StreetSuffixClassification(token.length > 1 ? 1.0 : 0.2, { langs })
      })
      t.end()
    })
  })
}

module.exports.tests.invalid_pelias_street_types = (test) => {
  let invalid = ['and']

  invalid.forEach(token => {
    test(`invalid pelias street types: ${token}`, (t) => {
      let s = classify(token)
      t.deepEqual(s.classifications, {})
      t.end()
    })
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`StreetSuffixClassifier: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
