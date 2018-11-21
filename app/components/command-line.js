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

  runSentinelQuery: task(function * (query) {
    if (isBlank(query)) {
      return this.onResult([]);
    }

    yield timeout(500);

    let results = yield this.ajax.request(`characters?where={"name":{"contains":"${query}"}}`);

    if (results.length === 1) {
      if (results[0].name.toLowerCase() === query.toLowerCase()) {
        return this.onSelect(results[0]);
      }
    }

    this.onResult(results);
  }).restartable(),
});
