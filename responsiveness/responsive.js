import Ember from 'ember';
import ENV from 'coffeecup/config/environment';

/**
 * Service with utils for responsive design, particularly targeting mobile devices.
 */
const ResponsiveService = Ember.Service.extend({
  /**
   * Because there are only two mobile operating systems right???
   *
   * @returns {true if Android or iOS}
   */
  isMobile() {
    return this.isIOS() || this.isAndroid();
  },

  isIOS() {
    let ua = this.getUA();
    return (/(ipod|iphone|ipad)/).test(ua) && (/applewebkit/).test(ua);
  },

  isAndroid() {
    return this.getUA().indexOf('android') !== -1;
  },

  getUA() {
    if (navigator && navigator.userAgent && typeof navigator.userAgent === 'string') {
      return navigator.userAgent.toLowerCase();
    } else {
      return '';
    }
  }
});

export default ResponsiveService;


