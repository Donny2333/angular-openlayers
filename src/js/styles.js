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
