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
