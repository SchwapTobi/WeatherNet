// @ts-ignore
import * as CAPITALS from '../../assets/data/capitals.json';
import {WeatherRequest} from "./weather";
import {Storage} from "@ionic/storage";

export class WeatherLoader {
  capitalWeatherData: Array<any> = [];

  constructor(private storage: Storage) {
    //set capitalWeatherData
    this.loadWeather();
  }

  //load weather data for capital cities
  loadWeather() {
    let capitals = CAPITALS;
    //iterate over all capitals
    for (let capital of capitals) {
      let temp = new WeatherRequest(capital, this.storage);
      this.capitalWeatherData.push(temp);
     // console.log(this.capitalWeatherData)
    }
  }
}
