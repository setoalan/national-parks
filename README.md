# national-parks

This is a personal project created in Angular 1.x displaying information about all 59 United States National Parks operated by the National Park Service. Park information is provided by the [NPS API](https://www.nps.gov/subjects/digital/nps-data-api.htm) and [Foursquare API](https://developer.foursquare.com/), images from [Flickr API](https://www.flickr.com/services/api/), maps from [Google Maps API](https://developers.google.com/maps/documentation/javascript/), and weather data from [OpenWeatherMap API](http://openweathermap.org/).

## Installation

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com).


Clone repository and install all dependencies including `devDependencies` with:

```sh
$ npm install
```

Set the environment variables in the provided `.sample.env` files and rename it to '.env'.

## Usage

Start local Express server with:

```sh
$ npm start
```

Open your browswer to `localhost:3000` to view the app. Make sure in the [`app.js` file on line 29 and 37](https://github.com/setoalan/national-parks/blob/master/app.js#L29), the project is being served from the `app` folder instead of the `dist` build folder.

## Tests

Get a Selenium Server running to run Protractor tests with:

```sh
$ webdriver-manager start
```

Run both Karma and Protractor tests, with the Selenum Server and local node server running in the background, with:

```sh
$ npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
