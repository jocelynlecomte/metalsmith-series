var chai = require('chai');
var should = chai.should();
chai.use(require('chai-things'));

var Metalsmith = require('metalsmith');
var series = require('..');

describe('metalsmith-series', function() {

    it('should add serie to metadata', function(done) {
        var metalsmith = Metalsmith('test/fixtures/basic');
        metalsmith
            .use(series({
                series: {
                    'awesome-serie': {
                        title: "This is an awesome serie I made !"
                    },
                    'another-hit': {
                        title: "Another great serie !"
                    }
                }
            }))
            .build(function(err,files) {
                if (err) return done(err);

                var m = metalsmith.metadata();
                m.should.have.property("series");
                m.series.should.be.an('array').with.length(2);
                m.series.should.all.have.keys(["name", "title", "files"]);

                m.series.should.contain.an.item.with.property('name', 'awesome-serie');
                m.series.should.contain.an.item.with.property('name', 'another-hit');

                var another_hit = m.series.filter(function(element) {
                    return element.name == 'another-hit';
                })[0];
                another_hit.files.should.be.an('array').with.length(2);
                another_hit.files[0].date.should.deep.equal(new Date('2014-09-23'));
                another_hit.files[1].date.should.deep.equal(new Date('2014-10-30'));

                var awesome_serie = m.series.filter(function(element) {
                    return element.name == 'awesome-serie';
                })[0];
                awesome_serie.files.should.be.an('array').with.length(3);
                awesome_serie.files[0].date.should.deep.equal(new Date('2014-09-22'));
                awesome_serie.files[1].date.should.deep.equal(new Date('2014-09-24'));
                awesome_serie.files[2].date.should.deep.equal(new Date('2014-09-30'));

                done();
            });
    });

    it('should throw an exception if there is no configuration for the serie', function(done) {
        var metalsmith = Metalsmith('test/fixtures/basic');
        metalsmith
            .use(series({
                series: {
                }
            }))
            .build(function(err,files) {
                should.exist(err);
                err.message.should.contain("Series plugin: Couldn't find serie");
                done();
            });

    });

    it('should use the custom serie name property', function(done) {
        var metalsmith = Metalsmith('test/fixtures/customseriename');
        metalsmith
            .use(series({
                series: {
                    'awesome-serie': {
                        title: "This is an awesome serie I made !"
                    }
                },
                serieNameProperty: 'nameoftheserie'
            }))
            .build(function(err,files) {
                if (err) return done(err);

                var m = metalsmith.metadata();

                m.series.should.contain.an.item.with.property('name', 'awesome-serie');
   
                var awesome_serie = m.series[0];
                awesome_serie.files.should.be.an('array').with.length(1);

                done();
            });
    });

    it('should use the custom sort-by property', function(done) {
        var metalsmith = Metalsmith('test/fixtures/customsortby');
        metalsmith
            .use(series({
                series: {
                    'awesome-serie': {
                        title: "This is an awesome serie I made !"
                    }
                },
                sortByProperty: 'title'
            }))
            .build(function(err,files) {
                if (err) return done(err);

                var m = metalsmith.metadata();

                m.series.should.contain.an.item.with.property('name', 'awesome-serie');
   
                var awesome_serie = m.series[0];
                awesome_serie.files.should.be.an('array').with.length(2);
                awesome_serie.files[0].title.should.deep.equal('first one');
                awesome_serie.files[1].title.should.deep.equal('second one');

                done();
            });
    });

    it('should reverse the sort', function(done) {
        var metalsmith = Metalsmith('test/fixtures/customsortby');
        metalsmith
            .use(series({
                series: {
                    'awesome-serie': {
                        title: "This is an awesome serie I made !"
                    }
                },
                sortByProperty: 'title',
                reverse: true
            }))
            .build(function(err,files) {
                if (err) return done(err);

                var m = metalsmith.metadata();

                m.series.should.contain.an.item.with.property('name', 'awesome-serie');
   
                var awesome_serie = m.series[0];
                awesome_serie.files.should.be.an('array').with.length(2);
                awesome_serie.files[0].title.should.deep.equal('second one');
                awesome_serie.files[1].title.should.deep.equal('first one');

                done();
            });
    });
});
