import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';

export default Service.extend({

  ajax: service(),

  authorization: task(function * () {
    let response = yield this.ajax.request('https://gateway.artemis-eve.space/api/gateway/whoami', 
      {
        xhrFields: {
          withCredentials: true
        }
      }
    ).catch((e) => e);

    if (response && response.character_id) {
      this.set('character', response);

      yield this.getStandings.perform();

      return;
    }
  }),

  getStandings: task(function * () {
    let response = yield this.ajax.request('https://gateway.artemis-eve.space/api/gateway/standings', 
      {
        xhrFields: {
          withCredentials: true
        }
      }
    );

    if (response) {
      let standingsHash = {};

      for (let standing of response) {
        if (standing.standing > 0)
          standingsHash[standing.contact_id] = standing.standing;
      }

      standingsHash[this.character.character_id] = 10;
      standingsHash[this.character.corporation_id] = 10;
      standingsHash[this.character.alliance_id] = 10;

      this.set('standings', standingsHash);
    }
  }),

  initialize() {
    this.authorization.perform();
  },

});
