import { Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { AppComponent, IWeatherData } from '../app.component';
import cityTimezones from 'city-timezones';

@Component({
  selector: 'app-date',
  standalone: true,
  imports: [],
  templateUrl: './date.component.html',
  styleUrl: './date.component.css'
})

export class DateComponent implements OnInit , OnChanges {
  @Input() weatherData?: IWeatherData | null ;
  timeZone?: string;
  date?: any = new globalThis.Date() ;
  dayOfTheWeek?: string;
  day?: string;
  month?: string;
  theDate?: any;
  interval?: any;

  ngOnInit(): void {
    // this.startInterval();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['weatherData'] && changes['weatherData'].currentValue) {
      this.updateTime(this.weatherData?.name);
      this.startInterval();
    }
  }

    updateTime(city:string| undefined){
    if (city == "Alexandria Governorate"){
      city = "Alexandria"
    }

    if(city){
      const timeZoneInfo = cityTimezones.lookupViaCity(city);
      if (timeZoneInfo && timeZoneInfo.length > 0) {
          this.timeZone = timeZoneInfo[0].timezone ;
      } else {
          console.error(`Time zone not found for city: ${city}`);
      }
    }

    const options: Intl.DateTimeFormatOptions = {
      timeZone: this.timeZone || 'UTC',
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour12: true,
      hour: 'numeric',
      minute: 'numeric',
  };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    this.dayOfTheWeek =  formatter.formatToParts(this.date)[0].value;
    this.day = formatter.formatToParts(this.date)[4].value;
    this.month = formatter.formatToParts(this.date)[2].value;
    this.theDate = formatter.formatToParts(this.date).slice(8, ).map(part => part.value).toString().replaceAll(',' , '').trim();
  }

  startInterval(): void {
      this.interval = setInterval(() => {
        this.date = new globalThis.Date();
      }, 5000);
  }

}
