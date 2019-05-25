export class WeatherUTIL {

  static getColorFromTemp(temp: number) {
    let color;
    if (temp >= 30) {
      color = "#8b0000";
    } else if (temp >= 25) {
      color = "#ff4500";
    } else if (temp >= 20) {
      color = "#ffa500";
    } else if (temp >= 15) {
      color = "#ffff00";
    } else if (temp >= 10) {
      color = "#a8cb66";
    } else if (temp >= 5) {
      color = "#ddeebe";
    } else if (temp >= 0) {
      color = "#d1e0f1";
    } else if (temp >= -5) {
      color = "#99c4f5";
    } else if (temp >= -10) {
      color = "#99a7f5";
    } else if (temp >= -15) {
      color = "#455acd";
    } else if (temp >= -20) {
      color = "#a05ede";
    } else if (temp >= -25) {
      color = "#8322de";
    } else if (temp >= -30) {
      color = "#36115a";
    } else {
      color = "#1d0a30";
    }
    return color;
  }
}
