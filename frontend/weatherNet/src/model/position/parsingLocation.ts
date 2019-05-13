import {CONSTANTS} from "../../app/appConstants";

export class ParsingLocation {
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
  private lat: number;
  private long: number;
  private zip: string;
  private city: string;
  private state: string;
  private country: string;

  constructor(zip: string, city: string) {
    this.zip = zip;
    this.city = city;
    this.country = "AT";
    this.setPositions();
  }

  setPositions() {
    let key = CONSTANTS.GEOCODEXYZ_KEY;

    let url = 'https://geocode.xyz/' + this.zip + '+' + this.city + '?region=AT;json=1&auth=' + key;

    var _this = this;
    return this.getJSON(url, function (err, data) {
      if (err !== null) {
        console.log('Something went wrong: ' + err);
      } else {
        //if match is not deterministic
        if (data.alt != null && data.alt.loc != null) {
          console.log('[WARNING] several geo data found.. choosing the closest..')
          //sometimes confidence is too low, look for the right postal address
          console.log(data.alt);
          for (let item of data.alt.loc) {
            if (item.postal == _this.zip) {
              console.log('[SUCCESS] found data')
              _this.long = item.longt;
              _this.lat = item.latt;
              _this.setState(_this.zip);
              console.log(_this.toString());
              return;
            }
          }

        } else {  //if there is only one city / zip code in the response
          console.log('[SUCCESS] found data')
          // console.log(data)
          _this.long = data.longt;
          _this.lat = data.latt;
          _this.setState(_this.zip);
          console.log(_this.toString());
        }
      }
    });
  }

  setState(plz: string) {
    let url = 'assets/plz.json';
    var _this = this;
    return this.getJSON(url,
      function (err, data) {
        if (err !== null) {
          console.log('Something went wrong: ' + err);
        } else {
          console.log('..searching for zip code')
          for (let item of data.data) {
            if (item.plz == plz) {
              _this.state = _this.getStateName(item.bundesland);
              // _this.exportJson(JSON.stringify(_this));
              console.log(_this);
              return;
            }
          }
        }
      });
  }

  getStateName(bl: any): string {
    switch (bl) {
      case 'B':
        return "Burgenland";
      case 'K':
        return "Kärnten";
      case 'N':
        return "Niederösterreich";
      case 'O':
        return "Oberösterreich";
      case 'Sa':
        return "Salzburg";
      case 'St':
        return "Steiermark";
      case 'T':
        return "Tirol";
      case 'V':
        return "Vorarlberg";
      case 'W':
        return "Wien";

    }
  }

  saveTextAsFile(data) {
    var filename = JSON.parse(data).zip + '_' + JSON.parse(data).city + '.json'
    var blob = new Blob([data], {type: 'text/plain'}),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a')
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    }
    else {
      e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
      e.initEvent('click', true, false);
      a.dispatchEvent(e);
    }
  }


}

