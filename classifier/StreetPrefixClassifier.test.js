const StreetPrefixClassifier = require('./StreetPrefixClassifier')
const StreetPrefixClassification = require('../classification/StreetPrefixClassification')
const Span = require('../tokenization/Span')
const classifier = new StreetPrefixClassifier()

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
  test('index: does contain single char tokens', (t) => {
    t.true(Object.keys(classifier.index).some(token => token.length < 2))
    t.end()
  })
}

module.exports.tests.french_prefix = (test) => {
  let valid = {
    'rue': { fr: true },
    'allée': { fr: true },
    'allee': { fr: true },
    'avenue': { fr: true },
    'av': { fr: true, ca: true, es: true, pt: true },
    'rt.': { fr: true, es: true },
    'boulevard': { fr: true, es: true },
    'blvd': { fr: true, es: true },
    'blvd.': { fr: true, es: true }
  }

  Object.entries(valid).forEach(([ token, langs ]) => {
    test(`french prefix: ${token}`, (t) => {
      let s = classify(token)
      t.deepEqual(s.classifications, {
        StreetPrefixClassification: new StreetPrefixClassification(token.length > 1 ? 1.0 : 0.2, { langs })
      })
      t.end()
    })
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`StreetPrefixClassifier: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
