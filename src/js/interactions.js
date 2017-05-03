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
