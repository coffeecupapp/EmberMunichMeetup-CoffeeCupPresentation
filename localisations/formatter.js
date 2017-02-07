import Ember from 'ember';
import ENV from 'coffeecup/config/environment';

/**
 * Service for handling standardised formatting based on user/account settings globally.
 *
 */
export default Ember.Service.extend({
  availableIn: ['controllers', 'routes', 'components'],
  
  container: Ember.inject.service('container'),
  
  formatDate(date) {
    date = moment(date);
    let dateFormat = this.getDateFormat();

    let formatted = date.format(dateFormat);
    return formatted;
  },

  getApplicationController() {
    return this.get('container').lookup('controller:application');
  },

  getAccountSettings() {
    return this.getApplicationController().get('accountSettings');
  },

  getCurrentUser() {
    return this.getApplicationController().get('currentUser');
  },
  
  getDateFormat() {
    let dateFormat;
    let applicationController = this.getApplicationController();
    let currentUser = applicationController.get('currentUser');
    if (currentUser) {
      dateFormat = currentUser.get('dateFormat');
    } else {
      let accountSettings = applicationController.get('accountSettings');
      dateFormat = accountSettings.get('defaultDateFormat');
    }

    if (!dateFormat) {
      dateFormat = ENV.constants.DATE_FORMAT_DDMMYYYY_POINT;
    }
    
    return dateFormat;
  },
  
  formatNumber(number) {
    let numberFormat = this.getAccountSettings().get('numberFormat');
    return numeral(number).format(numberFormat);
  },

  formatDuration(duration, hideSymbol, minuteSnap) {
    let durationFormat =  this.getCurrentUser().get('durationFormat');

    if (!duration || isNaN(parseFloat(duration))){
      duration = 0;
    }

    minuteSnap = parseInt(minuteSnap, 10);

    if (!isNaN(minuteSnap)) {
      let factor = 60 * minuteSnap / 3600;
      let durationRounded = Math.round(duration / factor) * factor;
      return this._formatDuration(durationFormat, durationRounded, hideSymbol);
    } else {
      return this._formatDuration(durationFormat, duration, hideSymbol);
    }
  },
  
  _formatToHoursAndMinutes(val) {
    var duration = val || 0;
    var hours = Math.floor(parseFloat(duration));
    var minutes = Math.round(parseFloat(duration) * 60 % 60);
  
    return hours + ":" + ('0' + minutes).slice(-2);
  },

  /**
   * format the duration as hours depending on the user settings or by using a default setting
   * @param durationFormat {Number} DURATION_FORMAT_HM OR DURATION_FORMAT_DECIMAL
   * @param duration {Number} the duration value
   * @param hideSymbol {Boolean} whether to hide or show the symbol in the formatted string
   * @returns {string} the formatted value, formatted as hours
   */
  _formatDuration(durationFormat, duration, hideSymbol) {

    if ((!duration && duration !== 0) || isNaN(parseFloat(duration))) {
      return '';
    }
    var symbol = hideSymbol === true ? '' : ' h';

    if (durationFormat === ENV.constants.DURATION_FORMAT_HM) {
      return this._formatToHoursAndMinutes(parseFloat(duration)) + symbol;
    }

    // DURATION_FORMAT_DECIMAL
    return numeral(duration).format('0,0.00') + symbol;
  },


  formatCurrency(value, short) {
    return this._formatCurrencyWithFormatting(value, short, ENV.settings.CURRENCY_LABEL_FORMAT);
  },
  
  _formatCurrencyWithFormatting(value, short, formatting) {
    let format = formatting[2];
    
    if (short) {
      let absVal = Math.abs(value);
      if (absVal < 10000) {
        format = formatting[2];
      } else if (absVal < 1000000) {
        format = formatting[1];
      } else {
        format = formatting[0];
      }
    }

    return numeral(value).format(format);
  }
});
