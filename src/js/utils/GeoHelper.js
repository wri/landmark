define([
  "map/MapAssets",
	"esri/units",
  "esri/graphic",
  "esri/geometry/Point",
  "esri/geometry/Circle",
  "esri/SpatialReference",
  "esri/tasks/GeometryService",
  "esri/geometry/webMercatorUtils",
  "dojo/Deferred",
  "dojo/_base/array"
], function (MapAssets, Units, Graphic, Point, Circle, SpatialReference, GeometryService, webMercatorUtils, Deferred, arrayUtils) {

  var geometryService,
      spatialReference;

	return {

    generatePointGraphicFromGeometric: function (longitude, latitude, attributes) {
      return new Graphic(
        webMercatorUtils.geographicToWebMercator(new Point(longitude, latitude)),
        MapAssets.getDrawUploadSymbolPoint(),
        attributes
      );
    },

		preparePointAsPolygon: function (pointFeature, radius) {
			var circle = new Circle(new Point(pointFeature.geometry), {
            "radius": radius || 50,
            "radiusUnit": Units.KILOMETERS
          });

      return new Graphic(circle, MapAssets.getDrawUploadSymbol(), pointFeature.attributes);
		},

    union: function (polygons) {
      if (Object.prototype.toString.call(polygons) !== '[object Array]') {
        throw new Error('Method expects polygons paramter to be of type Array');
      }

      var deferred = new Deferred(),
          geometryService = geometryService || new GeometryService(MapConfig.geometryServiceUrl);

      if (polygons.length === 1) {
        deferred.resolve(polygons[0]);
      } else {
        geometryService.union(polygons, deferred.resolve, deferred.resolve);
      }
      return deferred;
    }

	};

});
