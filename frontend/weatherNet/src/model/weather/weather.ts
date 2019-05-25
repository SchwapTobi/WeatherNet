import {NetLocation} from "../position/location";
import {CONSTANTS} from "../../app/appConstants";
import {Storage} from "@ionic/storage";

export class WeatherRequest {

  location: NetLocation;
  forecast: Array<any> = [];

  sunInfo: any; // contains sunrise & -set time

  private getJSON = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
  };
  private key: String = CONSTANTS.OPENWEATHER_KEY;
  private url: String;

  constructor(location: NetLocation, private storage: Storage) {
    this.location = location;

    if (this.location.longitude != 0.0 && this.location.latitude != 0.0) {
      this.getForecast(this.getRequestUrlByLatLong(this.location.latitude, this.location.longitude));
      this.getSun(this.getSunsetAndSunriseByLatLong(this.location.latitude, this.location.longitude));
    } else {
      this.getForecast(this.getRequestUrlByZip(this.location.zipCode));
      this.getSun(this.getSunsetAndSunriseByZip(this.location.zipCode));
    }
  }

  getRequestUrlByZip(zip: String): String {
    return 'https://api.openweathermap.org/data/2.5/forecast?zip=' + zip + ',at&units=metric&appid=' + this.key;
  }

  getRequestUrlByLatLong(lat: number, long: number): String {
    return 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + long + '&units=metric&appid=' + this.key;
  }

  getSunsetAndSunriseByLatLong(lat: number, long: number): String {
    return 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&units=metric&appid=' + this.key;
  }

  getSunsetAndSunriseByZip(zip: String): String {
    return 'https://api.openweathermap.org/data/2.5/weather?zip=' + zip + ',at&units=metric&appid=' + this.key;
  }

  getForecast(url: String) {
    var _this = this;
    this.getJSON(url, function (err, data) {
      if (err !== null) {
        console.log('Something went wrong: ' + err);
      } else {
        for (let item of data.list) {
          _this.forecast.push(item);
        }
        _this.storage.set('currentWeatherIn'+_this.location.name, _this.forecast[0]);
        _this.storage.set('forecastWeatherIn'+_this.location.name, _this.forecast);
      }
    });

  }

  getSun(url: String) {
    var _this = this;
    this.getJSON(url, function (err, data) {
      if (err !== null) {
        console.log('Something went wrong: ' + err);
      } else {
        _this.sunInfo = data.sys;
      }
    });
  }

  getWeather() {
    return this.forecast[0];
  }
}
