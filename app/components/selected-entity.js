import Component from '@ember/component';
// import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import _ from 'npm:lodash';

export default Component.extend({
  classNames: ['SelectedEntity'],

  lastActive: computed('entity.fleet.lastSeen', function() {
    return this.entity.fleet && this.entity.fleet.lastSeen ? this.entity.fleet.lastSeen : 'Unknown';
  }),

  averageFleetSize: computed('entity.history', function() {
    let sum = 0;

    for (let fleet of this.entity.history) {
      sum = sum + _.values(fleet.composition).length;
    }

    return parseInt(sum / this.entity.history.length);
  }),

  mostCommonShipType: computed('entity.history', function() {
    let ships = [];

    for (let fleet of this.entity.history) {
      let shipType = fleet.composition[this.entity.id];

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
});
