import Component from '@ember/component';

export default Component.extend({
  tagName: 'button',

  classNames: ['SearchResult'],

  click() {
    this.onSelect(this.result);
  },

  keyUp(event) {
    if (event.keyCode === 13) {
      this.onSelect(this.result);
    }
  }
});
