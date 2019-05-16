import {NetLocation} from "../position/location";


export class Weather {

  location: NetLocation;
  forecast: Array<any>;
  sunInfo: any; // contains sunrise & -set time
  getJSON = function (url, callback) {
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
  private key: String = "9c50c2dcd31a37bd9eb6bc8955b4000e";
  private url: String;

  constructor(location: NetLocation) {
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

  async getForecast(url: String) {
    var _this = this;
    this.getJSON(url, function (err, data) {
      if (err !== null) {
        console.log('Something went wrong: ' + err);
      } else {
        _this.forecast = data.list;
        console.log("forecast log:");
        console.log(_this.forecast);
        console.log("forecast log end");
      }
    });
  }

  async getSun(url: String) {
    var _this = this;
    this.getJSON(url, function (err, data) {
      if (err !== null) {
        console.log('Something went wrong: ' + err);
      } else {
        console.log("data sun:");
        _this.sunInfo = data.sys;
        console.log(_this.sunInfo);
        console.log("data sun end");
      }
    });
  }
}
