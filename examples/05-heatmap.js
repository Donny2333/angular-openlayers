angular.module('example', [aol.moduleName])
    .controller('exampleCtrl', function (aol) {

        var _this = this;

        _this.measures = [];

        _this.addMeasure = function () {
            var coordinate = new aol.models.Coordinate();
            coordinate.attributes.x = 5.79 + (Math.random() - 0.5) * 0.1;
            coordinate.attributes.y = 45.2 + (Math.random() - 0.5) * 0.1;
            var feature = new aol.models.Feature();
            feature.attributes.weight = Math.random();
            var measure = {
                feature: feature,
                coordinate: coordinate,
                radius: 20 * feature.attributes.weight
            };
            _this.measures.push(measure);
        };


        for (var i = 0; i < 10; i++) {
            _this.addMeasure();
        }
    });


