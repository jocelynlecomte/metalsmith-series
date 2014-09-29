var debug = require('debug')('metalsmith-series');

/**
 * Expose `plugin`.
 */

module.exports = plugin;


/**
 * Metalsmith plugin to group posts into series.
 *
 * @param {Object} config
 * @return {Function}
 */

function plugin(config) {
    config = normalize(config);
    var straightSortFunction = function(a, b) {
        a = a[config.sortByProperty];
        b = b[config.sortByProperty];
        if (!a && !b) return 0;
        if (!a) return -1;
        if (!b) return 1;
        if (b > a) return -1;
        if (a > b) return 1;
        return 0;
    }
    var sortFunction;

    if (config.reverse) {
        sortFunction = function(a, b) {
            return -straightSortFunction(a, b);
        }
    }
    else {
        sortFunction = straightSortFunction;
    }

    return function(files, metalsmith, done) {
        var metadata = metalsmith.metadata();
        metadata.series = [];

        function findSerieInMetadata(serieName) {
            for (var i = 0; i < metadata.series.length; i++) {
                var serie = metadata.series[i];
                if (serie.name === serieName) {
                    return serie;
                }
            }
            return undefined;          
        }

        function initializeSerie(fileObject, serieConfig) {
            function copyProperties(src, dest) {
                Object.keys(src).forEach(function (property) {
                    dest[property] = src[property];
                });
            }

            var serie = {};
            serie.name = fileObject[config.serieNameProperty];
            copyProperties(serieConfig, serie);
            serie.files = [fileObject];
            metadata.series.push(serie);

            return serie;
        }

        for (var file in files) {
            debug('checking file %s, searching for property %s', file, config.serieNameProperty);
            var fileObject = files[file];
            var serieName = fileObject[config.serieNameProperty];
            if (serieName) {
                var serie = findSerieInMetadata(serieName);
                if (!serie) {
                    debug('creating serie %s', serieName);
                    var serieConfig = config.series[serieName];
                    if (serieConfig === undefined) {
                        return done(new Error("Series plugin: Couldn't find serie " + serieName + " in plugin configuration."));
                    }  
                    serie = initializeSerie(fileObject, serieConfig);
                }
                else {
                    debug('adding file %s to serie %s', file, serieName);
                    serie.files.push(fileObject);
                }
                fileObject.serie = serie; 
            }
        }

        metadata.series.forEach(function(serie) {
            debug("sorting serie %s", serie);
            serie.files.sort(sortFunction);
        });

        done();
    };

    /**
     * Normalize a config argument.
     *
     * @param {Object} config
     * @return {Object}
     */

    function normalize(config){
        config = config || {};
        config.serieNameProperty = config.serieNameProperty || "seriename";
        config.sortByProperty = config.sortByProperty || "date";
        config.reverse = config.hasOwnProperty("reverse")? config.reverse : false;

        return config;
    }
}