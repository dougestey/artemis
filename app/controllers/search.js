import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { later } from '@ember/runloop';
import { isArray } from '@ember/array';

export default Controller.extend({

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

    setResult(results) {
      if (results.length === 0) {
        this.set('message', 'No results.');
      } else {
        this.set('message', null);
      }

      this.set('results', results);
    },

    pushResult(result) {
      if (isArray(result)) {
        // this.set('message', null);
        this.set('focusCommandLine', true);

        return this.set('selected', result);
      }

      if (!this.selected.findBy('id', result.id))
        this.selected.unshiftObject(result);

      this.set('message', null);
      this.set('focusCommandLine', true);

      later(() => { this.set('focusCommandLine', false) });
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
