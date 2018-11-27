import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import _ from 'npm:lodash';

export default Component.extend({
  classNames: ['SelectedEntity'],

  click() {
    this.removeEntity(this.entity.id);
  },

  lastActive: computed('entity.fleet.lastSeen', function() {
    if (this.entity.history.length)
      return this.entity.history[this.entity.history.length - 1].lastSeen;

    return 'Unknown';
  }),

  averageFleetSize: computed('entity.history', function() {
    let sum = 0;

    for (let fleet of this.entity.history) {
      sum = sum + _.values(fleet.composition).length;
    }

    if (sum && this.entity.history.length)
      return parseInt(sum / this.entity.history.length);

    return 'Unknown';
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
});
