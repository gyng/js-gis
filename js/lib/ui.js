function UI(map, layersBox) {
    this.map = map;
    this.map.width = document.documentElement.clientWidth;
    this.map.height = document.documentElement.clientHeight;
    this.layersBox = layersBox;
    this.setupBindings();
    this.maximizeMap();
}

UI.prototype.setupBindings = function () {
    $(window).resize(function () {
        this.maximizeMap();
    }.bind(this));

    this.map.watch('layers', function (id, oldval, newval) {
        this.drawLayersUI(newval);
        return newval;
    }.bind(this));

    // TODO: fix bad reference by ID
    $('.submit', $('.add-layer-form')).click(function () {
        this.map.addLayer(new Layer($('#layer-url').val()));
    }.bind(this));

    $('.submit', $('.projection-form')).click(function () {
        this.map.setProjection($('#projection').val());
    }.bind(this));
};

UI.prototype.maximizeMap = function () {
    this.map.width = $(window).width();
    this.map.height = $(window).height();
    this.map.resizeSvg(this.map.width, this.map.height);
    this.map.draw();
};

UI.prototype.drawLayersUI = function (layers) {
    this.layersBox.empty();
    console.log("Drawing layers UI");
    layers.forEach(function (e) {
        this.layersBox.append(this.layerUIFactory(e));
    }.bind(this));
};

UI.prototype.layerUIFactory = function (layer) {
    return $(document.createElement('div'))
        .addClass('layer-id')
        .attr('data-layer-id', layer.uid)
        .text(layer.uid)
        .append($(document.createElement('div'))
            .addClass('layer-controls')
                .append($(document.createElement('div'))
                    .addClass('remove-layer')
                    .text('x')
                    .attr('data-layer-id', layer.uid)
                    .click(function () { this.map.removeLayer(layer); }.bind(this))
                )
        );
};