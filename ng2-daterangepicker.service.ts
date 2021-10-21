import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DaterangepickerConfig {

  public settings: any;

  constructor() {
    this.settings = {
      locale: { format: 'DD-MM-YYYY' },
      alwaysShowCalendars: false,
      opens: "right",
      ranges: {
        'Last 7 Days': [moment().subtract(1, 'week'), moment()],
        'Last 14 Days': [moment().subtract(2, 'week'), moment()],
        'Last 30 Days': [moment().subtract(30, 'day'), moment()],
        'Last 3 Months': [moment().subtract(4, 'month'), moment()],
        'Last 6 Months': [moment().subtract(6, 'month'), moment()],
        'Last 12 Months': [moment().subtract(12, 'month'), moment()],
        'Quater to Date': [moment().quarter(moment().quarter()).startOf('quarter'), moment()],
        'Month to Date': [moment().month(moment().month()).startOf('month'), moment()],
      }
    };
  }
}
