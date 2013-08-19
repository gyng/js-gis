(function () {
    'use strict';

    $(document).ready(function () {
        console.log('Started');
        var map = new Map('#container');
        var ui = new UI(map);
        map.addLayer(new Layer('http://gist.github.com/gyng/5574607/raw/06a809ee72ffae428e674e2bd82cbed79fbaf5fe/worldmap.json'));
    });

    function UI(map) {
        this.map = map;
        this.map.width = document.documentElement.clientWidth;
        this.map.height = document.documentElement.clientHeight;
        this.setupBindings();
        this.maximizeMap();
    }

    UI.prototype.setupBindings = function () {
        $(window).resize(function () {
            this.maximizeMap();
        }.bind(this));
    };

    UI.prototype.maximizeMap = function () {
        this.map.width = $(window).width();
        this.map.height = $(window).height();
        this.map.resizeSvg(this.map.width, this.map.height);
        this.map.draw();
    };

    function Map(container) {
        this.container = container;
        this.width = 960;
        this.height = 480;
        this.projection = d3.geo.equirectangular();
        this.path = d3.geo.path().projection(this.projection);
        this.makeSvg();
        this.layers = [];
    }

    Map.prototype.makeSvg = function () {
        this.svg = d3.select(container).append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('class', 'map-svg');
    };

    Map.prototype.resizeSvg = function (width, height) {
        this.svg
            .attr('width', width)
            .attr('height', height);
    };

    Map.prototype.addLayer = function (layer) {
        layer.map = this;
        this.layers.push(layer);
    };

    Map.prototype.draw = function () {
        console.log('Drawing', this);

        this.layers.forEach(function (e) {
            if (e.loaded) e.draw();
        });
    };

    function Layer(json) {
        this.topojson = null;
        this.loaded = false;
        this.map = void(0);

        d3.json(json, function (error, topology) {
            this.topology = topology;
            this.loaded = true;
            this.map.draw();
        }.bind(this));
    }

    Layer.prototype.draw = function () {
        console.log('Drawing', this);

        for (var o in this.topology.objects) {
            this.map.svg.insert('path', '.layer')
                .datum(topojson.feature(this.topology, this.topology.objects[o]))
                .attr('d', this.map.path);
        }
    };
})();