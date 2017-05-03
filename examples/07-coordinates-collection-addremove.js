angular.module('example', [aol.moduleName])
    .controller('exampleCtrl', function (aol) {

        var _this = this;

        _this.coordinates = [];

        _this.addCoordinate = function () {
            var coordinate;


            coordinate = new aol.models.Coordinate();
            coordinate.attributes.x = 5 + (Math.random() - 0.5) * 5;
            coordinate.attributes.y = 45 + (Math.random() - 0.5) * 5;
            _this.coordinates.push(coordinate);
        };

        _this.removeCoordinate = function () {
            _this.coordinates.pop();
        }

    });