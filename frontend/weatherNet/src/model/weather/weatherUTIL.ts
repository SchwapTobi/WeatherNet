export class WeatherUTIL {

  static getColorFromTemp(temp: number) {
    let color;
    if (temp >= 30) {
      color = "#8b0000";
    } else if (temp >= 27.5) {
      color = "#E40000";
    } else if (temp >= 25) {
      color = "#ff4500";
    } else if (temp >= 22.5) {
      color = "#FF6F00";
    } else if (temp >= 20) {
      color = "#ffa500";
    } else if (temp >= 17.5) {
      color = "#FFCD00";
    } else if (temp >= 15) {
      color = "#ffff00";
    } else if (temp >= 12.5) {
      color = "#CDFF00";
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

  //return icon of current weather
  static getIconForWeather(weatherAttribute: String): String {
    var name = "sunny";
    switch (weatherAttribute) {
      case "clear sky":
        name = "sunny";
        break;
      case "few clouds":
        name = "partly-sunny";
        break;
      case "scattered clouds":
        name = "cloudy";
        break;
      case "overcast clouds":
        name = "cloudy";
        break;
      case "broken clouds":
        name = "cloudy";
        break;
      case "shower rain":
        name = "rainy";
        break;
      case "rain":
        name = "rainy";
        break;
      case "light rain":
        name = "rainy";
        break;
      case "thunderstorm":
        name = "flash";
        break;
      case "snow":
        name = "snow";
        break;
      case "mist":
        name = "cloudy";
        break;
    }
    return name;
  }

  //return icon color of current weather
  static getIconColorForWeather(weatherAttribute: String): String {
    var color = "#FFF59D";
    switch (weatherAttribute) {
      case "clear sky":
        color = "#4FC3F7";
        break;
      case "few clouds":
        color = "#78909C";
        break;
      case "scattered clouds":
        color = "#78909C";
        break;
      case "overcast clouds":
        color = "#78909C";
        break;
      case "broken clouds":
        color = "#78909C";
        break;
      case "shower rain":
        color = "#616161";
        break;
      case "rain":
        color = "#616161";
        break;
      case "light rain":
        color = "#616161";
        break;
      case "thunderstorm":
        color = "#616161";
        break;
      case "snow":
        color = "#E1F5FE";
        break;
      case "mist":
        color = "#E1F5FE";
        break;
    }
    return color;
  }

  //return matching background video
  static getVideoTheme(weatherAttribute: String): String {
    var url = "assets/video/sun_cloudy.mp4";
    switch (weatherAttribute) {
      case "clear sky":
        url = "assets/video/sun.mp4";
        break;
      case "few clouds":
        url = "assets/video/sun_cloudy.mp4";
        break;
      case "scattered clouds":
        url = "assets/video/clouds.mp4";
        break;
      case "overcast clouds":
        url = "assets/video/clouds.mp4";
        break;
      case "broken clouds":
        url = "assets/video/clouds_2.mp4";
        break;
      case "shower rain":
        url = "assets/video/rain_heavy.mp4";
        break;
      case "rain":
        url = "assets/video/rain.mp4";
        break;
      case "light rain":
        url = "assets/video/rain.mp4";
        break;
      case "thunderstorm":
        url = "assets/video/lightning.mp4";
        break;
      case "snow":
        url = "assets/video/snow.mp4";
        break;
      case "mist":
        url = "assets/video/fog.mp4";
        break;
    }
    return url;
  }
}
