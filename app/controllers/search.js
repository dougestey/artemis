import Controller from '@ember/controller';
import { later } from '@ember/runloop';

export default Controller.extend({

  selected: [],

  actions: {
    setResult(results) {
      if (results.length === 0) {
        this.set('message', 'No results.');
      } else {
        this.set('message', null);
      }

      this.set('results', results);
    },

    pushResult(result) {
      if (!this.selected.findBy('id', result.id))
        this.selected.pushObject(result);

      this.set('results', []);
      this.set('message', null);
      this.set('focusCommandLine', true);

      later(() => { this.set('focusCommandLine', false) });
    },
  },

});
