var map = L.map('map').setView([50.703546, 7.127326], 14);
map.setMaxZoom(20);
map.setMinZoom(10);

var layerControl = L.control.layers({}, {}).addTo(map);

new L.Control.SimpleLocate({
    position: "topleft",
    className: "button-locate",
    afterClick: (result) => {
        // Do something after the button is clicked.
    },
    afterMarkerAdd: () => {
        // Do something after the marker (displaying the device's location and orientation) is added.
    },
    afterDeviceMove: (event) => {
        // Do something after the device moves.
    }
}).addTo(map);

var visibleLayers = [];
var baseLayerName = localStorage.getItem('baseLayerName');
try {
    visibleLayers = JSON.parse(localStorage.getItem('visibleLayers'));
} catch (error) {
    console.log("Could not load from localstore");
}

if (visibleLayers == null) {
    visibleLayers = [];
}


map.on("overlayadd", function (e) {
    if (visibleLayers.indexOf(e.name) < 0) {
        visibleLayers.push(e.name)
    }
    localStorage.setItem('visibleLayers', JSON.stringify(visibleLayers))
}, 1);

map.on("overlayremove", function (e) {
    const index = visibleLayers.indexOf(e.name);
    if (index > -1) {
        visibleLayers.splice(visibleLayers, 1);
    }
    localStorage.setItem('visibleLayers', JSON.stringify(visibleLayers))
}, 1);


map.on("baselayerchange", function (e) {
    localStorage.setItem('baseLayerName', e.name);
}, 1);

(async () => {

    let mapsRes = await fetch("/maps");
    let mapsData = await mapsRes.json();

    firstLayer = true;

    mapsData.forEach(mapInfo => {
        let mapLayer = L.tileLayer(mapInfo["url"], {
            maxZoom: mapInfo["maxZoom"],
            minZoom: mapInfo["minZoom"],
            attribution: '© BaseMao'
        });

        if (baseLayerName == null) {
            if (firstLayer) {
                mapLayer.addTo(map);
                firstLayer = false;
            }
        } else {
            if (mapInfo["name"] == baseLayerName) {
                mapLayer.addTo(map);
            }
        }
        layerControl.addBaseLayer(mapLayer, mapInfo["name"]);
    });

    let overlayRes = await fetch("/overlays");
    let overlayData = await overlayRes.json();

    overlayData.forEach(mapInfo => {
        let mapLayer = L.tileLayer(mapInfo["url"], {
            maxZoom: mapInfo["maxZoom"],
            minZoom: mapInfo["minZoom"],
            attribution: '©'
        });

        if (visibleLayers.indexOf(mapInfo["name"]) > -1) {
            mapLayer.addTo(map);
        }

        layerControl.addOverlay(mapLayer, mapInfo["name"]);

    });
})();
