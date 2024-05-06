import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AppComponent, IDailyWeather } from '../app.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-days-forecast',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './days-forecast.component.html',
  styleUrl: './days-forecast.component.css'
})

export class DaysForecastComponent implements OnChanges {
  @Input() dailyData?: IDailyWeather | null;
  days?: any;
  jsonData?: any;

  constructor(public appComponent: AppComponent) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dailyData'] && changes['dailyData'].currentValue) {
      this.dailyData = this.appComponent.dailyData;
      this.getWeather();
      this.jsonData = this.appComponent.jsonData;
    }
  }

  getWeather(): void {
    const week = this.dailyData?.list.filter((_, index) => [0, 8, 16, 24, 32].includes(index));
    this.days = week || [];
  }

  getWeatherImage(data: any): string {
    if (data && this.jsonData) {
      for (let i = 0; i < this.jsonData.length; i++) {
        if (data.weather[0].description.includes(this.jsonData[i].type)) {
            return this.jsonData[i].icon
        }
      }
    }
    return '';
  }

}
