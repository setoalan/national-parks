# national-parks

This is a personal project created in Angular 1.x displaying information about all 59 United States National Parks operated by the National Park Service. Information is provided by the [NPS API](https://www.nps.gov/subjects/digital/nps-data-api.htm) and [Foursquare API](https://developer.foursquare.com/) and Images are from [Flickr API](https://www.flickr.com/services/api/) and maps from [Google Maps API](https://developers.google.com/maps/documentation/javascript/).

## Installation

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com).


Clone repository and install all dependencies including `devDependencies` with:

```sh
$ npm install
```

## Usage

Start local Express server with:

```sh
$ npm start
```

Go to `localhost:3000` in your browser to view the app. Make sure in the [`app.js` file on line 29 and 37](https://github.com/setoalan/national-parks/blob/master/app.js#L29), that the project is being served from the `app` folder instead of the `dist` build folder.

## Tests

Get a Selenium Server running to run Protractor tests with:

```sh
$ webdriver-manager start
```

Run both Karma and Protractor tests, with the Selenum Server running in the background, with:

```sh
$ npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
