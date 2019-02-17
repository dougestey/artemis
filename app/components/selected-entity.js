import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import _ from 'npm:lodash';

export default Component.extend({
  ajax: service (),

  classNames: ['SelectedEntity'],

  click() {
    // window.open(`https://zkillboard.com/character/${this.entity.id}`);
    this.sendToClient.perform();
  },

  sendToClient: task(function * () {
    yield this.ajax.post('/api/gateway/ui/open', {
      host: 'https://gateway.artemis-eve.space',
      data: {
        id: this.entity.id
      },
      xhrFields: {
        withCredentials: true
      },
      contentType: 'application/json'
    });
  }).restartable(),

  lastActive: computed('entity.history', 'entity.losses', 'entity.fleet.isActive', function() {
    if (this.entity.fleet && this.entity.fleet.isActive) {
      return 'Now';
    }

    let lastFleet, lastDeath;

    if (this.entity.history.length)
      lastFleet = this.entity.history[this.entity.history.length - 1].lastSeen;

    if (this.entity.losses.length)
      lastDeath = this.entity.losses[0].time;

    if (lastDeath && lastDeath) {
      let lastDeathTime = new Date(lastDeath).getTime(),
          lastFleetTime = new Date(lastFleet).getTime();

      return lastDeathTime > lastFleetTime ? lastDeath : lastFleet;
    } else if (lastDeath || lastFleet) {
      return lastDeath ? lastDeath : lastFleet;
    }

    return 'N/A';
  }),

  averageFleetSize: computed('entity.history', function() {
    let sum = 0;

    for (let fleet of this.entity.history) {
      sum = sum + _.values(fleet.composition).length;
    }

    if (sum && this.entity.history.length)
      return parseInt(sum / this.entity.history.length);

    return 'N/A';
  }),

  mostCommonShipType: computed('entity.history', function() {
    let ships = [];

    for (let fleet of this.entity.history) {
      let shipType = fleet.composition[this.entity.id];

      if (shipType)
        ships.push(shipType);
    }

    // let mostCommon = _.max(_.keys(_.countBy(ships)), o => obj[o]);
    let mostCommon = _.countBy(ships);

    return mostCommon;
  }),

  backgroundImage: computed('entity.id', function() {
    if (!this.entity.id)
      return;

    return htmlSafe(`background-image: url(https://imageserver.eveonline.com/Character/${this.entity.id}_512.jpg) !important;`);
  }),

  actions: {
    clearEntity() {
      this.removeEntity(this.entity.id);
    }
  }
});
