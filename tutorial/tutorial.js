angular.module('example', [aol.moduleName]);

angular.module('example').controller('movingFeatureController', function () {
    var _this = this;
    _this.featureLongitude = 4.84;
    _this.featureLatitude = 45.76;

});

angular.module('example').controller('updatingFeatureStyleController', function () {
    var _this = this;
    _this.featureColor = '#FF0000';
});


angular.module('example').controller('interactionFeatureUpdateController', function () {
    var _this = this;
    _this.featureLongitude = 4.84;
    _this.featureLatitude = 45.76;
});
