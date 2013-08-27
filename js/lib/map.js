function Map(container) {
    this.container = container;
    this.width = 960;
    this.height = 480;
    this.setProjection(d3.geo.equirectangular());
    // this.projection = d3.geo.equirectangular();
    // this.path = d3.geo.path().projection(this.projection);
    this.makeSvg();
    this.layers = [];
}

Map.prototype.setProjection = function (projection) {
    // https://github.com/mbostock/d3/wiki/Geo-Projections
    console.log('projection', typeof projection, eval(projection));
    this.projection = (typeof projection === 'string') ? eval(projection) : projection;
    console.log(this.projection);
    this.path = d3.geo.path().projection(this.projection);
    this.draw();
};

Map.prototype.makeSvg = function () {
    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", function () {
            // Do not call this from transform layer as it will cause pan jitter from transformation
            this.svgTransformLayer.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }.bind(this));

    this.svg = d3.select(container).append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('class', 'map-svg')
        .call(zoom);

    this.svgTransformLayer = this.svg.append('g')
        .attr("transform", "translate(0, 0)");

    this.svgPointerEventsLayer = this.svgTransformLayer.append('rect')
        .attr('width', this.width)
        .attr('height', this.height)
        .style('fill', 'none')
        .style('pointer-events', 'all');

    this.svgDataLayer = this.svgTransformLayer.append('g')
        .attr('class', 'map-svg-data');

    this.svgStack = [this.svg, this.svgTransformLayer, this.svgPointerEventsLayer, this.svgDataLayer];
};

Map.prototype.resizeSvg = function (width, height) {
    // Terrible
    this.svgStack.forEach(function (e) {
        e.attr('width', width).attr('height', height);
    });
};

Map.prototype.addLayer = function (layer) {
    layer.map = this;
    console.log(this.layers);
    this.layers.push(layer);
    var x = this.layers; // Cannot this.layers = this.layers?
    this.layers = x;  // Trigger object.watch on assignment
};

Map.prototype.removeLayer = function (layer) {
    // $('.map-svg-data').empty(); // TODO: more efficient removal
    $('#' + layer.uid).remove();
    this.layers = _(this.layers).reject(function(e) { return e === layer; });
    console.log('x', this.layers);
};

Map.prototype.draw = function () {
    console.log('Drawing', this.layers);
    $('.layer').remove();
    if (!this.layers) return;
    this.layers.forEach(function (e) {
        if (e.loaded) e.draw();
    });
};