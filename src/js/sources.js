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

