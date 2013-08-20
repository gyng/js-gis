require([
    "vendor/d3.v3.min",
    "vendor/d3.geo.projection.v0.min",
    "vendor/topojson.v1.min",
    "vendor/underscore-min",
    "vendor/object-watch",
    "vendor/jquery.min",
    "lib/ui",
    "lib/layer",
    "lib/map"], function() {
    'use strict';

    $(document).ready(function () {
        console.log('js-gis started');
        var map = new Map('#container');
        var ui = new UI(map, $('.layers').first());
        map.addLayer(new Layer('http://gist.github.com/gyng/5574607/raw/06a809ee72ffae428e674e2bd82cbed79fbaf5fe/worldmap.json'));
        // map.addLayer(new Layer('http://bl.ocks.org/mbostock/raw/6116436/98323f8372cb877f903d5bd69e7b5f31c80d8770/us.json'));
    });
})();