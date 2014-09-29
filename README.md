#metalsmith-series

A metalsmith plugin to create series of articles. Any file containing the `seriename` metadata will be associated to the serie matching the value of the property. If a file contains this metadata and no matching serie could be found, it will throw an error.

## Installation

    $ npm install metalsmith-series


## Configuration
You have to pass a configuration object containing the following properties:
- a `series` object (mandatory). This `series` object maps the series names to another object which wraps the series properties. A serie can have no properties at all, but usually you'll want to add any other informations you'd like to put in the page (user-friendly name for the serie, image, github repository, ...).the names of all the series you have.
- `serieNameProperty` (optional): the name of the property that the plugin will search for in the files metadata. The default value is `seriename`.
- `sortByProperty` (optional): the name of the property that the plugin will use to sort the files of the serie. The default value is `date`.
- `reverse` (optional): will the sort be ascending (default value), or descending.

### Examples

Very simple configuration object:

{
    series: {
        'awesome-serie': {
            title: "This is an awesome serie I made !"
        },
        'another-hit': {
            title: "Another great serie !"
        }
    }
}

More complete configuration object: 

{
    series: {
        'awesome-serie': {
            title: "This is an awesome serie I made !",
            repo: "https://github.com/me/awesome-serie",
            summary: "In this serie I'll show you something awesome."
        },
        'another-hit': {
            title: "Another great serie !",
            repo: "https://github.com/me/another-hit",
            summary: "Me again to write something very special."
        }
    },
    serieNameProperty: 'nameoftheserie',
    sortByProperty: 'pubdate',
    reverse: true
}

## CLI Usage

  Install via npm and then add the `metalsmith-series` key to your `metalsmith.json` plugins.

```json
{
  "plugins": {
    "metalsmith-series": {
        "series": {
            "awesome-serie": {
                "title": "This is an awesome serie I made !"
            },
            "another-hit": {
                "title": "Another great serie !"
            }
        }
    }
  }
}
```

## Javascript Usage

  Pass the options to `Metalsmith#use`:

```js
var metadata = require('metalsmith-series');

metalsmith.use(series({
    series: {
        'awesome-serie': {
            title: "This is an awesome serie I made !"
        },
        'another-hit': {
            title: "Another great serie !"
        }
    }
}));
```

## License

  MIT
