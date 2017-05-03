/**
 * This namespace contains helper functions for the Projection directive.
 * @namespace
 */
aol.helpers.coordinate = {};

/**
 * Returns the projection that the map uses.
 * @param {Object[]} controllers - coordinate directive's controller dependencies.
 * @returns {ol.proj.ProjectionLike|ol.proj.Projection|undefined} - projection used by the map view.
 */
aol.helpers.coordinate.determineMapProjection = function(controllers) {
    var aolMapController;
    var aolViewInstance;

    aolMapController = controllers[controllers.length - 1];
    aolViewInstance = aolMapController.getView();
    if (angular.isObject(aolViewInstance)) {
        return aolViewInstance.getProjection();
    } else {
        return undefined;
    }
};

/**
 * Updates the coordinate attribute of a directive given its controller.
 * @param {object} controller
 * @param {ol.Coordinate|number[]} coordinate
 */
aol.helpers.coordinate.updateCoordinate = function(controller, coordinate){
    switch (controller.name){
        case 'aolGeometryCircle':
            controller.setCenter(coordinate);
            break;
        case 'aolGeometryPoint':
            controller.setCoordinates(coordinate);
            break;
        case 'aolOverlay':
            controller.setPosition(coordinate);
            break;
        case 'aolView':
            controller.setCenter(coordinate);
            break;
        case 'aolCollectionCoordinate':
            break;
        default:
            aol.log.error('aol.helpers.coordinate.update on ' + controller.name + ' unsupported');
            break;
    }
};
/**
 * Compute the projected coordinate in a reference projection system.
 * @param {number[]} coordinate
 * @param {ol.proj.ProjectionLike|ol.proj.Projection|undefined} projection
 * @param {ol.proj.ProjectionLike|ol.proj.Projection|undefined} referenceProjection
 * @returns {number[]} projectedCoordinate - coordinate projected in the reference projection system.
 */
aol.helpers.coordinate.computeProjectedCoordinate = function(coordinate, projection, referenceProjection) {
    var projectionCode;
    var referenceProjectionCode;
    var projectedCoordinate;

    projectionCode = angular.isDefined(projection) ? projection.getCode() : 'EPSG:3857';
    referenceProjectionCode = angular.isDefined(referenceProjection) ? referenceProjection.getCode() : 'EPSG:3857';
    if (projectionCode !== referenceProjectionCode) {
        projectedCoordinate = ol.proj.transform(coordinate, projectionCode, referenceProjectionCode);
    } else {
        projectedCoordinate = coordinate;
    }
    return projectedCoordinate;
};

/**
 *
 * @param {Object} parentCtrl
 * @param {{x:number, y:number, projection:(ol.proj.Projection|undefined)}} attributes
 * @param {string[]} controllers
 */
aol.helpers.coordinate.setParentCoordinate = function(parentCtrl, attributes, controllers) {
    var projection;
    var mapProjection;
    var coordinate;
    var projectedCoordinate;

    coordinate = [parseFloat(attributes.x), parseFloat(attributes.y)];
    projection = attributes.projection;
    mapProjection = aol.helpers.coordinate.determineMapProjection(controllers);
    projectedCoordinate = aol.helpers.coordinate.computeProjectedCoordinate(coordinate, projection, mapProjection);

    /* update parent coordinate */
    aol.helpers.coordinate.updateCoordinate(parentCtrl, projectedCoordinate);
};

/**
 *
 * @param {Object} parentCtrl
 * @param {{x:number, y:number, projection:(ol.proj.Projection|undefined)}} instance
 * @param {string[]} controllers
 */
aol.helpers.coordinate.onParentController = function(parentCtrl, instance, controllers) {
    var onParentChange;
    aol.helpers.coordinate.setParentCoordinate(parentCtrl, instance, controllers);

    switch(parentCtrl.name){
        case 'aolGeometryPoint':
            onParentChange = function(event){
                var projection;
                var mapProjection;
                var projectedCoordinate;

                projection = instance.projection;
                mapProjection = aol.helpers.coordinate.determineMapProjection(controllers);
                projectedCoordinate = aol.helpers.coordinate.computeProjectedCoordinate(event.target.getCoordinates(),
                    mapProjection, projection);
                instance.x = projectedCoordinate[0];
                instance.y = projectedCoordinate[1];
            };
            parentCtrl.setCallbacks({'change':onParentChange});
            break;
        case 'aolView':
            onParentChange = function(event){
                var projection;
                var mapProjection;
                var projectedCoordinate;

                projection = instance.projection;
                mapProjection = aol.helpers.coordinate.determineMapProjection(controllers);
                projectedCoordinate = aol.helpers.coordinate.computeProjectedCoordinate(event.target.getCenter(),
                    mapProjection, projection);
                instance.x = projectedCoordinate[0];
                instance.y = projectedCoordinate[1];
            };
            parentCtrl.setCallbacks({'change:center':onParentChange});
            break;
        default:
            break;
    }
};

/**
 * update the directive's parent on coordinate change
 * @param {string[]} u1_ - unused
 * @param {string[]} u2_ - unused
 * @param {Object} scope - directive's scope
 * @param {Object} u3_ - unused
 * @param {Object} parentCtrl
 * @param {string[]} controllers
 */
aol.helpers.coordinate.updateParentOnModelChange = function(u1_, u2_, scope, u3_, parentCtrl, controllers) {
    aol.helpers.coordinate.setParentCoordinate(parentCtrl, scope.model.attributes, controllers);
};

/**
 * ol.Coordinate is a redefinition of an array containing two numbers. There isn't an ol.Coordinate instance as such
 * as found in other directives. To keep our directives design consistent, we create a dummy instance which
 * point to the model attributes.
 * @namespace
 */
aol.overrides.coordinate = {};

/**
 * Coordinate instance constructor.
 *
 * @constructor
 */
aol.overrides.coordinate.Coordinate = (function() {
    function Dummy(attributes) {
        return attributes;
    }
    return Dummy;
})();

/**
 * Coordinate model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(number|undefined)} attributes.x                      - horizontal component.
 * @property {(number|undefined)} attributes.y                      - vertical component.
 * @property {(ol.proj.Projection|undefined)} attributes.projection   - coordinate system.
 *
 */
aol.models.Coordinate = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.x = undefined;
    this.attributes.y = undefined;
    this.attributes.projection = undefined;
    this.typeConverters.x = Number;
    this.typeConverters.y = Number;
    this.watchers['[x,y]'] = aol.helpers.coordinate.updateParentOnModelChange;
};

/**
 * Coordinate directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.Coordinate = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolCoordinate';
    this.require = ['?^aolCollectionCoordinate','?^aolGeometryCircle', '?^aolGeometryLinearring',
        '?^aolGeometryLinestring', '?^aolGeometryMultilinestring', '?^aolGeometryMultipoint', '?^aolGeometryPoint',
        '?^aolGeometryPolygon', '?^aolOverlay', '?^aolView', '^^aolMap'];
    this.instance = aol.overrides.coordinate.Coordinate;
    this.model = aol.models.Coordinate;
    this.onParentController = aol.helpers.coordinate.onParentController;
    this.onParentInstance = function(parentInst, instance, parentController) {
        switch(parentController.name){
            case 'aolCollectionCoordinate':
                parentInst.push(instance);
                break;
            case 'aolGeometryPoint':
                break;
            default:
                break;
        }
    };
    this.onDestroy = function(parentInst, instance, parentController) {
        switch(parentController.name){
            case 'aolCollectionCoordinate':
                parentInst.remove(instance);
                break;
            default:
                break;
        }
    };
};

aol.registerDirective(new aol.directives.Coordinate());

