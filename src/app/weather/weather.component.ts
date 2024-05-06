import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppComponent, IWeatherData } from '../app.component';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})

export class WeatherComponent implements OnChanges{
  @Input() weatherData?:IWeatherData | null;
  @Input() sunriseTimeString?: string;
  @Input() sunsetTimeString?:string;
  weatherDescription?: string;
  jsonData?: any;
  weatherImage?: any;

  constructor(public appComponent:AppComponent ){}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['weatherData'] && changes['weatherData'].currentValue) {
      this.weatherDescription = this.appComponent.weatherData?.weather[0].description;
      this.jsonData = this.appComponent.jsonData;
      this.getWeatherImage()
    }
  }

  getWeatherImage():void{
    if(this.weatherDescription && this.jsonData){
      for (let i = 0; i < this.jsonData.length; i++) {
        if (this.weatherDescription.includes(this.jsonData[i].type)) {
          this.weatherImage = this.jsonData[i].icon;
        }
      }
    }
  }
}

