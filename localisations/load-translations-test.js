import Ember from 'ember';
import {localizations, parseCSV} from 'coffeecup/utils/load-translations';
import { module, test } from 'coffeecup/tests/unit/unit-helpers';

module('Load Localizations');

test('localizations missing?', assert => {

  const token = assert.async();
  const promises = [];

  localizations.forEach(localization => {
    let locale = localization.locale;
    let url = "/" + localization.url;
    let promise = Ember.$.get(url, {
      method: 'GET',
      cache: false // only for dev, s3 will ignore it anyways
    }).then(data => {
      return {
        locale: locale,
        values: parseCSV(locale, data)
      };
    });
    promises.push(promise);
  });

    // Wait for all localisations to be loaded and parsed
  Ember.RSVP.all(promises).then(locales => {
    let length = -1;
    let known = {};

    locales.forEach(entry => {
      if (length < 0) {
        length = entry.values.length;
      } else {
        // Verify length of localisation isn't different from other language (i.e. same amount of strings)
        assert.equal(length, entry.values.length, `'${entry.locale}' should have the same length as all the others.`);
      }
      known[entry.locale] = {};
      entry.values.forEach(value => {
        let currentLocale = known[entry.locale];
        if (currentLocale[value.key]) {
          // Ensure same key isn't used twice in a give localisation
          assert.ok(false, `${entry.locale.toUpperCase()} - Key '${value.key}' should not be defined multiple times! ('${currentLocale[value.key]}' vs '${value.label}')`);
        }
        currentLocale[value.key] = value.label;
      });
    });

    // Compare each localisation with every other localisation and ensure that they all have matching keys
    locales.forEach(entry => {
      for (let knownLocale in known) {
        if (knownLocale === entry.locale) {
          break;
        }

        let otherLocale = known[knownLocale];
        let currentLocale = known[entry.locale];
        for (let key in currentLocale) {
          assert.ok(otherLocale[key], `'${entry.locale.toUpperCase()} - Key '${key}' should exist in other locale '${knownLocale.toUpperCase()}'`);
        }
      }
    });

    token();

  });
});