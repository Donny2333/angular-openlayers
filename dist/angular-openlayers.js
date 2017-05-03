/*! angular-openlayers - v1.0.0 - 2016-05-09
* http://quentinlampin.github.io/angular-openlayers/
* Copyright (c) 2016 Orange; Licensed MPL-2.0 */


(function(undefined) {

/**
 * This namespace contains all of the AngularOpenlayers librairy, i.e. the directives, their models, and helper
 * functions.
 * @namespace
 */
var aol = {};
/**
 *
 * @const {string} librairy prefix
 */
aol.name = 'aol';
/**
 * Angular module name, i.e. the name to import in order to use the library.
 * @const {string}
 */
aol.moduleName = 'angular-openlayers';

/**
 * Librairie's Angular module
 * @type {angular.module}
 */
aol.module = angular.module(aol.moduleName, []);
/**
 * Librairie's Angular service
 * @type {angular.module.factory}
 */
aol.module.factory(aol.name, function(){
    return {
        models: aol.models,
        helpers: aol.helpers
    };
});

/**
 * aol logging function and defines
 * @namespace
 */
aol.log = {};

/**
 * aol logging switches
 * @property {boolean} info - wether or not logging info messages
 * @property {boolean} debug - wether or not logging debug messages
 * @property {boolean} warning - wether or not logging warning messages
 * @property {boolean} error - wether or not logging error messages
 */
aol.log.switches = {
    info: false,
    debug: false,
    warning: true,
    error: true
};

/**
 * Librairie's info logging function. Outputs to the console.
 */
aol.log.info = function(){
    if(aol.log.switches.info){console.info(arguments);}
};

/**
 * Librairie's debug logging function. Outputs to the console.
 */
aol.log.debug = function(){
    if(aol.log.switches.debug){console.debug(arguments);}
};

/**
 * Librairie's warning logging function. Outputs to the console.
 */
aol.log.warning = function(){
    if(aol.log.switches.warning){console.warn(arguments);}
};

/**
 * Librairie's error logging function. Outputs to the console.
 */
aol.log.error = function(){
    if(aol.log.switches.error){console.error(arguments);}
};


/**
 * This namespace contains the directive model constructors.
 * Those models have two purposes:
 *   - when used as an attribute of a directive, a model allow the developper to progragmatically configure
 *     the underlying OpenLayers instance.
 *   - when a directive is declared without a model attribute, a model is built internally to store given attributes.
 *
 * @namespace
 */
aol.models = {};

/**
 * Model base skeleton.
 * @class
 * @property {object} attributes        - attributes passed to the OpenLayers constructor.
 * @property {object} typeConverters    - attribute type converters.
 * @property {object} watchers          - angular scope watchers.
 * @property {object} callbacks     - callbacks passed to the 'on' function of the OpenLayers instance, undocumented.
 */
aol.models.Model = function Model(){
    this.attributes = {};
    this.typeConverters = {};
    this.watchers = {};
    this.callbacks = {};
};

/**
 * This namespace contains instance constructors overrides.
 * Those overrides are used to cope with the inconsistency of OpenLayers instance constructors: while most constructors
 * signatures exhibit a single parameter which contains the instance configuration options, i.e. Object literal, some
 * have multiple parameters; i.e. configuration options are defined in the signature.
 * Those overrides level the differences such that all instance constructors show the same signature:
 * function instanceConstructor(attributes){...}.
 *
 * @namespace
 */
aol.overrides = {};

/**
 * This namespace contains helper function that are often reused in directives.
 * The intent of storing them here is to keep the code 'DRY' (as in Don't Repeat Yourself).
 *
 * @namespace
 */
aol.helpers = {};

/**
 * Directive skeleton.
 * @class
 * @property {string} name                              - directive's name.
 * @property {string[]} require                         - list of controllers names on which the directive depends.
 * @property {boolean} transclude                       - does the directive use transclusion?
 * @property {boolean} replace                          - does the directive replace its content?
 * @property {(string|undefined)}  template               - template if applicable (transclude set to 'true').
 * @property {function} instance                        - OpenLayers instance constructor.
 * @property {function} model                           - directive's model constructor.
 * @property {(function|undefined)} onPreInstance         - called during directive link, called prior to 'instance'.
 * @property {(function|undefined)} onParentController    - called after 'instance' on the directive's parent controller.
 * @property {(function|undefined)} onParentInstance      - called after 'instance' on the directive's parent instance.
 * @property {(function|undefined)} onDestroy             - called when the directive's scope is destroyed.
 */
aol.Directive = function Directive(){
    this.name = '';
    this.require = [];
    this.transclude = false;
    this.replace = false;
    this.template = undefined;
    this.instance = function(){};
    this.model = function(){};
    this.onPreInstance = undefined;
    this.onParentController = undefined;
    this.onParentInstance = undefined;
    this.onDestroy = undefined;
};
/**
 * This namespace contains the directives
 * @namespace */
aol.directives = {};

/**
 * This function register an AngularOpenLayers directive against Angular.
 *
 * @param {aol.Directive} directive - directive to be registered.
 */
aol.registerDirective = function(directive) {
    /** @type {Object} */
    var scope;
    /** @type {string[]} */
    var require;
    /** @type {boolean} */
    var transclude;
    /** @type {boolean} */
    var replace;
    /** @type {string} */
    var template;
    /** @type {function} */
    var controller;
    /** @type {function} */
    var link;
    var model;

    aol.log.info('aol.registerDirective: ', directive);

    scope = {model: '=?' + aol.name + 'Model'};
    require = [directive.name];
    transclude = directive.transclude;
    replace = directive.replace;
    template = directive.template;
    model = new directive.model();

    angular.forEach(model.attributes, function(value, key) {
        scope[key] = '=?' + aol.name + key.charAt(0).toUpperCase() + key.slice(1);
    });

    angular.forEach(directive.require, function(req) {
        require.push(req);
    });


    controller = function Controller($scope, $parse, $q, $timeout) {
        var _this = this;
        var deferred_ = $q.defer();
        var callbacks_ = {};
        /**
         * controller directive's name
         * @type{string}
         */
        _this.name = directive.name;
        _this.getPromise = function() {
            return deferred_.promise;
        };
        _this.resolvePromise_ = function(instance) {
            deferred_.resolve(instance);
        };

        _this.setCallbacks = function(callbacks) {
            _this.getPromise().then(function(instance) {
                _this.setCallbacks_(callbacks, instance);
            });
        };

        _this.setCallbacks_ = function(callbacks, instance, instanceController, parentController, controllers) {
            var callbackID;
            var callbackFunctionWrapper;

            if (angular.isObject(callbacks)) {
                aol.log.debug('setting callbacks on ', instance, '('+_this.name+'): ', callbacks);
                angular.forEach(callbacks, function(callback, callbackName) {
                    if (angular.isFunction(callback)) {
                        callbackFunctionWrapper = function(event){
                            $timeout(function(){
                                callback(event, instance, instanceController, parentController, controllers);
                            });
                        };
                        callbackID = instance.on(callbackName, callbackFunctionWrapper);
                        callbacks_[callbackName] = callbackID;
                    }
                });
            }
        };

        _this.removeCallbacks_ = function() {
            angular.forEach(callbacks_, function(callbackID) { ol.Observable.unByKey(callbackID);});
        };
        _this.setWatchers_ = function(watchers, instanceController, parentController, controllers) {
            if (angular.isObject(watchers)) {
                angular.forEach(watchers, function(watchFunction, watchExpression) {
                    var parsedWatchExpression;
                    var watchExpressionFunction;
                    var watchFunctionWrapper;
                    parsedWatchExpression = $parse(watchExpression);
                    watchExpressionFunction = function() {
                        return parsedWatchExpression($scope.model.attributes);
                    };
                    watchFunctionWrapper = function(newValue, oldValue, scope) {
                        watchFunction(newValue, oldValue, scope, instanceController, parentController, controllers);
                    };
                    $scope.$watch(watchExpressionFunction, watchFunctionWrapper, true);
                });
            }
        };
        angular.forEach(model.attributes, function(value, key) {
            var optionUpperCasedName = key.charAt(0).toUpperCase() + key.slice(1);
            _this['set' + optionUpperCasedName] = function(value) {
                aol.log.debug(directive.name + '\'s controller method:  ' + 'set' + optionUpperCasedName +
                    ' called with value: ', value);
                $scope[key] = value;
                if (angular.isDefined($scope.model) && angular.isDefined($scope.model.attributes)) {
                    $scope.model.attributes[key] = value;
                }
            };
            _this['get' + optionUpperCasedName] = function() {
                aol.log.debug(directive.name + '\'s controller method:  ' + 'get' + optionUpperCasedName + ' called');
                if (angular.isDefined($scope.model) && angular.isDefined($scope.model.attributes)) {
                    return $scope.model.attributes[key];
                } else {
                    return $scope[key];
                }
            };
        });
    };
    link = function(scope, element, attrs, controllers) {
        var instanceController;
        var parentController;
        var instance;
        /* retrieve instance controller and parent controller */
        instanceController = controllers[0];
        for (var i = 1; i < controllers.length; i++) {
            /**
             * here we parse the controllers (starting at index 1 to exclude the instance controller)
             * until we find a non-null controller. This is necessary as dependencies can be optional,
             * e.g. ['instanceCtrl','?^parent1Ctrl', '?^parent2Ctrl'] which resolves in a controller triplet
             * where positions 2 or 3 may be null.
             */
            parentController = controllers[i];
            if (angular.isObject(parentController)) {
                break;
            }
        }
        /* if a onPreInstance is provided, call it right now */
        if (angular.isFunction(directive.onPreInstance)) {
            aol.log.debug(directive.name + ' calling pre instance function: ', directive.onPreInstance);
            directive.onPreInstance(scope, element, attrs, controllers);
        }
        /**
         *  in case ol-model is not provided, i.e. scope.model is undefined, build an empty
         *  model whose values will be supplanted by other bound values or included directives
         *  via parentInstMethod.
         */
        if (!angular.isObject(scope.model)) {
            scope.model = new directive.model();
        }

        angular.forEach(scope.model.attributes, function(value, key) {
            /**
             * when a value is specified, set the corresponding model attribute and watchers
             */
            if (angular.isDefined(scope[key])) {
                scope.model.attributes[key] = scope[key];
                scope.$watch(key, function(){
                    scope.model.attributes[key] = scope[key];
                });
                scope.$watch(function(){return scope.model.attributes[key];}, function(){
                    if(scope.model.attributes[key] !== scope[key]){
                        scope[key] = scope.model.attributes[key];
                    }
                });
            }
        });
        aol.log.debug(directive.name + ' building instance with: ', scope.model);
        instance = new directive.instance(scope.model.attributes);
        aol.log.debug(directive.name + ' instance: ', instance, ' built with: ', scope.model.attributes);
        instanceController.resolvePromise_(instance);
        instanceController.setCallbacks_(scope.model.callbacks, instance, instanceController, parentController, controllers);
        instanceController.setWatchers_(scope.model.watchers, instanceController, parentController, controllers);

        if (angular.isFunction(directive.onParentController)) {
            aol.log.debug(directive.name + ' calling onParentController ', directive.onParentController,
                'on:  ', parentController);
            directive.onParentController(parentController, instance, controllers);
        }
        /**
         * if a parentInstFunction is provided, get a promise on the parent instance then
         * call the parentInstFunction.
         */
        if (angular.isFunction(directive.onParentInstance)) {
            aol.log.debug(directive.name + ' requiring a promise on: ', parentController.name);
            parentController.getPromise().then(function(parentInstance) {
                aol.log.debug(directive.name + ' calling parent instance function: ', directive.onParentInstance,
                'on parentInstance: ', parentInstance);
                directive.onParentInstance(parentInstance, instance, parentController, controllers);
            });
        }
        /**
         * if the model is destroyed, update the OpenLayer objects accordingly.
         */
        scope.$on('$destroy', function() {
            if (angular.isFunction(directive.onDestroy)) {
                aol.log.debug(directive.name + ' requiring a promise on: ', parentController.name);
                parentController.getPromise().then(function(parentInstance) {
                    aol.log.debug(directive.name + 'calling destroy function: ', directive.onDestroy);
                    directive.onDestroy(parentInstance, instance, parentController, controllers);
                });
            }
            instanceController.removeCallbacks_();
        });
    };
    aol.module.directive(directive.name, function() {
       return {
            restrict: 'E',
            require: require,
            transclude: transclude,
            replace: replace,
            template: template,
            scope: scope,
            controller: controller,
            link: link
        };
    });
};

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

/**
 * Map model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(ol.Collection|undefined)} attributes.controls      - default controls.
 * @property {(ol.Collection|undefined)} attributes.interactions  - default interactions.
 * @property {(ol.Collection|undefined)} attributes.layers        - default layers (none).
 * @property {(ol.Collection|undefined)} attributes.logo          - default logo (the OpenLayers logo).
 * @property {(ol.Collection|undefined)} attributes.overlays      - default overlays (none).
 * @property {(ol.RendererType|undefined)} attributes.renderer    - default renderer (browser dependent, usually Canvas).
 * @property {(ol.View|undefined)} attributes.view                - default view (world map, centered on lat:0, lon:0).
 */
aol.models.Map = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.controls = [];
    this.attributes.interactions = undefined;
    this.attributes.layers = undefined;
    this.attributes.logo = undefined;
    this.attributes.overlays = undefined;
    this.attributes.renderer = undefined;
    this.attributes.target = undefined;
    this.attributes.view = new ol.View({center: [0, 0], zoom: 1});
    this.callbacks['change'] = undefined;
    this.callbacks['change:layerGroup'] = undefined;
    this.callbacks['change:size'] = undefined;
    this.callbacks['change:target'] = undefined;
    this.callbacks['change:view'] = undefined;
    this.callbacks['click'] = undefined;
    this.callbacks['dblclick'] = undefined;
    this.callbacks['moveend'] = undefined;
    this.callbacks['pointermove'] = undefined;
    this.callbacks['propertychange'] = undefined;
    this.callbacks['singleclick'] = undefined;
};

/**
 * Map directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.Map = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolMap';
    this.transclude = true;
    this.replace = true;
    this.template = '<div class="aol-fill" ng-transclude></div>';
    this.instance = ol.Map;
    this.model = aol.models.Map;
    this.onPreInstance = function(scope, element) {
        scope.target = element[0];
    };
};

aol.registerDirective(new aol.directives.Map());

/** @namespace */
aol.models.interactions = {};

/**
 * This namespace contains helper functions for the interaction directives.
 * @namespace
 */
aol.helpers.interactions = {};

/**
 * Select interaction model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(function|undefined)} attributes.addCondition         - A function that takes an ol.MapBrowserEvent and
 *                                                                    returns a boolean to indicate whether that event
 *                                                                    should be handled. By default,
 *                                                                    this is ol.events.condition.never.
 *                                                                    Use this if you want to use different events
 *                                                                    for add and remove instead of toggle.
 * @property {(number|undefined)} attributes.condition              - A function that takes an ol.MapBrowserEvent and
 *                                                                    returns a boolean to indicate whether that event
 *                                                                    should be handled. This is the event for the
 *                                                                    selected features as a whole. By default, this is
 *                                                                    ol.events.condition.singleClick. Clicking on a
 *                                                                    feature selects that feature and removes any that
 *                                                                    were in the selection. Clicking outside any
 *                                                                    feature removes all from the selection. See
 *                                                                    toggle, add, remove options for adding/removing
 *                                                                    extra features to/ from the selection.
 * @property {(number|undefined)} attributes.layers                 - A list of layers from which features should be
 *                                                                    selected. Alternatively, a filter function can be
 *                                                                    provided. The function will be called for each
 *                                                                    layer in the map and should return true for layers
 *                                                                    that you want to be selectable. If the option is
 *                                                                    absent, all visible layers will be considered
 *                                                                    selectable. Required.
 * @property {(number|undefined)} attributes.style                  - Style for the selected features.
 *                                                                    By default the default edit style is used.
 * @property {(number|undefined)} attributes.removeCondition        - A function that takes an ol.MapBrowserEvent and
 *                                                                    returns a boolean to indicate whether that event
 *                                                                    should be handled. By default, this is
 *                                                                    ol.events.condition.never. Use this if you want
 *                                                                    to use different events for add and remove
 *                                                                    instead of toggle.
 * @property {(boolean|undefined)} attributes.toggleCondition       - A function that takes an ol.MapBrowserEvent and
 *                                                                    returns a boolean to indicate whether that event
 *                                                                    should be handled. This is in addition to the
 *                                                                    condition event. By default,
 *                                                                    ol.events.condition.shiftKeyOnly, i.e. pressing
 *                                                                    shift as well as the condition event, adds that
 *                                                                    feature to the current selection if it is not
 *                                                                    currently selected, and removes it if it is.
 *                                                                    See add and remove if you want to use different
 *                                                                    events instead of a toggle.
 * @property {(ol.Extent|undefined)} attributes.multi               - A boolean that determines if the default behaviour
 *                                                                    should select only single features or all
 *                                                                    (overlapping) features at the clicked map
 *                                                                    position. Default is false i.e single select
 * @property {(number|undefined)} attributes.features               - Collection where the interaction will place
 *                                                                    selected features. Optional. If not set the
 *                                                                    interaction will create a collection. In any case
 *                                                                    the collection used by the interaction is returned
 *                                                                    by ol.interaction.Select#getFeatures. Required.
 * @property {(number|undefined)} attributes.filter                 - A function that takes an ol.Feature and an
 *                                                                    ol.layer.Layer and returns true if the feature may
 *                                                                    be selected or false otherwise.
 * @property {(number|undefined)} attributes.wrapX                  - Wrap the world horizontally on the selection
 *                                                                    overlay. Default is true.
 */
aol.models.interactions.Select = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.addCondition = undefined;
    this.attributes.condition = undefined;
    this.attributes.layers = undefined;
    this.attributes.style = undefined;
    this.attributes.removeCondition = undefined;
    this.attributes.toggleCondition = undefined;
    this.attributes.multi = undefined;
    this.attributes.features = undefined;
    this.attributes.filter = undefined;
    this.attributes.wrapX = undefined;
    this.callbacks['change'] = undefined;
    this.callbacks['change:active'] = undefined;
    this.callbacks['propertychange'] = undefined;
    this.callbacks['select'] = undefined;
};

/**
 * Pointer interaction model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(function|undefined)} attributes.handleDownEvent  - Function handling "down" events. If the function
 *                                                                returns true then a drag sequence is started.
 * @property {(function|undefined)} attributes.handleDragEvent  - Function handling "drag" events. This function is
 *                                                                called on "move" events during a drag sequence.
 * @property {(function|undefined)} attributes.handleEvent      - Function called by the map to notify the interaction
 *                                                                that a browser event was dispatched to the map.
 *                                                                The function may return false to prevent the
 *                                                                propagation of the event to other interactions in
 *                                                                the map's interactions chain.
 * @property {(function|undefined)} attributes.handleMoveEvent  - Function handling "move" events. This function is
 *                                                                called on "move" events, also during a drag sequence
 *                                                                (so during a drag sequence both the handleDragEvent
 *                                                                function and this function are called).
 * @property {(function|undefined)} attributes.handleUpEvent    - Function handling "up" events. If the function returns
 *                                                                false then the current drag sequence is stopped.
 */
aol.models.interactions.Pointer = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.handleDownEvent = undefined;
    this.attributes.handleDragEvent = undefined;
    this.attributes.handleEvent = undefined;
    this.attributes.handleMoveEvent = undefined;
    this.attributes.handleUpEvent = undefined;
    this.callbacks['change'] = undefined;
    this.callbacks['change:active'] = undefined;
    this.callbacks['propertychange'] = undefined;
};

/**
 * Translate interaction model class.
 *
 * @class
 * @augments aol.models.interactions.Pointer
 * @property {(ol.Collection|undefined)} attributes.features    - features to translate.
 *
 */
aol.models.interactions.Translate = function() {
    aol.models.interactions.Pointer.apply(this, arguments);
    this.attributes.features = undefined;
    this.callbacks['change'] = undefined;
    this.callbacks['change:active'] = undefined;
    this.callbacks['propertychange'] = undefined;
    this.callbacks['translateend'] = undefined;
    this.callbacks['translatestart'] = undefined;
    this.callbacks['translating'] = undefined;
};

/**
 * Defaults interactions model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(boolean|undefined)} attributes.altShiftDragRotate  - Whether Alt-Shift-drag rotate is desired.
 *                                                                   Default is true.
 * @property {(boolean|undefined)} attributes.doubleClickZoom     - Whether double click zoom is desired.
 *                                                                   Default is true.
 * @property {(boolean|undefined)} attributes.keyboard            - Whether keyboard interaction is desired.
 *                                                                  Default is true.
 * @property {(function|undefined)} attributes.mouseWheelZoom     - Whether mousewheel zoom is desired. Default is true.
 * @property {(function|undefined)} attributes.shiftDragZoom      - Whether Shift-drag zoom is desired. Default is true.
 * @property {(function|undefined)} attributes.dragPan            - Whether drag pan is desired. Default is true.
 * @property {(function|undefined)} attributes.pinchRotate        - Whether pinch rotate is desired. Default is true.
 * @property {(function|undefined)} attributes.pinchZoom          - Whether pinch zoom is desired. Default is true.
 * @property {(number|undefined)} attributes.zoomDelta            - zoom delta.
 * @property {(number|undefined)} attributes.zoomDuration         - zoom duration.
 *
 */
aol.models.interactions.Defaults = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.altShiftDragRotate = undefined;
    this.attributes.doubleClickZoom = undefined;
    this.attributes.keyboard = undefined;
    this.attributes.mouseWheelZoom = undefined;
    this.attributes.shiftDragZoom = undefined;
    this.attributes.dragPan = undefined;
    this.attributes.pinchRotate = undefined;
    this.attributes.pinchZoom = undefined;
    this.attributes.zoomDelta = undefined;
    this.attributes.zoomDuration = undefined;
};


/**
 * InteractionSelect directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.InteractionSelect = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolInteractionSelect';
    this.require = ['?^aolInteractionTranslate','^aolCollectionInteraction', '^?aolLayerVector', '^?aolCollectionLayer'];
    this.replace = true;
    this.instance = ol.interaction.Select;
    this.model = aol.models.interactions.Select;
    this.onParentController = function(parentController, instance, controllers){
        var collectionInteractionController;
        var targetController;

        /* retrieve the CollectionInteraction controller */
        collectionInteractionController = controllers[2];

        switch(parentController.name){
            case 'aolInteractionTranslate':
                parentController.setFeatures(instance.getFeatures());
                break;
            default:
                aol.log.error(this.name + '\'s parent is invalid: ', parentController.name);
                break;
        }

        collectionInteractionController.getPromise().then(function(collectionInstance){
            collectionInstance.push(instance);
        });

        /**
         * The interaction select either applies to a layerVector, a CollectionLayer controller or the whole map.
         * (called targetController). When both layerVector and CollectionLayer are found in the ancestors list
         * (require list), the LayerVector is chosen.
         **/
        if(controllers[3]){
            targetController = controllers[3];
            targetController.getPromise().then(function(targetLayer){
                instance.layerFilter_ = function(layer){
                    return (layer === targetLayer);
                };
            });
        }else if(controllers[4]){
            targetController = controllers[4];
            targetController.getPromise().then(function(targetLayers){
                instance.layerFilter_ = function(layer){
                    return (layer in targetLayers.getArray());
                };
            });
        }
    };
    this.onDestroy = function(parentInst, instance, parentController) {
        switch(parentController.name){
            case 'aolCollectionInteraction':
                parentInst.remove(instance);
                break;
            default:
                break;
        }
    };
};

/**
 * InteractionTranslate directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.InteractionTranslate = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolInteractionTranslate';
    this.require = ['^aolCollectionInteraction'];
    this.replace = true;
    this.instance = ol.interaction.Translate;
    this.model = aol.models.interactions.Translate;
    this.onParentInstance = function(parentInst, instance) {
        parentInst.push(instance);
    };
    this.onDestroy = function(parentInst, instance) {
        parentInst.remove(instance);
    };
};

/**
 * InteractionDefaults directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.InteractionDefaults = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolInteractionDefaults';
    this.require = ['^aolCollectionInteraction'];
    this.replace = true;
    this.instance = ol.interaction.defaults;
    this.model = aol.models.interactions.Defaults;
    this.onParentInstance = function(parentInst, instance) {
        instance.forEach(function(interaction){
            parentInst.push(interaction);
        });
    };
};

aol.registerDirective(new aol.directives.InteractionSelect());
aol.registerDirective(new aol.directives.InteractionTranslate());
aol.registerDirective(new aol.directives.InteractionDefaults());

/** @namespace */
aol.models.controls = {};

/**
 * This namespace contains helper functions for the layers directives.
 * @namespace
 */
aol.helpers.controls = {};

/**
 * Control base model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(Element|undefined)} attributes.element               - element.
 * @property {(function|undefined)} attributes.render               - render.
 * @property {(Element|string|undefined)} attributes.target         - target.
 */
aol.models.controls.Control = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.element = undefined;
    this.attributes.render = undefined;
    this.attributes.target = undefined;
    this.callbacks['change'] = undefined;
    this.callbacks['propertychange'] = undefined;
};

/**
 * Attribution control model class.
 *
 * @class
 * @augments aol.models.controls.Control
 * @property {(string|undefined)} attributes.className                  - CSS class name.
 * @property {(boolean|undefined)} attributes.collapsible               - control collapsible?
 * @property {(boolean|undefined)} attributes.collapsed                 - control collapsed?
 * @property {(string|undefined)} attributes.tipLabel                   - text label to use for the tip button.
 * @property {(string|Node|undefined)} attributes.label                 - tip button label.
 * @property {(string|Node|undefined)} attributes.collapseLabel         - label of the expanded attributions button.
 */
aol.models.controls.Attribution = function() {
    aol.models.controls.Control.apply(this, arguments);
    this.attributes.className = undefined;
    this.attributes.collapsible = undefined;
    this.attributes.collapsed = undefined;
    this.attributes.tipLabel = undefined;
    this.attributes.label = undefined;
    this.attributes.collapseLabel = undefined;
};

/**
 * FullScreen control model class.
 *
 * @class
 * @augments aol.models.controls.Control
 * @property {(string|undefined)} attributes.className                  - CSS class name.
 * @property {(string|Node|undefined)} attributes.label                 - label.
 * @property {(string|Node|undefined)} attributes.labelActive           - label when active.
 * @property {(string|undefined)} attributes.tipLabel                   - text label to use for the tip button.
 * @property {(boolean|undefined)} attributes.keys                      - full keyboard access?
 */
aol.models.controls.FullScreen = function() {
    aol.models.controls.Control.apply(this, arguments);
    this.attributes.className = undefined;
    this.attributes.label = undefined;
    this.attributes.labelActive = undefined;
    this.attributes.tipLabel = undefined;
    this.attributes.keys = undefined;
};

/**
 * MousePosition control model class.
 *
 * @class
 * @augments aol.models.controls.Control
 * @property {(string|undefined)} attributes.className                              - CSS class name.
 * @property {(ol.CoordinateFormatType | undefined)} attributes.coordinateFormat    - coordinate format.
 * @property {(ol.proj.ProjectionLike|undefined)} attributes.projection             - projection
 * @property {(string|undefined)} attributes.undefinedHTML                          - markup for undefined coordinates.
 */
aol.models.controls.MousePosition = function() {
    aol.models.controls.Control.apply(this, arguments);
    this.attributes.className = undefined;
    this.attributes.coordinateFormat = undefined;
    this.attributes.projection = undefined;
    this.attributes.undefinedHTML = undefined;
    this.callbacks['change:coordinateFormat'] = undefined;
    this.callbacks['change:projection'] = undefined;
};

/**
 * OverviewMap control model class.
 *
 * @class
 * @augments aol.models.controls.Control
 * @property {(boolean|undefined)} attributes.collapsed                 - control collapsed?
 * @property {(string|Node|undefined)} attributes.collapseLabel         - label of the expanded attributions button.
 * @property {(boolean|undefined)} attributes.collapsible               - control collapsible?
 * @property {(string|Node|undefined)} attributes.label                 - label for the collapsed overviewmap button.
 * @property {(!ol.layer.Layer[]|ol.Collection | undefined)} attributes.layers  - layers.
 * @property {(string|undefined)} attributes.tipLabel                           - text label to use for the tip button.
 */
aol.models.controls.OverviewMap = function() {
    aol.models.controls.Control.apply(this, arguments);
    this.attributes.collapsed = undefined;
    this.attributes.collapseLabel = undefined;
    this.attributes.collapsible = undefined;
    this.attributes.label = undefined;
    this.attributes.layers = undefined;
    this.attributes.tipLabel = undefined;
};

/**
 * Rotate control model class.
 *
 * @class
 * @augments aol.models.controls.Control
 * @property {(string|undefined)} attributes.className                  - CSS class name.
 * @property {(string|Node|undefined)} attributes.label                 - text label to use for the rotate button.
 * @property {(string|undefined)} attributes.tipLabel                   - text label to use for the tip button.
 * @property {(number|undefined)} attributes.duration                   - animation duration in milliseconds.
 * @property {(boolean|undefined)} attributes.autoHide                  - auto hide control.
 */
aol.models.controls.Rotate = function() {
    aol.models.controls.Control.apply(this, arguments);
    this.attributes.className = undefined;
    this.attributes.label = undefined;
    this.attributes.tipLabel = undefined;
    this.attributes.duration = undefined;
    this.attributes.autoHide = undefined;
};

/**
 * ScaleLine control model class.
 *
 * @class
 * @augments aol.models.controls.Control
 * @property {(string|undefined)} attributes.className                          - CSS class name.
 * @property {(string|Node|undefined)} attributes.minWidth                      - text label for the rotate button.
 * @property {(ol.control.ScaleLineUnits|string|undefined)} attributes.units    - units.
 */
aol.models.controls.ScaleLine = function() {
    aol.models.controls.Control.apply(this, arguments);
    this.attributes.className = undefined;
    this.attributes.minWidth = undefined;
    this.attributes.units = undefined;
};

/**
 * Zoom control model class.
 *
 * @class
 * @augments aol.models.controls.Control
 * @property {(number|undefined)} attributes.duration                   - animation duration in milliseconds.
 * @property {(string|undefined)} attributes.className                  - CSS class name.
 * @property {(string|Node|undefined)} attributes.zoomInLabel           - text label to use for the zoom-in button.
 * @property {(string|Node|undefined)} attributes.zoomOutLabel          - text label to use for the zoom-out button.
 * @property {(number|undefined)} attributes.delta                      - delta applied in-between each zoom.
 */
aol.models.controls.Zoom = function() {
    aol.models.controls.Control.apply(this, arguments);
    this.attributes.duration = undefined;
    this.attributes.className = undefined;
    this.attributes.zoomInLabel = undefined;
    this.attributes.zoomOutLabel = undefined;
    this.attributes.delta = undefined;
};

/**
 * ZoomSlider control model class.
 *
 * @class
 * @augments aol.models.controls.Control
 * @property {(string|undefined)} attributes.className                  - CSS class name.
 * @property {(number|undefined)} attributes.duration                   - animation duration in milliseconds.
 * @property {(number|undefined)} attributes.maxResolution              - max resolution.
 * @property {(number|undefined)} attributes.minResolution              - min resolution.
 */
aol.models.controls.ZoomSlider = function() {
    aol.models.controls.Control.apply(this, arguments);
    this.attributes.className = undefined;
    this.attributes.duration = undefined;
    this.attributes.maxResolution = undefined;
    this.attributes.minResolution = undefined;
};

/**
 * ZoomToExtent control model class.
 *
 * @class
 * @augments aol.models.controls.Control
 * @property {(string|undefined)} attributes.className                  - CSS class name.
 * @property {(string|Node|undefined)} attributes.label                 - text label to use for the rotate button.
 * @property {(string|undefined)} attributes.tipLabel                   - text label to use for the tip button.
 * @property {(number|undefined)} attributes.extent                     - animation duration in milliseconds.
 */
aol.models.controls.ZoomToExtent = function() {
    aol.models.controls.Control.apply(this, arguments);
    this.attributes.className = undefined;
    this.attributes.label = undefined;
    this.attributes.tipLabel = undefined;
    this.attributes.extent = undefined;
};

/**
 * Attribution control directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.ControlAttribution = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolControlAttribution';
    this.require = ['^aolMap'];
    this.instance = ol.control.Attribution;
    this.model = aol.models.controls.Attribution;
    this.onParentInstance = function(parentInst, instance) {parentInst.addControl(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeControl(instance);};
};

/**
 * Fullscreen control directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.ControlFullScreen = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolControlFullscreen';
    this.require = ['^aolMap'];
    this.instance = ol.control.FullScreen;
    this.model = aol.models.controls.FullScreen;
    this.onParentInstance = function(parentInst, instance) {parentInst.addControl(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeControl(instance);};
};

/**
 * MousePosition control directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.ControlMousePosition = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolControlMouseposition';
    this.require = ['^aolMap'];
    this.instance = ol.control.MousePosition;
    this.model = aol.models.controls.MousePosition;
    this.onParentInstance = function(parentInst, instance) {parentInst.addControl(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeControl(instance);};
};

/**
 * OverviewMap control directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.ControlOverviewMap = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolControlOverviewmap';
    this.require = ['^aolMap'];
    this.instance = ol.control.OverviewMap;
    this.model = aol.models.controls.OverviewMap;
    this.onParentInstance = function(parentInst, instance) {parentInst.addControl(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeControl(instance);};
};

/**
 * Rotate control directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.ControlRotate = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolControlRotate';
    this.require = ['^aolMap'];
    this.instance = ol.control.Rotate;
    this.model = aol.models.controls.Rotate;
    this.onParentInstance = function(parentInst, instance) {parentInst.addControl(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeControl(instance);};
};

/**
 * ScaleLine control directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.ControlScaleLine = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolControlScaleline';
    this.require = ['^aolMap'];
    this.instance = ol.control.ScaleLine;
    this.model = aol.models.controls.ScaleLine;
    this.onParentInstance = function(parentInst, instance) {parentInst.addControl(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeControl(instance);};
};

/**
 * Zoom control directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.ControlZoom = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolControlZoom';
    this.require = ['^aolMap'];
    this.instance = ol.control.Zoom;
    this.model = aol.models.controls.Zoom;
    this.onParentInstance = function(parentInst, instance) {parentInst.addControl(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeControl(instance);};
};

/**
 * ZoomSlider control directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.ControlZoomSlider = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolControlZoomslider';
    this.require = ['^aolMap'];
    this.instance = ol.control.ZoomSlider;
    this.model = aol.models.controls.ZoomSlider;
    this.onParentInstance = function(parentInst, instance) {parentInst.addControl(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeControl(instance);};
};

/**
 * ZoomToExtent control directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.ControlZoomToExtent = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolControlZoomtoextent';
    this.require = ['^aolMap'];
    this.instance = ol.control.ZoomToExtent;
    this.model = aol.models.controls.ZoomToExtent;
    this.onParentInstance = function(parentInst, instance) {parentInst.addControl(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeControl(instance);};
};

aol.registerDirective(new aol.directives.ControlAttribution());
aol.registerDirective(new aol.directives.ControlFullScreen());
aol.registerDirective(new aol.directives.ControlMousePosition());
aol.registerDirective(new aol.directives.ControlOverviewMap());
aol.registerDirective(new aol.directives.ControlRotate());
aol.registerDirective(new aol.directives.ControlScaleLine());
aol.registerDirective(new aol.directives.ControlZoom());
aol.registerDirective(new aol.directives.ControlZoomSlider());
aol.registerDirective(new aol.directives.ControlZoomToExtent());


/**
 * View model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {number[]} attributes.center                           - center (defaults to lon:0, lat:0).
 * @property {number|undefined} attributes.maxResolution            - max resolution.
 * @property {number|undefined} attributes.minResolution            - min resolution.
 * @property {number|undefined} attributes.maxZoom                  - max zoom.
 * @property {number|undefined} attributes.minZoom                  - min zoom.
 * @property {ol.proj.Projection|undefined} attributes.projection   - projection.
 * @property {number|undefined} attributes.resolution               - resolution.
 * @property {number[]|undefined} attributes.resolutions            - list of resolutions.
 * @property {number|undefined} attributes.rotation                 - view's orientation (radians).
 * @property {number} attributes.zoom                               - zoom (the bigger, the closer to the ground).
 * @property {number|undefined} attributes.zoomFactor               - zoom multiplier/divider when zooming in/out.
 * @property {function|undefined} watchers['center']                - on center attribute change, update the center.
 * @property {function|undefined} watchers['zoom']                  - on zoom attribute change, update the zoom.
 */
aol.models.View = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.center = [0, 0];
    this.attributes.maxResolution = undefined;
    this.attributes.minResolution = undefined;
    this.attributes.maxZoom = undefined;
    this.attributes.minZoom = undefined;
    this.attributes.projection = undefined;
    this.attributes.resolution = undefined;
    this.attributes.resolutions = undefined;
    this.attributes.rotation = undefined;
    this.attributes.zoom = 2;
    this.attributes.zoomFactor = undefined;
    this.watchers['center'] = function(newValue, oldValue, scope, instanceController) {
        instanceController.getPromise().then(function(instance) {instance.setCenter(newValue);});
    };
    this.watchers['zoom'] = function(newValue, oldValue, scope, instanceController) {
        instanceController.getPromise().then(function(instance) {instance.setZoom(newValue);});
    };
    this.callbacks['change:center'] = undefined;
    this.callbacks['change:resolution'] = undefined;
    this.callbacks['change:rotation'] = undefined;
    this.callbacks['propertychange'] = undefined;
};

/**
 * View directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.View = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolView';
    this.require = ['^aolMap'];
    this.instance = ol.View;
    this.model = aol.models.View;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setView(instance);};
};

aol.registerDirective(new aol.directives.View());
/** @namespace */
aol.models.layers = {};

/**
 * This namespace contains helper functions for the layers directives.
 * @namespace
 */
aol.helpers.layers = {};

/**
 * This namespace contains helper functions for the heatmap directive.
 * @namespace
 */
aol.helpers.layers.base = {};

/**
 * add layer to parent instance
 * @param parentInst
 * @param instance
 * @param parentCtrl
 */
aol.helpers.layers.base.onParentInstance = function(parentInst, instance, parentCtrl) {
    switch(parentCtrl.name){
        case 'aolCollectionLayer':
            parentInst.push(instance);
            break;
        case 'aolMap':
            parentInst.addLayer(instance);
            break;
        default:
            aol.log.error(this.name + '\' parent is invalid: ', parentCtrl.name);
            break;
    }
};

/**
 * remove instance from parent
 * @param parentInst
 * @param instance
 * @param parentCtrl
 */
aol.helpers.layers.base.onDestroy = function(parentInst, instance, parentCtrl) {
    switch(parentCtrl.name){
        case 'aolCollectionLayer':
            parentInst.remove(instance);
            break;
        case 'aolMap':
            parentInst.removeLayer(instance);
            break;
        default:
            aol.log.error(this.name + '\' parent is invalid: ', parentCtrl.name);
            break;
    }
};


/**
 * This namespace contains helper functions for the heatmap directive.
 * @namespace
 */
aol.helpers.layers.heatmap = {};


/**
 * update radius on radius attribute change
 * @param radius
 * @param u1_
 * @param u2_
 * @param instanceCtrl
 */
aol.helpers.layers.heatmap.updateRadiusOnRadiusChange = function (radius, u1_, u2_, instanceCtrl) {
    instanceCtrl.getPromise().then(function (instance) {instance.setRadius(parseFloat(radius));});
};

/**
 * Layer base model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(number|undefined)} attributes.brightness       - brightness.
 * @property {(number|undefined)} attributes.contrast         - contrast.
 * @property {(number|undefined)} attributes.hue              - hue.
 * @property {(number|undefined)} attributes.opacity          - opacity.
 * @property {(number|undefined)} attributes.saturation       - saturation.
 * @property {(boolean|undefined)} attributes.visible         - is the layer visible?.
 * @property {(ol.Extent|undefined)} attributes.extent        - extent (where the layer is shown).
 * @property {(number|undefined)} attributes.zIndex           - zIndex (highest zIndex layer is on top).
 * @property {(number|undefined)} attributes.minResolution    - min resolution.
 * @property {(number|undefined)} attributes.maxResolution    - max resolution.
 */
aol.models.layers.Layer = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.brightness = undefined;
    this.attributes.contrast = undefined;
    this.attributes.hue = undefined;
    this.attributes.opacity = undefined;
    this.attributes.saturation = undefined;
    this.attributes.visible = undefined;
    this.attributes.extent = undefined;
    this.attributes.zIndex = undefined;
    this.attributes.minResolution = undefined;
    this.attributes.maxResolution = undefined;
    this.callbacks['change'] = undefined;
    this.callbacks['change:brightness'] = undefined;
    this.callbacks['change:contrast'] = undefined;
    this.callbacks['change:extent'] = undefined;
    this.callbacks['change:hue'] = undefined;
    this.callbacks['change:maxResolution'] = undefined;
    this.callbacks['change:minResolution'] = undefined;
    this.callbacks['change:opacity'] = undefined;
    this.callbacks['change:saturation'] = undefined;
    this.callbacks['change:visible'] = undefined;
    this.callbacks['change:zIndex'] = undefined;
    this.callbacks['propertychange'] = undefined;
};

/**
 * Heatmap layer model class.
 *
 * @class
 * @augments aol.models.layers.Layer
 * @property {(string[]|undefined)} attributes.gradient    - gradient of the heatmap as CSS color strings, e.g. '#00f'
 * @property {(number|undefined)} attributes.radius        - radius.
 * @property {(number|undefined)} attributes.blur          - blur.
 * @property {(number|undefined)} attributes.shadow        - opacity.
 * @property {(number|undefined)} attributes.weight        - saturation.
 * @property {(ol.source.Vector|undefined)} attributes.source   - source.
 */
aol.models.layers.Heatmap = function() {
    aol.models.layers.Layer.apply(this, arguments);
    this.attributes.gradient = undefined;
    this.attributes.radius = 8;
    this.attributes.blur = undefined;
    this.attributes.shadow = undefined;
    this.attributes.weight = undefined;
    this.attributes.source = undefined;
    this.watchers['radius'] = aol.helpers.layers.heatmap.updateRadiusOnRadiusChange;
    this.callbacks['change:gradient'] = undefined;
    this.callbacks['change:blur'] = undefined;
    this.callbacks['change:radius'] = undefined;
    this.callbacks['postcompose'] = undefined;
    this.callbacks['precompose'] = undefined;
    this.callbacks['propertychange'] = undefined;
    this.callbacks['render'] = undefined;
};

/**
 * Image layer model class.
 *
 * @class
 * @augments aol.models.layers.Layer
 * @property {(ol.source.Image|undefined)} attributes.source  - source.
 * @property {(ol.Map|undefined)} attributes.map              - map on which the layers is overlain.
 */
aol.models.layers.Image = function() {
    aol.models.layers.Layer.apply(this, arguments);
    this.attributes.source = undefined;
    this.attributes.map = undefined;
    this.callbacks['change:source'] = undefined;
    this.callbacks['postcompose'] = undefined;
    this.callbacks['precompose'] = undefined;
    this.callbacks['propertychange'] = undefined;
    this.callbacks['render'] = undefined;
};

/**
 * Tile layer model class.
 *
 * @class
 * @augments aol.models.layers.Layer
 * @property {(ol.source.Image|undefined)} attributes.source          - source.
 * @property {(ol.Map|undefined)} attributes.map                      - map on which the layers is overlain.
 * @property {(number|undefined)} attributes.preload                  - set the layer as an overlay on map.
 * @property {(boolean|undefined)} attributes.useInterimTilesOnError  - use interim tile on load error?
 */
aol.models.layers.Tile = function() {
    aol.models.layers.Layer.apply(this, arguments);
    this.attributes.source = undefined;
    this.attributes.map = undefined;
    this.attributes.preload = undefined;
    this.attributes.useInterimTilesOnError = undefined;
    this.callbacks['change:source'] = undefined;
    this.callbacks['change:preload'] = undefined;
    this.callbacks['change:useInterimTilesOnError'] = undefined;
    this.callbacks['postcompose'] = undefined;
    this.callbacks['precompose'] = undefined;
    this.callbacks['propertychange'] = undefined;
    this.callbacks['render'] = undefined;
};

/**
 * Vector layer model class.
 *
 * @class
 * @augments aol.models.layers.Layer
 * @property {function|undefined} attributes.renderOrder        - function to order the rendering of vectors.
 * @property {(number|undefined)} attributes.renderBuffer       - number of pixels to render outside of the viewport.
 * @property {(ol.source.Vector|undefined)} attributes.source    - source.
 * @property {(ol.style.Style|ol.style.Style[]|ol.style.StyleFunction|undefined)} attributes.style    -  style.
 * @property {(ol.Map|undefined)} attributes.map                        - map on which the layers is overlain.
 * @property {(boolean|undefined)} attributes.updateWhileAnimating      - update while animating the source objects?
 * @property {(boolean|undefined)} attributes.updateWhileInteracting    - update while interacting with the map?
 */
aol.models.layers.Vector = function() {
    aol.models.layers.Layer.apply(this, arguments);
    this.attributes.renderOrder = undefined;
    this.attributes.renderBuffer = undefined;
    this.attributes.source = undefined;
    this.attributes.style = undefined;
    this.attributes.map = undefined;
    this.attributes.updateWhileAnimating = undefined;
    this.attributes.updateWhileInteracting = undefined;
    this.callbacks['change:source'] = undefined;
    this.callbacks['postcompose'] = undefined;
    this.callbacks['precompose'] = undefined;
    this.callbacks['propertychange'] = undefined;
    this.callbacks['render'] = undefined;
};



/**
 * LayerHeatmap directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.LayerHeatmap = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolLayerHeatmap';
    this.require = ['?^aolCollectionLayer', '^aolMap'];
    this.replace = true;
    this.instance = ol.layer.Heatmap;
    this.model = aol.models.layers.Heatmap;
    this.onParentInstance = aol.helpers.layers.base.onParentInstance;
    this.onDestroy = aol.helpers.layers.base.onDestroy;
};

/**
 * LayerImage directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.LayerImage = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolLayerImage';
    this.require = ['?^aolCollectionLayer', '^aolMap'];
    this.replace = true;
    this.instance = ol.layer.Image;
    this.model = aol.models.layers.Image;
    this.onParentInstance = aol.helpers.layers.base.onParentInstance;
    this.onDestroy = aol.helpers.layers.base.onDestroy;
};

/**
 * LayerTile directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.LayerTile = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolLayerTile';
    this.require = ['?^aolCollectionLayer', '^aolMap'];
    this.replace = true;
    this.instance = ol.layer.Tile;
    this.model = aol.models.layers.Tile;
    this.onParentInstance = aol.helpers.layers.base.onParentInstance;
    this.onDestroy = aol.helpers.layers.base.onDestroy;
};

/**
 * LayerVector directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.LayerVector = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolLayerVector';
    this.require = ['?^aolCollectionLayer', '^aolMap'];
    this.replace = true;
    this.instance = ol.layer.Vector;
    this.model = aol.models.layers.Vector;
    this.onParentInstance = aol.helpers.layers.base.onParentInstance;
    this.onDestroy = aol.helpers.layers.base.onDestroy;
};

aol.registerDirective(new aol.directives.LayerHeatmap());
aol.registerDirective(new aol.directives.LayerImage());
aol.registerDirective(new aol.directives.LayerTile());
aol.registerDirective(new aol.directives.LayerVector());

/**
 * Overlay model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(Element|undefined)} attributes.element                             - element to overlay on the map.
 * @property {(number[]|undefined)} attributes.offset                             - position offset of the overlay.
 * @property {(ol.Coordinate|undefined)} attributes.position                      - position.
 * @property {(ol.OverlayPositioning|string|undefined)} attributes.positioning    - positioning, e.g. 'center-center'.
 * @property {(boolean|undefined)} attributes.stopEvent                           - stop event propagation?
 * @property {(boolean|undefined)} attributes.insertFirst                         - inserted in first position?
 * @property {(ol.Extent|undefined)} attributes.autoPan                           - autoPan the map on setPosition?
 * @property {(olx.animation.PanOptions|undefined)} attributes.autoPanAnimation   - autoPan animation.
 * @property {(number|undefined)} attributes.autoPanMargin                        - margin around overlay on auto-pan.
 */
aol.models.Overlay = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.element = undefined;
    this.attributes.offset = undefined;
    this.attributes.position = undefined;
    this.attributes.positioning = undefined;
    this.attributes.stopEvent = undefined;
    this.attributes.insertFirst = undefined;
    this.attributes.autoPan = undefined;
    this.attributes.autoPanAnimation = undefined;
    this.attributes.autoPanMargin = undefined;
    this.watchers['position'] = function(newValue, oldValue, scope, instanceController) {
        instanceController.getPromise().then(function(instance) {instance.setPosition(newValue);});
    };
    this.callbacks['change'] = undefined;
    this.callbacks['change:element'] = undefined;
    this.callbacks['change:map'] = undefined;
    this.callbacks['change:offset'] = undefined;
    this.callbacks['change:position'] = undefined;
    this.callbacks['change:positioning'] = undefined;
    this.callbacks['propertychange'] = undefined;

};

/**
 * Overlay directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.Overlay = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolOverlay';
    this.require = ['^aolMap'];
    this.transclude = true;
    this.template = '<div class="aol-overlay" ng-transclude></div>';
    this.instance = ol.Overlay;
    this.model = aol.models.Overlay;
    this.onPreInstance = function(scope, element) {scope.element = element[0].getElementsByClassName('aol-overlay')[0];};
    this.onParentInstance = function(parentInst, instance) {parentInst.addOverlay(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeOverlay(instance);};
};

aol.registerDirective(new aol.directives.Overlay());


/** @namespace */
aol.models.sources = {};

/**
 * TileImage source base model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(ol.Attribution[]|undefined)} attributes.attributions               - attributions.
 * @property {(null|string|undefined)} attributes.crossOrigin                     - crossOrigin.
 * @property {(string|olx.LogoOptions|undefined)} attributes.logo                 - logo.
 * @property {(boolean|undefined)} attributes.opaque                              - layer is opaque?
 * @property {(ol.proj.ProjectionLike|undefined)} attributes.projection           - projection.
 * @property {(ol.source.State|string|undefined)} attributes.state                -  state.
 * @property {(function|undefined)} attributes.tileClass                          - Class used to instantiate image tiles.
 * @property {(ol.tilegrid.TileGrid|undefined)} attributes.tileGrid               - tile grid.
 * @property {(ol.TileLoadFunctionType|undefined)} attributes.tileLoadFunction    - function to load a tile given a URL.
 * @property {(number|undefined)} attributes.tilePixelRatio                       - pixel ratio (2 for retina display).
 * @property {(ol.TileUrlFunctionType|undefined)} attributes.tileUrlFunction      - tile URL function.
 * @property {(boolean|undefined)} attributes.wrapX                               - wrap the world horizontally?
 */
aol.models.sources.TileImage = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.attributions = undefined;
    this.attributes.crossOrigin = undefined;
    this.attributes.logo = undefined;
    this.attributes.opaque = undefined;
    this.attributes.projection = undefined;
    this.attributes.state = undefined;
    this.attributes.tileClass = undefined;
    this.attributes.tileGrid = undefined;
    this.attributes.tileLoadFunction = undefined;
    this.attributes.tilePixelRatio = undefined;
    this.attributes.tileUrlFunction = undefined;
    this.attributes.wrapX = undefined;
    this.callbacks['change'] = undefined;
    this.callbacks['propertychange'] = undefined;
    this.callbacks['tileloadend'] = undefined;
    this.callbacks['tileloaderror'] = undefined;
    this.callbacks['tileloadstart'] = undefined;
};

/**
 * BingMaps source model class
 *
 * @class
 * @augments aol.models.sources.TileImage
 * @property {(string|undefined)} attributes.culture      - culture code (defaults to 'en-us').
 * @property {(string|undefined)} attributes.key          - Bing Maps API key.
 * @property {(string|undefined)} attributes.imagerySet   - type of imagery.
 * @property {(number|undefined)} attributes.maxZoom      - max zoom.
 */
aol.models.sources.BingMaps = function() {
    aol.models.sources.TileImage.apply(this, arguments);
    this.attributes.culture = undefined;
    this.attributes.key = undefined;
    this.attributes.imagerySet = undefined;
    this.attributes.maxZoom = undefined;
};

/**
 * TileARCGistRest source model class
 *
 * @class
 * @augments aol.models.sources.TileImage
 * @property {(Object.<string,string>|undefined)} attributes.params      - params passed to the server.
 * @property {(string|undefined)} attributes.url                         - ArcGIS Rest service URL.
 * @property {(string[]|undefined)} attributes.urls                      - ArcGIS Rest service urls.
 */
aol.models.sources.TileArcGISRest = function() {
    aol.models.sources.TileImage.apply(this, arguments);
    this.attributes.params = undefined;
    this.attributes.url = undefined;
    this.attributes.urls = undefined;
};

/**
 * TileJSON source model class
 *
 * @class
 * @augments aol.models.sources.TileImage
 * @property {(string|undefined)} attributes.url  - service URL.
 */
aol.models.sources.TileJSON = function() {
    aol.models.sources.TileImage.apply(this, arguments);
    this.attributes.url = undefined;
};

/**
 * TileWMS source model class
 *
 * @class
 * @augments aol.models.sources.TileImage
 * @property {(Object.<string,string>|undefined)} attributes.params               - params passed to the server.
 * @property {(number|undefined)} attributes.gutter                               - gutter around image tiles to ignore.
 * @property {(boolean|undefined)} attributes.hidpi                               - Use the ol.Map#pixelRatio?
 * @property {(number|undefined)} attributes.maxZoom                              - max zoom.
 * @property {(ol.source.wms.ServerType|string|undefined)} attributes.serverType   - server type.
 * @property {(string|undefined)} attributes.url                                  - ArcGIS Rest service URL.
 * @property {(string[]|undefined)} attributes.urls                               - ArcGIS Rest service urls.
 */
aol.models.sources.TileWMS = function() {
    aol.models.sources.TileImage.apply(this, arguments);
    this.attributes.params = undefined;
    this.attributes.gutter = undefined;
    this.attributes.hidpi = undefined;
    this.attributes.maxZoom = undefined;
    this.attributes.serverType = undefined;
    this.attributes.url = undefined;
    this.attributes.urls = undefined;
};

/**
 * WMTS source model class
 *
 * @class
 * @augments aol.models.sources.TileImage
 * @property {(ol.source.WMTSRequestEncoding|string|undefined)} attributes.requestEncoding    - request encoding.
 * @property {(string|undefined)} attributes.layer                                            - layer name.
 * @property {(string|undefined)} attributes.style                                            - style.
 * @property {(string|undefined)} attributes.version                                          - WMTS version.
 * @property {(string|undefined)} attributes.format                                       - image format, eg. image/jpeg.
 * @property {(string|undefined)} attributes.matrixSet                                    - matrix set.
 * @property {(Object|undefined)} attributes.dimensions                                   - dimensions for tile requests.
 * @property {(number|undefined)} attributes.maxZoom                                      - max zoom.
 * @property {(string|undefined)} attributes.url                                          - service URL.
 * @property {(string[]|undefined)} attributes.urls                                       - service urls.
 */
aol.models.sources.WMTS = function() {
    aol.models.sources.TileImage.apply(this, arguments);
    this.attributes.layer = undefined;
    this.attributes.style = undefined;
    this.attributes.version = undefined;
    this.attributes.format = undefined;
    this.attributes.matrixSet = undefined;
    this.attributes.dimensions = undefined;
    this.attributes.maxZoom = undefined;
    this.attributes.url = undefined;
    this.attributes.urls = undefined;
};

/**
 * XYZ source model class
 *
 * @class
 * @augments aol.models.sources.TileImage
 * @property {(number|undefined)} attributes.maxZoom                              - max zoom.
 * @property {(number|undefined)} attributes.minZoom                              - min zoom.
 * @property {(number|ol.Size|undefined)} attributes.tileSize                     - tile size used by the service.
 * @property {(string|undefined)} attributes.url                                  - ArcGIS Rest service URL.
 * @property {(string[]|undefined)} attributes.urls                               - ArcGIS Rest service urls.
 */
aol.models.sources.XYZ = function() {
    aol.models.sources.TileImage.apply(this, arguments);
    this.attributes.maxZoom = undefined;
    this.attributes.minZoom = undefined;
    this.attributes.url = undefined;
    this.attributes.urls = undefined;
};

/**
 * Mapquest source model class
 *
 * @class
 * @augments aol.models.sources.XYZ
 * @property {string} attributes.layer  - layer type ('osm', 'sat', 'hyb').
 */
aol.models.sources.MapQuest = function() {
    aol.models.sources.XYZ.apply(this, arguments);
    this.attributes.layer = 'sat';
};

/**
 * OSM source model class
 *
 * @class
 * @augments aol.models.sources.XYZ
 */
aol.models.sources.OSM = function() {
    aol.models.sources.XYZ.apply(this, arguments);
    this.attributes.url = undefined;
};

/**
 * Stamen source model class
 *
 * @class
 * @augments aol.models.sources.XYZ
 * @property {string} attributes.layer  - layer type.
 */
aol.models.sources.Stamen = function() {
    aol.models.sources.XYZ.apply(this, arguments);
    this.attributes.layer = '';
};

/**
 * Zoomify source model class
 *
 * @class
 * @augments aol.models.sources.TileImage
 * @property {(string|undefined)} attributes.url                  - service URL.
 * @property {(string|undefined)} attributes.tierSizeCalculation  - tier size calculation method ('default', 'truncated').
 * @property {(ol.Size|number[]|undefined)} attributes.size        - image size.
 */
aol.models.sources.Zoomify = function() {
    aol.models.sources.TileImage.apply(this, arguments);
    this.attributes.url = undefined;
    this.attributes.tierSizeCalculation = undefined;
    this.attributes.size = undefined;
};

/**
 * TileUTFGrid source model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(boolean|undefined)} attributes.preemptive  - preemptive loading?
 * @property {(string|undefined)} attributes.url          - service URL.
 */
aol.models.sources.TileUTFGrid = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.preemptive = undefined;
    this.attributes.url = undefined;
    this.callbacks['change'] = undefined;
    this.callbacks['propertychange'] = undefined;
};

/**
 * ImageCanvas source base model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(ol.Attribution[]|undefined)} attributes.attributions               - attributions.
 * @property {(ol.CanvasFunctionType|undefined)} attributes.canvasFunction        - canvas function.
 * @property {(string|olx.LogoOptions|undefined)} attributes.logo                 - logo.
 * @property {(ol.proj.ProjectionLike|undefined)} attributes.projection           - projection.
 * @property {(number|undefined)} attributes.ratio                                - canvas to viewport ratio.
 * @property {(number[]|undefined)} attributes.resolutions                        - list of resolutions.
 * @property {(ol.source.State|string|undefined)} attributes.state                -  state.
 */
aol.models.sources.ImageCanvas = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.attributions = undefined;
    this.attributes.logo = undefined;
    this.attributes.projection = undefined;
    this.attributes.ratio = undefined;
    this.attributes.resolutions = undefined;
    this.attributes.state = undefined;
    this.callbacks['change'] = undefined;
    this.callbacks['propertychange'] = undefined;
};

/**
 * ImageVector source model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(ol.source.Vector|undefined)} attributes.source                                             -  source.
 * @property {ol.style.Style|Array.<ol.style.Style>|ol.style.StyleFunction|undefined} attributes.style  -  style.
 */
aol.models.sources.ImageVector = function() {
    aol.models.sources.ImageCanvas.apply(this, arguments);
    this.attributes.source = undefined;
    this.attributes.style = undefined;
};

/**
 * ImageMapGuide source model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(string|undefined)} attributes.url                                  - service URL.
 * @property {(number|undefined)} attributes.displayDpi                           - display DPI.
 * @property {(number|undefined)} attributes.metersPerUnit                        - meters per units.
 * @property {(boolean|undefined)} attributes.hidpi                               - Use the ol.Map#pixelRatio?
 * @property {(boolean|undefined)} attributes.useOverlay                          - use an overlay.
 * @property {(ol.proj.ProjectionLike|undefined)} attributes.projection           - projection.
 * @property {(number|undefined)} attributes.ratio                                - canvas to viewport ratio.
 * @property {(number[]|undefined)} attributes.resolutions                        - list of resolutions.
 * @property {(ol.TileLoadFunctionType|undefined)} attributes.imageLoadFunction   - function to load an image given a URL.
 * @property {(Object.<string,string>|undefined)} attributes.params               - params passed to the server.
 */
aol.models.sources.ImageMapGuide = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.url = undefined;
    this.attributes.displayDpi = undefined;
    this.attributes.metersPerUnit = undefined;
    this.attributes.hidpi = undefined;
    this.attributes.useOverlay = undefined;
    this.attributes.projection = undefined;
    this.attributes.ratio = undefined;
    this.attributes.resolutions = undefined;
    this.attributes.imageLoadFunction = undefined;
    this.attributes.params = undefined;
    this.callbacks['change'] = undefined;
    this.callbacks['propertychange'] = undefined;
};

/**
 * ImageStatic source model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(ol.Attribution[]|undefined)} attributes.attributions               - attributions.
 * @property {(null|string|undefined)} attributes.crossOrigin                     - crossOrigin.
 * @property {(ol.Extent|undefined)} attributes.imageExtent                       - extent of the image.
 * @property {(number|ol.Size|undefined)} attributes.imageSize                    - image size.
 * @property {(ol.TileLoadFunctionType|undefined)} attributes.imageLoadFunction   - function to load an image given a URL.
 * @property {(string|olx.LogoOptions|undefined)} attributes.logo                 - logo.
 * @property {(ol.proj.ProjectionLike|undefined)} attributes.projection           - projection.
 * @property {(string|undefined)} attributes.url                                  - service URL.
 */
aol.models.sources.ImageStatic = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.attributions = undefined;
    this.attributes.crossOrigin = undefined;
    this.attributes.imageExtent = undefined;
    this.attributes.imageSize = undefined;
    this.attributes.imageLoadFunction = undefined;
    this.attributes.logo = undefined;
    this.attributes.projection = undefined;
    this.attributes.url = undefined;
    this.callbacks['change'] = undefined;
    this.callbacks['propertychange'] = undefined;
};

/**
 * ImageWMS source model class
 *
 * @class
 * @augments aol.models.sources.TileImage
 * @property {(Object.<string,string>|undefined)} attributes.params               - params passed to the server.
 * @property {(null|string|undefined)} attributes.crossOrigin                     - crossOrigin.
 * @property {(boolean|undefined)} attributes.hidpi                               - Use the ol.Map#pixelRatio?
 * @property {(ol.source.wms.ServerType|string|undefined)} attributes.serverType  - server type.
 * @property {(ol.TileLoadFunctionType|undefined)} attributes.imageLoadFunction   - function to load an image given a URL.
 * @property {(string|olx.LogoOptions|undefined)} attributes.logo                 - logo.
 * @property {(Object.<string,string>|undefined)} attributes.params               - params passed to the server.
 * @property {(ol.proj.ProjectionLike|undefined)} attributes.projection           - projection.
 * @property {(number|undefined)} attributes.ratio                                - canvas to viewport ratio.
 * @property {(number[]|undefined)} attributes.resolutions                        - list of resolutions.
 * @property {(string|undefined)} attributes.url                                  - service URL.
 */
aol.models.sources.ImageWMS = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.params = undefined;
    this.attributes.crossOrigin = undefined;
    this.attributes.hidpi = undefined;
    this.attributes.serverType = undefined;
    this.attributes.imageLoadFunction = undefined;
    this.attributes.logo = undefined;
    this.attributes.params = undefined;
    this.attributes.projection = undefined;
    this.attributes.ratio = undefined;
    this.attributes.resolutions = undefined;
    this.attributes.url = undefined;
    this.callbacks['change'] = undefined;
    this.callbacks['imageloadend'] = undefined;
    this.callbacks['imageloaderror'] = undefined;
    this.callbacks['imageloadstart'] = undefined;
    this.callbacks['propertychange'] = undefined;
};

/**
 * Raster source model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(ol.source.Source[]|undefined)} attributes.sources              - input sources.
 * @property {(ol.raster.Operation|undefined)} attributes.operation           - raster operation.
 * @property {(Object|undefined)} attributes.lib                              - scope available to worker.
 * @property {(number|undefined)} attributes.threads                          - number of threads.
 * @property {(ol.raster.OperationType|undefined)} attributes.operationType   - raster operation.
 */
aol.models.sources.Raster = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.sources = undefined;
    this.attributes.operation = undefined;
    this.attributes.lib = undefined;
    this.attributes.threads = undefined;
    this.attributes.operationType = undefined;
    this.callbacks['change'] = undefined;
    this.callbacks['propertychange'] = undefined;
};

/**
 * Vector source model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(ol.Attribution[]|undefined)} attributes.attributions           - attributions.
 * @property {(ol.Feature[]|ol.Collection|undefined)} attributes.features     - features.
 * @property {(ol.format.Feature|undefined)} attributes.format                - format.
 * @property {(ol.FeatureLoader|undefined)} attributes.loader                 - loader.
 * @property {(string|olx.LogoOptions|undefined)} attributes.logo             - logo.
 * @property {(ol.LoadingStrategy|undefined)} attributes.strategy             - loading strategy.
 * @property {(string|ol.FeatureUrlFunction|undefined)} attributes.url        - url.
 * @property {(boolean|undefined)} attributes.useSpatialIndex                 - use an RTree to store features?
 * @property {(boolean|undefined)} attributes.wrapX                           - wrap the world horizontally?
 *
 *
 */
aol.models.sources.Vector = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.attributions = undefined;
    this.attributes.features = undefined;
    this.attributes.format = undefined;
    this.attributes.loader = undefined;
    this.attributes.logo = undefined;
    this.attributes.strategy = undefined;
    this.attributes.url = undefined;
    this.attributes.useSpatialIndex = undefined;
    this.attributes.wrapX = undefined;
    this.callbacks['addfeature'] = undefined;
    this.callbacks['change'] = undefined;
    this.callbacks['changefeature'] = undefined;
    this.callbacks['clear'] = undefined;
    this.callbacks['propertychange'] = undefined;
    this.callbacks['removefeature'] = undefined;
};

/**
 * Cluster source model class.
 *
 * @class
 * @augments aol.models.sources.Vector
 * @property {(number|undefined)} attributes.distance                       - minimum distance in pixels between clusters.
 * @property {(ol.Extent|undefined)} attributes.extent                      - extent.
 * @property {(ol.proj.ProjectionLike|undefined)} attributes.projection     - projection.
 * @property {(ol.source.Vector|undefined)} attributes.source               - source.
 */
aol.models.sources.Cluster = function() {
    aol.models.sources.Vector.apply(this, arguments);
    this.attributes.distance = undefined;
    this.attributes.extent = undefined;
    this.attributes.projection = undefined;
    this.attributes.source = undefined;
};

/**
 * TileVector source model class.
 *
 * @class
 * @augments aol.models.sources.Vector
 * @property {(ol.tilegrid.TileGrid|undefined)} attributes.tileGrid                   - tile grid.
 * @property {(ol.TileVectorLoadFunctionType|undefined)} attributes.tileLoadFunction  - tile load function.
 * @property {(string|undefined)} attributes.url                                      - service URL.
 * @property {(string[]|undefined)} attributes.urls                                   - service urls.
 * @property {(boolean|undefined)} attributes.wrapX                                   - wrap the world horizontally?
 *
 */
aol.models.sources.TileVector = function() {
    aol.models.sources.Vector.apply(this, arguments);
    this.attributes.tileGrid = undefined;
    this.attributes.tileLoadFunction = undefined;
    this.attributes.url = undefined;
    this.attributes.urls = undefined;
    this.attributes.wrapX = undefined;
};


/**
 * BingMaps source directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.SourceBingMaps = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolSourceBingmaps';
    this.require = ['^aolLayerTile'];
    this.replace = true;
    this.instance = ol.source.BingMaps;
    this.model = aol.models.sources.BingMaps;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setSource(instance);};
};

/**
 * TileARCGistRest source directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.SourceTileARCGistRest = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolSourceTilearcgisrest';
    this.require = ['^aolLayerTile'];
    this.replace = true;
    this.instance = ol.source.TileArcGISRest;
    this.model = aol.models.sources.TileArcGISRest;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setSource(instance);};
};

/**
 * TileJSON source directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.SourceTileJSON = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolSourceTilejson';
    this.require = ['^aolLayerTile'];
    this.replace = true;
    this.instance = ol.source.TileJSON;
    this.model = aol.models.sources.TileJSON;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setSource(instance);};
};

/**
 * TileWMS source directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.SourceTileWMS = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolSourceTilewms';
    this.require = ['^aolLayerTile'];
    this.replace = true;
    this.instance = ol.source.TileWMS;
    this.model = aol.models.sources.TileWMS;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setSource(instance);};
};

/**
 * WMTS source directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.SourceWMTS = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolSourceTilewms';
    this.require = ['^aolLayerTile'];
    this.replace = true;
    this.instance = ol.source.WMTS;
    this.model = aol.models.sources.WMTS;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setSource(instance);};
};

/**
 * XYZ source directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.SourceXYZ = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolSourceXyz';
    this.require = ['^aolLayerTile'];
    this.replace = true;
    this.instance = ol.source.XYZ;
    this.model = aol.models.sources.XYZ;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setSource(instance);};
};

/**
 * MapQuest source directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.SourceMapQuest = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolSourceMapquest';
    this.require = ['^aolLayerTile'];
    this.replace = true;
    this.instance = ol.source.MapQuest;
    this.model = aol.models.sources.MapQuest;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setSource(instance);};
};

/**
 * OSM source directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.SourceOSM = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolSourceOsm';
    this.require = ['^aolLayerTile'];
    this.replace = true;
    this.instance = ol.source.OSM;
    this.model = aol.models.sources.OSM;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setSource(instance);};
};

/**
 * Stamen source directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.SourceStamen = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolSourceStamen';
    this.require = ['^aolLayerTile'];
    this.replace = true;
    this.instance = ol.source.Stamen;
    this.model = aol.models.sources.Stamen;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setSource(instance);};
};

/**
 * Zoomify source directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.SourceZoomify = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolSourceZoomify';
    this.require = ['^aolLayerTile'];
    this.replace = true;
    this.instance = ol.source.Zoomify;
    this.model = aol.models.sources.Zoomify;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setSource(instance);};
};

/**
 * TileUTFGrid source directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.SourceTileUTFGrid = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolSourceTileutfgrid';
    this.require = ['^aolLayerTile'];
    this.replace = true;
    this.instance = ol.source.TileUTFGrid;
    this.model = aol.models.sources.TileUTFGrid;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setSource(instance);};
};

/**
 * ImageVector source directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.SourceImageVector = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolSourceImagevector';
    this.require = ['^aolLayerImage'];
    this.replace = true;
    this.instance = ol.source.ImageVector;
    this.model = aol.models.sources.ImageVector;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setSource(instance);};
};

/**
 * ImageMapGuide source directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.SourceImageMapGuide = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolSourceImagemapguide';
    this.require = ['^aolLayerImage'];
    this.replace = true;
    this.instance = ol.source.ImageVector;
    this.model = aol.models.sources.ImageVector;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setSource(instance);};
};

/**
 * ImageStatic source directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.SourceImageStatic = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolSourceImagestatic';
    this.require = ['^aolLayerImage'];
    this.replace = true;
    this.instance = ol.source.ImageStatic;
    this.model = aol.models.sources.ImageStatic;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setSource(instance);};
};

/**
 * ImageWMS source directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.SourceImageWMS = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolSourceImagewms';
    this.require = ['^aolLayerImage'];
    this.replace = true;
    this.instance = ol.source.ImageWMS;
    this.model = aol.models.sources.ImageWMS;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setSource(instance);};
};

/**
 * Raster source directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.SourceRaster = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolSourceRaster';
    this.require = ['^aolLayerImage'];
    this.replace = true;
    this.instance = ol.source.Raster;
    this.model = aol.models.sources.Raster;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setSource(instance);};
};

/**
 * Vector source directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.SourceVector = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolSourceVector';
    this.require = ['?^aolLayerVector', '?^aolLayerHeatmap'];
    this.replace = true;
    this.instance = ol.source.Vector;
    this.model = aol.models.sources.Vector;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setSource(instance);};
};

/**
 * Cluster source directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.SourceCluster = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolSourceCluster';
    this.require = ['^aolLayerVector'];
    this.replace = true;
    this.instance = ol.source.Cluster;
    this.model = aol.models.sources.Cluster;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setSource(instance);};
};

/**
 * Tile vector source directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.SourceTileVector = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolSourceTilevector';
    this.require = ['^aolLayerVector'];
    this.replace = true;
    this.instance = ol.source.TileVector;
    this.model = aol.models.sources.TileVector;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setSource(instance);};
};

aol.registerDirective(new aol.directives.SourceBingMaps());
aol.registerDirective(new aol.directives.SourceTileARCGistRest());
aol.registerDirective(new aol.directives.SourceTileJSON());
aol.registerDirective(new aol.directives.SourceTileWMS());
aol.registerDirective(new aol.directives.SourceWMTS());
aol.registerDirective(new aol.directives.SourceXYZ());
aol.registerDirective(new aol.directives.SourceMapQuest());
aol.registerDirective(new aol.directives.SourceOSM());
aol.registerDirective(new aol.directives.SourceStamen());
aol.registerDirective(new aol.directives.SourceZoomify());
aol.registerDirective(new aol.directives.SourceTileUTFGrid());
aol.registerDirective(new aol.directives.SourceImageVector());
aol.registerDirective(new aol.directives.SourceImageMapGuide());
aol.registerDirective(new aol.directives.SourceImageStatic());
aol.registerDirective(new aol.directives.SourceImageWMS());
aol.registerDirective(new aol.directives.SourceRaster());
aol.registerDirective(new aol.directives.SourceVector());
aol.registerDirective(new aol.directives.SourceCluster());
aol.registerDirective(new aol.directives.SourceTileVector());


/**
 * Feature model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(ol.geom.Geometry|Object|undefined)} attributes.geometry                                 - geometry.
 * @property {(ol.style.Style|ol.style.Style[]|ol.FeatureStyleFunction|undefined)} attributes.style    - style.
 * @property {(Object|undefined)} attributes.properties                                                - properties.
 */
aol.models.Feature = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.geometry = undefined;
    this.attributes.style = undefined;
    this.attributes.properties = undefined;
    this.callbacks['change'] = undefined;
    this.callbacks['change:geometry'] = undefined;
    this.callbacks['change:style'] = undefined;
    this.callbacks['change:id'] = undefined;
    this.callbacks['propertychange'] = undefined;
};

/**
 * Feature directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.Feature = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolFeature';
    this.require = ['^aolSourceVector'];
    this.instance = ol.Feature;
    this.model = aol.models.Feature;
    this.onParentInstance = function(parentInst, instance) {parentInst.addFeature(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeFeature(instance);};
};

aol.registerDirective(new aol.directives.Feature());

/** @namespace */
aol.models.styles = {};

/**
 * Style model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(ol.geom.Geometry|ol.style.GeometryFunction|string|undefined)} attributes.geometry  - geometry.
 * @property {(ol.style.Fill|undefined)} attributes.fill                                          - fill.
 * @property {(ol.style.Image|undefined)} attributes.image                                        - image.
 * @property {(ol.style.Stroke|undefined)} attributes.stroke                                      - stroke.
 * @property {(ol.style.Text|undefined)} attributes.text                                          - text.
 * @property {(number|undefined)} attributes.zIndex                                               - zIndex.
 */
aol.models.styles.Style = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.geometry = undefined;
    this.attributes.fill = undefined;
    this.attributes.image = undefined;
    this.attributes.stroke = undefined;
    this.attributes.text = undefined;
    this.attributes.zIndex = undefined;
};

/**
 * Circle style model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(ol.style.Fill|undefined)} attributes.fill                                          - fill.
 * @property {(number|undefined)} attributes.radius                                               - radius.
 * @property {(boolean|undefined)} attributes.snapToPixel                                         - snap to pixel?
 * @property {(ol.style.Stroke|undefined)} attributes.stroke                                      - stroke.
 */
aol.models.styles.Circle = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.fill = undefined;
    this.attributes.radius = undefined;
    this.attributes.snapToPixel = undefined;
    this.attributes.stroke = undefined;
};

/**
 * Fill style model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(ol.Color|string|undefined)} attributes.color    - color.
 */
aol.models.styles.Fill = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.color = undefined;
    this.watchers['color'] = function(newValue, oldValue, scope, instanceController, parentController, controllers) {
        var styledController = controllers[controllers.length-1] !== undefined ?
                                                                        controllers[controllers.length-1] :
                                                                        controllers[controllers.length-2];
        instanceController.getPromise().then(function(instance){instance.setColor(newValue);});
        parentController.getPromise().then(function(parentInstance){
            switch(parentController.name){
                case 'aolStyleCircle':
                    parentInstance.render_();
                    break;
                default:
                    break;
            }
        });
        styledController.getPromise().then(function(styledInstance){styledInstance.changed();});
    };
};

/**
 * Icon style model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(number[]|undefined)} attributes.anchor                       - anchor position, e.g. [0.5, 0.5].
 * @property {(ol.style.IconOrigin|undefined)} attributes.anchorOrigin      - anchor origin, e.g. 'top-left'.
 * @property {(ol.style.IconAnchorUnits|undefined)} attributes.anchorXUnits - anchor units, X dimension.
 * @property {(ol.style.IconAnchorUnits|undefined)} attributes.anchorYUnits - anchor units, Y dimension.
 * @property {(null|string|undefined)} attributes.crossOrigin               - crossOrigin.
 * @property {(Image|undefined)} attributes.img                             - image.
 * @property {(number[]|undefined)} attributes.offset                       - icon offset in given image.
 * @property {(ol.style.IconOrigin|undefined)} attributes.offsetOrigin      - offset origin, e.g. 'top-left'.
 * @property {(number|undefined)} attributes.opacity                        - opacity.
 * @property {(number|undefined)} attributes.scale                          - scale.
 * @property {(boolean|undefined)} attributes.snapToPixel                   - snap to pixel?
 * @property {(boolean|undefined)} attributes.rotateWithView                - rotate with view?
 * @property {(number|undefined)} attributes.rotation                       - rotation (radians).
 * @property {(number|ol.Size|undefined)} attributes.imgSize                - image size.
 * @property {(string|undefined)} attributes.src                            - image src URI.
 *
 */
aol.models.styles.Icon = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.anchor = undefined;
    this.attributes.anchorOrigin = undefined;
    this.attributes.anchorXUnits = undefined;
    this.attributes.anchorYUnits = undefined;
    this.attributes.crossOrigin = undefined;
    this.attributes.img = undefined;
    this.attributes.offset = undefined;
    this.attributes.offsetOrigin = undefined;
    this.attributes.opacity = undefined;
    this.attributes.scale = undefined;
    this.attributes.snapToPixel = undefined;
    this.attributes.rotateWithView = undefined;
    this.attributes.rotation = undefined;
    this.attributes.imgSize = undefined;
    this.attributes.src = undefined;
};

/**
 * RegularShape style model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(ol.style.Fill|undefined)} attributes.fill                        - fill.
 * @property {(number|undefined)} attributes.points                             - number of points of the shape.
 * @property {(number|undefined)} attributes.radius                             - radius.
 * @property {(number|undefined)} attributes.radius1                            - radius1.
 * @property {(number|undefined)} attributes.radius2                            - radius2.
 * @property {(number|undefined)} attributes.angle                              - angle.
 * @property {(boolean|undefined)} attributes.snapToPixel                       - snap to pixel?
 * @property {(ol.style.Stroke|undefined)} attributes.stroke                    - stroke.
 * @property {(number|undefined)} attributes.rotation                           - rotation (radians).
 *
 */
aol.models.styles.RegularShape = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.fill = undefined;
    this.attributes.points = undefined;
    this.attributes.radius = undefined;
    this.attributes.radius1 = undefined;
    this.attributes.radius2 = undefined;
    this.attributes.angle = undefined;
    this.attributes.snapToPixel = undefined;
    this.attributes.stroke = undefined;
    this.attributes.rotation = undefined;
};

/**
 * Stroke style model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(ol.Color|string|undefined)} attributes.color     - color.
 * @property {(string|undefined)} attributes.lineCap            - line cap ('butt', 'round', 'square').
 * @property {(string|undefined)} attributes.lineJoin           - line join ('bevel', 'round', 'miter').
 * @property {(number[]|undefined)} attributes.lineDash         - line dash pattern.
 * @property {(number|undefined)} attributes.miterLimit         - miter limit.
 * @property {(number|undefined)} attributes.width              - width.
 */
aol.models.styles.Stroke = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.color = undefined;
    this.attributes.lineCap = undefined;
    this.attributes.lineJoin = undefined;
    this.attributes.lineDash = undefined;
    this.attributes.miterLimit = undefined;
    this.attributes.width = undefined;
    this.watchers['color'] = function(newValue, oldValue, scope, instanceController, parentController, controllers) {
        var styledController = controllers[controllers.length-1] !== undefined ?
            controllers[controllers.length-1] :
            controllers[controllers.length-2];
        instanceController.getPromise().then(function(instance){instance.setColor(newValue);});
        parentController.getPromise().then(function(parentInstance){
            switch(parentController.name){
                case 'aolStyleCircle':
                    parentInstance.render_();
                    break;
                default:
                    break;
            }
        });
        styledController.getPromise().then(function(styledInstance){styledInstance.changed();});
    };

};

/**
 * Text style model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(string|undefined)} attributes.font               - font.
 * @property {(number|undefined)} attributes.offsetX            - horizontal offset.
 * @property {(number|undefined)} attributes.offsetY            - vertical offset.
 * @property {(number|undefined)} attributes.scale              - scale.
 * @property {(number|undefined)} attributes.rotation           - rotation (radians).
 * @property {(string|undefined)} attributes.text               - text.
 * @property {(string|undefined)} attributes.textAlign          - alignment.
 * @property {(string|undefined)} attributes.textBaseline       - baseline.
 * @property {(ol.style.Fill|undefined)} attributes.fill        - fill.
 * @property {(ol.style.Stroke|undefined)} attributes.stroke    - stroke.
 */
aol.models.styles.Text = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.font = undefined;
    this.attributes.offsetX = undefined;
    this.attributes.offsetY = undefined;
    this.attributes.scale = undefined;
    this.attributes.rotation = undefined;
    this.attributes.text = undefined;
    this.attributes.textAlign = undefined;
    this.attributes.textBaseline = undefined;
    this.attributes.fill = undefined;
    this.attributes.stroke = undefined;

    this.typeConverters.offsetX = Number;
    this.typeConverters.offsetY = Number;
    this.typeConverters.scale = Number;
    this.typeConverters.rotation = Number;
};

/**
 * Style directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.Style = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolStyle';
    this.require = ['?^aolCollectionStyle','?^aolInteractionSelect', '?^aolFeature', '?^aolLayerVector'];
    this.instance = ol.style.Style;
    this.model = aol.models.styles.Style;
    this.onParentController = function(parentController, instance){
        switch(parentController.name){
            case 'aolInteractionSelect':
                parentController.setStyle(instance);
                break;
            default:
                break;
        }
    };
    this.onParentInstance = function(parentInst, instance, parentController) {
        switch(parentController.name){
            case 'aolCollectionStyle':
                parentInst.push(instance);
                break;
            case 'aolInteractionSelect':
                break;
            default:
                parentInst.setStyle(instance);
                break;
        }
    };
    this.onDestroy = function(parentInst, instance, parentController) {
        switch(parentController.name){
            case 'aolCollectionStyle':
                parentInst.remove(instance);
                break;
            case 'aolInteractionSelect':
                break;
            default:
                parentInst.setStyle(null);
                break;
        }
    };
};

/**
 * Circle style directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.StyleCircle = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolStyleCircle';
    this.require = ['^aolStyle'];
    this.instance = ol.style.Circle;
    this.model = aol.models.styles.Circle;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setImage(instance);};
};

/**
 * Fill style directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.StyleFill = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolStyleFill';
    this.require = ['?^aolStyleText', '?^aolStyleCircle', '?^aolStyleRegularshape', '^aolStyle',
                    '?^aolFeature', '?^aolLayerVector'];
    this.instance = ol.style.Fill;
    this.model = aol.models.styles.Fill;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setFill(instance);};
};

/**
 * Icon style directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.StyleIcon = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolStyleIcon';
    this.require = ['^aolStyle'];
    this.instance = ol.style.Icon;
    this.model = aol.models.styles.Icon;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setImage(instance);};
};

/**
 * RegularShape style directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.StyleRegularShape = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolStyleRegularshape';
    this.require = ['^aolStyle'];
    this.instance = ol.style.RegularShape;
    this.model = aol.models.styles.RegularShape;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setImage(instance);};
};

/**
 * Stroke style directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.StyleStroke = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolStyleStroke';
    this.require = ['?^aolStyleText', '?^aolStyleCircle', '?^aolStyleRegularshape', '^aolStyle',
                    '?^aolFeature', '?^aolLayerVector'];
    this.instance = ol.style.Stroke;
    this.model = aol.models.styles.Stroke;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setStroke(instance);};
};

/**
 * Text style directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.StyleText = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolStyleText';
    this.require = ['^aolStyle'];
    this.instance = ol.style.Text;
    this.model = aol.models.styles.Text;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setText(instance);};
};

aol.registerDirective(new aol.directives.Style());
aol.registerDirective(new aol.directives.StyleCircle());
aol.registerDirective(new aol.directives.StyleFill());
aol.registerDirective(new aol.directives.StyleIcon());
aol.registerDirective(new aol.directives.StyleRegularShape());
aol.registerDirective(new aol.directives.StyleStroke());
aol.registerDirective(new aol.directives.StyleText());

/** @namespace */
aol.models.geometries = {};

/**
 * This namespace contains helper functions for the geometries directives.
 * @namespace
 */
aol.helpers.geometries = {};

/**
 * Teleport geometry on coordinates attributes change
 * @param coordinates
 * @param u1_
 * @param u2_
 * @param instanceCtrl
 */
aol.helpers.geometries.teleportOnCoordinateChange = function (coordinates, u1_, u2_, instanceCtrl) {
    instanceCtrl.getPromise().then(function (instance) {instance.setCoordinates(coordinates);});
};

/**
 * Slide geometry on coordinates attributes change, 350ms duration.
 * @param {number[]} coordinates - updated coordinates.
 * @param {*} u1_ - unused
 * @param {Object} scope - directive scope
 * @param {Object} instanceCtrl
 * @param {*} u2_ - unused
 * @param {string[]} controllers
 */
aol.helpers.geometries.slideOnCoordinateChange = function (coordinates, u1_, scope, instanceCtrl, u2_, controllers) {
    var mapController = controllers[controllers.length-1];
    mapController.getPromise().then(function(map) {
        instanceCtrl.getPromise().then(function (instance) {
            var duration = 350;
            var startTime = new Date().getTime();
            var startCoord = instance.getCoordinates();
            var displacement = [coordinates[0] - startCoord[0], coordinates[1] - startCoord[1]];
            var currentCoord  = [startCoord[0], startCoord[1]];
            var elapsedRatio = 0;
            var progress = 0;
            var easing = ol.easing.inAndOut;

            if (angular.isDefined(scope.__listenerId__)) {
                ol.Observable.unByKey(scope.__listenerId__);
                scope.__listenerId__ = undefined;
            }
            function step(event) {
                elapsedRatio = Math.min(1, (event.frameState.time - startTime) / duration);
                progress = easing(elapsedRatio);
                currentCoord[0] = startCoord[0] + progress * displacement[0];
                currentCoord[1] = startCoord[1] + progress * displacement[1];

                instance.setCoordinates(currentCoord);
                if (elapsedRatio === 1) {
                    ol.Observable.unByKey(scope.__listenerId__);
                    scope.__listenerId__ = undefined;
                    event.frameState.animate = false;
                } else {
                    event.frameState.animate = true;
                }
            }
            scope.__listenerId__ = map.on('postcompose', step);
            map.render();
        });
    });
};



/**
 * Overrides on ol.geom.* constructors to cope with inconsistent signatures.
 * @namespace */
aol.overrides.geometries = {};

/**
 * Circle instance override
 *
 * @param {{center: number[], radius: number, layout: (ol.geom.GeometryLayout|undefined)}} attributes - attributes
 * @returns {ol.geom.Circle}
 * @constructor
 */
aol.overrides.geometries.Circle = function(attributes){
    return new ol.geom.Circle(attributes.center, attributes.radius, attributes.layout);
};

/**
 * LinearRing instance override
 *
 * @param {{coordinates: (ol.Coordinate[]|undefined), layout: (ol.geom.GeometryLayout|undefined)}} attributes - attributes
 * @returns {ol.geom.LinearRing}
 * @constructor
 */
aol.overrides.geometries.LinearRing = function(attributes){
    return new ol.geom.LinearRing(attributes.coordinates, attributes.layout);
};

/**
 * LineString instance override
 *
 * @param {{coordinates: (ol.Coordinate[]|undefined), layout: (ol.geom.GeometryLayout|undefined)}} attributes - attributes
 * @returns {ol.geom.LineString}
 * @constructor
 */
aol.overrides.geometries.LineString = function(attributes){
    return new ol.geom.LineString(attributes.coordinates, attributes.layout);
};

/**
 * MultiLineString instance override
 *
 * @param {{coordinates: (ol.Coordinate[]|undefined), layout: (ol.geom.GeometryLayout|undefined)}} attributes - attributes
 * @returns {ol.geom.MultiLineString}
 * @constructor
 */
aol.overrides.geometries.MultiLineString = function(attributes){
    return new ol.geom.MultiLineString(attributes.coordinates, attributes.layout);
};

/**
 * MultiPoint instance override
 *
 * @param {{coordinates: (ol.Coordinate[]|undefined), layout: (ol.geom.GeometryLayout|undefined)}} attributes - attributes
 * @returns {ol.geom.MultiPoint}
 * @constructor
 */
aol.overrides.geometries.MultiPoint = function(attributes){
    return new ol.geom.MultiPoint(attributes.coordinates, attributes.layout);
};

/**
 * MultiPolygon instance override
 *
 * @param {{coordinates: (ol.Coordinate[]|undefined), layout: (ol.geom.GeometryLayout|undefined)}} attributes - attributes
 * @returns {ol.geom.MultiPolygon}
 * @constructor
 */
aol.overrides.geometries.MultiPolygon = function(attributes){
    return new ol.geom.MultiPolygon(attributes.coordinates, attributes.layout);
};

/**
 * Point instance override
 *
 * @param {{coordinates: (ol.Coordinate[]|undefined), layout: (ol.geom.GeometryLayout|undefined)}} attributes - attributes
 * @returns {ol.geom.Point}
 * @constructor
 */
aol.overrides.geometries.Point = function(attributes){
    return new ol.geom.Point(attributes.coordinates, attributes.layout);
};

/**
 * Polygon instance override
 *
 * @param {{coordinates: (ol.Coordinate[]|undefined), layout: (ol.geom.GeometryLayout|undefined)}} attributes - attributes
 * @returns {ol.geom.Polygon}
 * @constructor
 */
aol.overrides.geometries.Polygon = function(attributes){
    return new ol.geom.Polygon(attributes.coordinates, attributes.layout);
};

/**
 * Geometry base model class.
 *
 * @class
 * @augments aol.models.Model
 */
aol.models.geometries.SimpleGeometry = function() {
    aol.models.Model.apply(this, arguments);
    this.watchers['coordinates'] = aol.helpers.geometries.teleportOnCoordinateChange;
    this.callbacks['change'] = undefined;
    this.callbacks['propertychange'] = undefined;
};

/**
 * Circle Geometry model class.
 *
 * @class
 * @augments aol.models.geometries.SimpleGeometry
 * @property {(ol.Coordinate|number[]|undefined)} attributes.center   - center.
 * @property {(number|undefined)} attributes.radius                   - radius.
 * @property {(ol.geom.GeometryLayout|undefined)} attributes.layout   - layout.
 */
aol.models.geometries.Circle = function() {
    aol.models.geometries.SimpleGeometry.apply(this, arguments);
    this.attributes.center = undefined;
    this.attributes.radius = undefined;
    this.attributes.layout = undefined;
};

/**
 * LinearRing Geometry model class.
 *
 * @class
 * @augments aol.models.geometries.SimpleGeometry
 * @property {(ol.Coordinate[]|undefined)} attributes.coordinates     - coordinates.
 * @property {(ol.geom.GeometryLayout|undefined)} attributes.layout   - layout.
 */
aol.models.geometries.LinearRing = function() {
    aol.models.geometries.SimpleGeometry.apply(this, arguments);
    this.attributes.coordinates = undefined;
    this.attributes.layout = undefined;
};

/**
 * LineString Geometry model class.
 *
 * @class
 * @augments aol.models.geometries.SimpleGeometry
 * @property {(ol.Coordinate[]|undefined)} attributes.coordinates     - coordinates.
 * @property {(ol.geom.GeometryLayout|undefined)} attributes.layout   - layout.
 */
aol.models.geometries.LineString = function() {
    aol.models.geometries.SimpleGeometry.apply(this, arguments);
    this.attributes.coordinates = undefined;
    this.attributes.layout = undefined;
};

/**
 * MultiLineString Geometry model class.
 *
 * @class
 * @augments aol.models.geometries.SimpleGeometry
 * @property {(Array.<ol.Coordinate[]>|undefined)} attributes.coordinates     - list of linestrings coordinates.
 * @property {(ol.geom.GeometryLayout|undefined)} attributes.layout           - layout.
 */
aol.models.geometries.MultiLineString = function() {
    aol.models.geometries.SimpleGeometry.apply(this, arguments);
    this.attributes.coordinates = undefined;
    this.attributes.layout = undefined;
};

/**
 * MultiPoint Geometry model class.
 *
 * @class
 * @augments aol.models.geometries.SimpleGeometry
 * @property {(ol.Coordinate[]|undefined)} attributes.coordinates             - list of point coordinates.
 * @property {(ol.geom.GeometryLayout|undefined)} attributes.layout           - layout.
 */
aol.models.geometries.MultiPoint = function() {
    aol.models.geometries.SimpleGeometry.apply(this, arguments);
    this.attributes.coordinates = undefined;
    this.attributes.layout = undefined;
};

/**
 * MultiPolygon Geometry model class.
 *
 * @class
 * @augments aol.models.geometries.SimpleGeometry
 * @property {(Array.<Array.<ol.Coordinate[]>>|undefined)} attributes.coordinates     - list of polygon coordinates.
 * @property {(ol.geom.GeometryLayout|undefined)} attributes.layout                   - layout.
 */
aol.models.geometries.MultiPolygon = function() {
    aol.models.geometries.SimpleGeometry.apply(this, arguments);
    this.attributes.coordinates = undefined;
    this.attributes.layout = undefined;
};

/**
 * Point Geometry model class.
 *
 * @class
 * @augments aol.models.geometries.SimpleGeometry
 * @property {(ol.Coordinate|number[]|undefined)} attributes.coordinates     - coordinates.
 * @property {(ol.geom.GeometryLayout|undefined)} attributes.layout          - layout.
 */
aol.models.geometries.Point = function() {
    aol.models.geometries.SimpleGeometry.apply(this, arguments);
    this.attributes.coordinates = undefined;
    this.attributes.layout = undefined;
};

/**
 * Polygon Geometry model class.
 *
 * @class
 * @augments aol.models.geometries.SimpleGeometry
 * @property {(Array.<ol.Coordinate[]>|undefined)} attributes.coordinates     - list of edge coordinates.
 * @property {(ol.geom.GeometryLayout|undefined)} attributes.layout            - layout.
 */
aol.models.geometries.Polygon = function() {
    aol.models.geometries.SimpleGeometry.apply(this, arguments);
    this.attributes.coordinates = undefined;
    this.attributes.layout = undefined;
};

/**
 * GeometryCircle directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.GeometryCircle = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolGeometryCircle';
    this.require = ['?^aolFeature', '?^aolStyle', '^^aolMap'];
    this.instance = aol.overrides.geometries.Circle;
    this.model = aol.models.geometries.Circle;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setGeometry(instance);};
};

/**
 * GeometryLinearRing directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.GeometryLinearRing = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolGeometryLinearring';
    this.require = ['?^aolFeature', '?^aolStyle', '^^aolMap'];
    this.instance = aol.overrides.geometries.LinearRing;
    this.model = aol.models.geometries.LinearRing;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setGeometry(instance);};
};

/**
 * GeometryLineString directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.GeometryLineString = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolGeometryLinestring';
    this.require = ['?^aolFeature', '?^aolStyle', '^^aolMap'];
    this.instance = aol.overrides.geometries.LineString;
    this.model = aol.models.geometries.LineString;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setGeometry(instance);};
};

/**
 * GeometryMultiLineString directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.GeometryMultiLineString = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolGeometryMultilinestring';
    this.require = ['?^aolFeature', '?^aolStyle', '^^aolMap'];
    this.instance = aol.overrides.geometries.MultiLineString;
    this.model = aol.models.geometries.MultiLineString;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setGeometry(instance);};
};

/**
 * GeometryMultiPoint directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.GeometryMultiPoint = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolGeometryMultipoint';
    this.require = ['?^aolFeature', '?^aolStyle', '^^aolMap'];
    this.instance = aol.overrides.geometries.MultiPoint;
    this.model = aol.models.geometries.MultiPoint;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setGeometry(instance);};
};

/**
 * GeometryMultiPolygon directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.GeometryMultiPolygon = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolGeometryMultipolygon';
    this.require = ['?^aolFeature', '?^aolStyle', '^^aolMap'];
    this.instance = aol.overrides.geometries.MultiPolygon;
    this.model = aol.models.geometries.MultiPolygon;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setGeometry(instance);};
};

/**
 * GeometryPoint directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.GeometryPoint = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolGeometryPoint';
    this.require = ['?^aolFeature', '?^aolStyle', '^^aolMap'];
    this.instance = aol.overrides.geometries.Point;
    this.model = aol.models.geometries.Point;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setGeometry(instance);};
};

/**
 * GeometryPolygon directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.GeometryPolygon = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolGeometryPolygon';
    this.require = ['?^aolFeature', '?^aolStyle', '^^aolMap'];
    this.instance = aol.overrides.geometries.Polygon;
    this.model = aol.models.geometries.Polygon;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setGeometry(instance);};
};

aol.registerDirective(new aol.directives.GeometryCircle());
aol.registerDirective(new aol.directives.GeometryLinearRing());
aol.registerDirective(new aol.directives.GeometryLineString());
aol.registerDirective(new aol.directives.GeometryMultiLineString());
aol.registerDirective(new aol.directives.GeometryMultiPoint());
aol.registerDirective(new aol.directives.GeometryMultiPolygon());
aol.registerDirective(new aol.directives.GeometryPoint());
aol.registerDirective(new aol.directives.GeometryPolygon());


/**
 * Projection model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(string|Object|undefined)} attributes.code            - SRS identifier code, e.g. EPSG:4326.
 * @property {(ol.proj.Units|string|undefined)} attributes.units    - units.
 * @property {(ol.Extent|undefined)} attributes.extent              -  validity extent for the SRS.
 * @property {(string|undefined)} attributes.axisOrientation        - The axis orientation as specified in Proj4.
 * @property {(boolean|undefined)} attributes.global                - projection is valid for the whole globe?
 * @property {(ol.Extent|undefined)} attributes.worldExtent         - world extent for the SRS.
 * @property {(function|undefined)} attributes.getPointResolution   - Function to determine resolution at a point.
 */
aol.models.Projection = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.code = undefined;
    this.attributes.units = undefined;
    this.attributes.extent = undefined;
    this.attributes.axisOrientation = undefined;
    this.attributes.global = undefined;
    this.attributes.worldExtent = undefined;
    this.attributes.getPointResolution = undefined;
};

/**
 * Feature directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.Projection = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolProjection';
    this.require = ['?^aolCoordinate', '?^aolSourceCluster', '?^aolSourceImagecanvas', '?^aolSourceImagemapguide',
        '?^aolSourceImagemapguide', '?^aolSourceImagestatic', '?^aolSourceImagevector', '?^aolSourceImagewms',
        '?^aolSourceTilearcgisrest', '?^aolSourceTileimage', '?^aolSourceTilewms', '?^aolSourceWmts',
        '?^aolSourceXyz', '?^aolView', '?^aolControlMouseposition'];
    this.instance = ol.proj.Projection;
    this.model = aol.models.Projection;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setProjection(instance);};
};

aol.registerDirective(new aol.directives.Projection());

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


if (typeof define === 'function' && typeof define.amd === 'object') {
define(function(exports) { exports.aol = aol; });
} else {
window.aol = aol;
}
})();