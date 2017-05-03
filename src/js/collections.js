/** @namespace */
aol.models.collections = {};

/** @namespace */
aol.overrides.collections = {};

/** @namespace */
aol.helpers.collections = {};


/** @namespace */
aol.helpers.collections.coordinate = {};


/**
 *
 * @param {Object} parentCtrl
 * @param {{x:number, y:number, projection:(ol.proj.Projection|undefined)}} attributes
 * @param {string[]} controllers
 */
aol.helpers.collections.coordinate.setParentCoordinate = function(parentCtrl, attributes, controllers) {
    var projection;
    var mapProjection;
    var coordinate;
    var coordinates;
    var projectedCoordinate;

    coordinates = [];
    mapProjection = aol.helpers.coordinate.determineMapProjection(controllers);
    angular.forEach(attributes['coordinates'], function(coord){
        coordinate = [parseFloat(coord.x), parseFloat(coord.y)];
        projection = coord.projection;
        projectedCoordinate = aol.helpers.coordinate.computeProjectedCoordinate(coordinate, projection, mapProjection);
        coordinates.push(projectedCoordinate);
    });
    /* update parent coordinate */
    parentCtrl.setCoordinates(coordinates);
};


/**
 * Style collection instance constructor.
 *
 * @constructor
 */
aol.overrides.collections.Style = (function() {
    function Dummy(attributes) {
        return attributes;
    }
    return Dummy;
})();


/**
 * Coordinate collection instance constructor.
 *
 * @constructor
 */
aol.overrides.collections.Coordinate = (function() {
    function Dummy(attributes) {
        if(angular.isDefined(attributes['coordinates'])){
            /**
             * Removes a coordinate from the collection
             * @param {ol.Coordinate} coordinate
             */
            attributes['coordinates'].remove = function(coordinate){
                this.splice(this.indexOf(coordinate),1);
            };
        }
        return attributes['coordinates'];
    }
    return Dummy;
})();


/**
 * interactions collection instance constructor.
 *
 * @constructor
 */
aol.overrides.collections.Interaction = (function() {
    function Dummy(attributes) {
        if(angular.isDefined(attributes['interactions'])){
            /**
             * Removes an interaction from the collection
             * @param {ol.Interaction} interaction
             */
            attributes['interactions'].remove = function(interaction){
                this.splice(this.indexOf(interaction),1);
            };
        }
        return attributes['interactions'];
    }
    return Dummy;
})();

/**
 * layers collection instance constructor.
 *
 * @constructor
 */
aol.overrides.collections.Layer = (function() {
    function Dummy(attributes) {
        /**
         * Removes a layer from the collection
         * @param {ol.Layer} layer
         */
        attributes['layers'].remove = function(layer){
            this.splice(this.indexOf(layer),1);
        };
        return attributes['layers'];
    }
    return Dummy;
})();



/**
 * Style Collection model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(ol.Collection|undefined)} attributes  - styles.
 */
aol.models.collections.Style = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes['styles'] = new ol.Collection();
};

/**
 * Coordinates Collection model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(ol.Coordinate[]|undefined)} attributes.coordinates  - coordinates.
 */
aol.models.collections.Coordinate = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes['coordinates'] = [];
    this.watchers['coordinates']  = function(u1_, u2_, scope, u3_, parentCtrl, controllers) {
        aol.helpers.collections.coordinate.setParentCoordinate(parentCtrl, scope.model.attributes, controllers);
    };
};

/**
 * Interaction Collection model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(ol.Collection|undefined)} attributes.interactions  - interactions.
 */
aol.models.collections.Interaction = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.interactions = new ol.Collection();
    this.callbacks['change'] = undefined;
    this.callbacks['add'] = function(event, instance, instanceController, parentController, controllers){
        var aolMapController;
        var aolMapInteractions;

        aolMapController = controllers[controllers.length -1];
        aolMapInteractions = aolMapController.getInteractions();
        if(instance !== aolMapInteractions){
            aolMapInteractions.push(event.element);
        }
    };
    this.callbacks['remove'] = function(event, instance, instanceController, parentController, controllers){
        var aolMapController;
        var aolMapInteractions;

        aolMapController = controllers[controllers.length -1];
        aolMapInteractions = aolMapController.getInteractions();
        if(instance !== aolMapInteractions){
            aolMapInteractions.remove(event.element);
        }
    };
};

/**
 * Style Collection model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(ol.Collection|undefined)} attributes  - styles.
 */
aol.models.collections.Layer = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes['layers'] = new ol.Collection();
    this.callbacks['change'] = undefined;
    this.callbacks['add'] = undefined;
    this.callbacks['remove'] = undefined;
};

/**
 * Style directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.CollectionStyle = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolCollectionStyle';
    this.require = ['?^aolFeature', '?^aolLayerVector'];
    this.instance = aol.overrides.collections.Style;
    this.model = aol.models.collections.Style;
    this.onParentInstance = function(parentInst, instance) {parentInst.setStyle(instance);};
};

/**
 * Style collection directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.CollectionCoordinate = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolCollectionCoordinate';
    this.require = ['?^aolGeometryLinearring', '?^aolGeometryLinestring', '?^aolGeometryMultipoint',
                    '?^aolGeometryPolygon', '?^aolView', '^^aolMap'];
    this.instance = aol.overrides.collections.Coordinate;
    this.model = aol.models.collections.Coordinate;
    this.onParentController = function(parentCtrl, instance, controllers){
        aol.helpers.collections.coordinate.setParentCoordinate(parentCtrl, instance, controllers);
    };
};

/**
 * Interaction collection directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.CollectionInteraction = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolCollectionInteraction';
    this.require = ['?^aolLayerVector', '?^aolCollectionLayer', '^aolMap'];
    this.instance = aol.overrides.collections.Interaction;
    this.model = aol.models.collections.Interaction;
    this.onParentController = function(parentCtrl, instance, controllers){
        var aolMapController;
        var aolMapInteractions;

        aolMapController = controllers[controllers.length -1];
        aolMapInteractions = aolMapController.getInteractions();
        if(angular.isDefined(aolMapInteractions)){
            aolMapInteractions.extend(instance);
        }else{
            aolMapController.setInteractions(instance);
        }
    };
};

/**
 * Style directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.CollectionLayer = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolCollectionLayer';
    this.require = ['^aolMap'];
    this.instance = aol.overrides.collections.Layer;
    this.model = aol.models.collections.Layer;
    this.onParentInstance = function(parentInst, instance) {
        parentInst.getLayers().extend(instance.getArray());
    };
};


aol.registerDirective(new aol.directives.CollectionStyle());
aol.registerDirective(new aol.directives.CollectionCoordinate());
aol.registerDirective(new aol.directives.CollectionInteraction());
aol.registerDirective(new aol.directives.CollectionLayer());
