import Component from '@ember/component';

export default Component.extend({
  classNames: ['CommandLine'],

  didReceiveAttrs() {
    if (this.focusCommandLine) {
      this.element.childNodes[0].focus();
    }
  },

  didInsertElement() {
    this.element.childNodes[0].focus();
  },

  actions: {
    clear (event) {
      event.target.value = '';
    }
  }
});
