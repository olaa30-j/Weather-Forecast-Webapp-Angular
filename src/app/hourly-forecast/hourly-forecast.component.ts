import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppComponent, IDailyWeather } from '../app.component';

@Component({
  selector: 'app-hourly-forecast',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './hourly-forecast.component.html',
  styleUrl: './hourly-forecast.component.css'
})
export class HourlyForecastComponent implements OnChanges {
  @Input() dailyData?: IDailyWeather | null;
  hourlyWeather?: any;
  jsonData?: any;

  constructor(public appComponent: AppComponent) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dailyData'] && changes['dailyData'].currentValue) {
      this.dailyData = this.appComponent.dailyData;
      this.setHourlyData();
      this.jsonData = this.appComponent.jsonData;
    }
  }

  setHourlyData(): void {
    const hours = this.dailyData?.list.filter((_, index) => [0, 2, 4, 6, 8].includes(index));
    this.hourlyWeather = hours || [];
  }

  getWeatherImage(data: any): string {
    if (data && this.jsonData) {
      for (let i = 0; i < this.jsonData.length; i++) {
        if (data.weather[0].description.includes(this.jsonData[i].type)) {
            return this.jsonData[i].icon;
        }
      }
    }
    return '';
  }
}
