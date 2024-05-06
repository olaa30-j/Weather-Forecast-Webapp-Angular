import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeatherComponent } from './weather/weather.component';
import { DateComponent } from './date/date.component';
import { DaysForecastComponent } from './days-forecast/days-forecast.component';
import { HourlyForecastComponent } from './hourly-forecast/hourly-forecast.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface IWeatherData {
  name: string;
  main: {
    feels_like: number;
    humidity: number;
    pressure: number;
    temp: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
  wind: {
    speed: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
  coord: {
    lon: number;
    lat: number;
  };
  dt: number
}

export interface IDailyWeather {
  list: {
    weather: {
      main: string;
      description: string;
    }[];
    dt_txt: string;
    main: {
      temp_max: number;
    };
    wind: {
      speed: number;
    };
  }[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    WeatherComponent,
    DateComponent,
    DaysForecastComponent,
    HourlyForecastComponent,
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent implements OnInit {
  title = 'weather-forecast-angular';
  apiKey = '910d3e2ec9a3a7d5e37016ab1a7dbdd3';
  apiBase = 'https://api.openweathermap.org/data/2.5/';
  darkMode?: boolean;
  search?: string;
  sunriseTimeString?: string;
  sunsetTimeString?: string;
  weatherData: IWeatherData | null = null;
  dailyData: IDailyWeather | null = null;
  jsonData: any;

  setToggle(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('dark_mode', this.darkMode ? 'dark' : 'light');
  }

  setMode(): void {
    const mode = localStorage.getItem('dark_mode');
    this.darkMode = mode === 'dark';
  }

  ngOnInit(): void {
    this.setMode();
    this.getWeatherAtCurrentLocation();
    this.fetchJsonData();
  }

  constructor(private http:HttpClient) {}

  calcSun(data:IWeatherData):void{
    if(data){
    const sunriseTimestamp = data?.sys?.sunrise * 1000;
    const sunsetTimestamp = data?.sys?.sunset * 1000;
    const sunriseDate = new Date(sunriseTimestamp);
    const sunsetDate = new Date(sunsetTimestamp);
    this.sunriseTimeString = sunriseDate.toLocaleTimeString();
    this.sunsetTimeString = sunsetDate.toLocaleTimeString();
    }
  }

  getWeatherAtCurrentLocation(): void {
    navigator.geolocation.getCurrentPosition((pos: any) => {
      const { latitude, longitude } = pos.coords;
      fetch(`${this.apiBase}weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.apiKey}`)
        .then(response => response.json())
        .then((data: IWeatherData) => {
          this.weatherData = data;
          this.calcSun(data);
          if(data.coord){
            this.handleForecastWeather(data.coord.lat, data.coord.lon);
          }
        });
    });
  }

  handleForecastWeather (lat: number, lon: number): void{
    fetch(`${this.apiBase}forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Not found');
      }
      return response.json();
    })
    .then((data: IDailyWeather) => {
      this.dailyData = data;
    })
    .catch((err: Error) => {
      console.log("Error fetching weather data:", err);
    });
  }

  handleSubmit(cityName: string): void {
    fetch(`${this.apiBase}weather?q=${cityName}&units=metric&APPID=${this.apiKey}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Not found');
        }
        return response.json();
      })
      .then((data: IWeatherData) => {
        this.weatherData = data;
        this.calcSun(data);
        if(data.coord){
          this.handleForecastWeather(data.coord.lat, data.coord.lon);
        }
      })
      .catch((err: Error) => {
        console.log("Error fetching weather data:", err);
      });
  }

  fetchJsonData(): void {
    this.http.get<any>('assets/weatherImages.json').subscribe(
      (data) => {
        this.jsonData = data;
      },
      (error) => {
        console.error('Error fetching JSON data:', error);
      }
    );
  }

}
