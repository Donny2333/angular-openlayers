angular.module('example', [aol.moduleName])
    .controller('exampleCtrl', function (aol, $interval) {

        var _this = this;

        _this.coordinates = [];

        _this.addFeature = function () {
            coordinate = new aol.models.Coordinate();
            coordinate.attributes.x = 5 + (Math.random() - 0.5) * 5;
            coordinate.attributes.y = 45 + (Math.random() - 0.5) * 5;
            _this.coordinates.push(coordinate);
        };

        _this.removeFeature = function () {
            _this.coordinates.pop();
        }

    });
