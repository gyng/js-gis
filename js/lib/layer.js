function Layer(json) {
    this.topojson = null;
    this.loaded = false;
    this.map = void(0);
    this.uid = new Date().getTime(); // TODO: replace with proper UID

    d3.json(json, function (error, topology) {
        this.topology = topology;
        this.loaded = true;
        this.map.draw();
    }.bind(this));
}

Layer.prototype.draw = function () {
    console.log('Drawing', this);

    for (var o in this.topology.objects) {
        this.map.svgDataLayer.insert('path', '.layer')
            .datum(topojson.feature(this.topology, this.topology.objects[o]))
            .attr('d', this.map.path)
            .attr('id', this.uid)
            .attr('class', 'layer');
    }
};