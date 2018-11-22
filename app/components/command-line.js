import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  ajax: service(),

  classNames: ['CommandLine'],

  didReceiveAttrs() {
    if (this.focusCommandLine) {
      this.element.childNodes[0].focus();
    }
  },

  didInsertElement() {
    this.element.childNodes[0].focus();
  },

  runSentinelQuery: task(function * (query) {
    if (isBlank(query)) {
      return this.onResult([]);
    }

    if (query.indexOf('\n') !== -1) {
      let queries = query.split('\n');

      let { results, notFound } = yield this.runBatchSentinelQuery.perform(queries);

      this.set('hasKeyedUp', true);
      this.set('message', `Found ${results.length} records. No match for ${notFound} pilots.`);

      return this.onSelect(results);
    }

    yield timeout(500);

    let results = yield this.ajax.request(`characters?where={"name":{"contains":"${query}"}}`);

    this.set('hasKeyedUp', true);

    if (results.length === 1) {
      if (results[0].name.toLowerCase() === query.toLowerCase()) {
        return this.onSelect(results[0]);
      }
    }

    return this.onResult(results);
  }).restartable(),

  runBatchSentinelQuery: task(function * (queries) {
    let results = [];
    let notFound = 0;

    for (let query of queries) {
      let result = yield this.ajax.request(`characters?name=${query}`);

      if (result[0]) {
        results.pushObject(result[0]);
      } else {
        notFound++;
      }
    }

    return { results, notFound };
  }),
});
