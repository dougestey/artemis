import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({

  session: service(),

  init() {
    this._super(...arguments);

    this.session.initialize();
  },

});
