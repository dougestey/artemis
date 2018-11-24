import Controller from '@ember/controller';
import { later } from '@ember/runloop';
import { isArray } from '@ember/array';

export default Controller.extend({

  selected: [],

  searchPaneCollapsed: false,

  actions: {
    toggleSearch() {
      this.toggleProperty('searchPaneCollapsed');
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
  },

});
