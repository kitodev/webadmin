import { Component, OnInit } from '@angular/core';
import {
  PickerType,
  SelectMode,
} from '@danielmoncada/angular-datetime-picker/lib/date-time/date-time.class';
import moment from 'moment';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss']
})
export class DateTimePickerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
