import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { later } from '@ember/runloop';
import { isArray } from '@ember/array';
import { isBlank } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';

export default Controller.extend({
  ajax: service(),

  selected: [],

  searchPaneCollapsed: false,

  settingsPaneCollapsed: true,

  standingFilter: false,

  session: service(),

  character: reads('session.character'),

  standings: reads('session.standings'),

  selectedWithoutBlues: computed('standingFilter', 'selected.[]', 'session.standings', function() {
    return this.selected.filter((entity) => {
      let character = this.session.standings[entity.id];
      let corporation = this.session.standings[entity.corporation.id];
      let alliance;

      if (entity.alliance)
        alliance = this.session.standings[entity.alliance.id];

      if (!alliance && !corporation && !character)
        return entity;
    });
  }),

  resultsWithoutBlues: computed('standingFilter', 'results.[]', 'session.standings', function() {
    return this.results.filter((entity) => {
      let character = this.session.standings[entity.id];
      let corporation = this.session.standings[entity.corporation.id];
      let alliance;

      if (entity.alliance)
        alliance = this.session.standings[entity.alliance.id];

      if (!alliance && !corporation && !character)
        return entity;
    });
  }),

  runSentinelQuery: task(function * (query) {
    if (isBlank(query)) {
      return this.setResult([]);
    }

    if (query.indexOf('\n') !== -1) {
      this.set('selected', []);

      let queries = query.split('\n');

      let { results, notFound } = yield this.runBatchSentinelQuery.perform(queries);

      this.set('hasKeyedUp', true);
      this.set('message', `Found ${results.length} records. No match for ${notFound} pilots.`);

      return this.pushResult(results);
    }

    yield timeout(500);

    let results = yield this.ajax.request(`characters?name=${query}`);

    this.set('hasKeyedUp', true);

    if (results.length === 1) {
      if (results[0].name.toLowerCase() === query.toLowerCase()) {
        return this.pushResult(results[0]);
      }
    }

    return this.setResult(results);
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

  setResult: function(results) {
    if (results.length === 0) {
      this.set('message', 'No results.');
    } else {
      this.set('message', null);
    }

    this.set('results', results);
  },

  pushResult: function(result) {
    if (isArray(result)) {
      this.set('focusCommandLine', true);

      return this.set('selected', result);
    }

    if (!this.selected.findBy('id', result.id))
      this.selected.unshiftObject(result);

    this.set('message', null);
    this.set('focusCommandLine', true);

    later(() => { this.set('focusCommandLine', false) });
  },

  actions: {
    toggleSearch() {
      this.toggleProperty('searchPaneCollapsed');
    },

    toggleSettings() {
      this.toggleProperty('settingsPaneCollapsed');
    },

    toggleStandingFilter() {
      this.toggleProperty('standingFilter');
    },

    pushResult(result) {
      this.pushResult(result);
    },

    removeEntity(id) {
      let existing = this.selected.findBy('id', id);

      if (existing)
        this.selected.removeObject(existing);
    },

    authorize() {
      window.location = 'https://gateway.artemis-eve.space/api/gateway/authorize';
    },
  },
});
