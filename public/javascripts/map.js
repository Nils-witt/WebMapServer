var map = L.map('map');
map.setView([50.703546, 7.127326], 14)
map.setMaxZoom(22);
map.setMinZoom(10);


(async () => {
    
    try {
        let mapZoom = localStorage.getItem('mapZoom');
        let mapCenter = JSON.parse(localStorage.getItem('mapCenter'));
        if (mapZoom != null && mapCenter != null) {
            map.setView([mapCenter["lat"], mapCenter["lng"]], parseInt(mapZoom));
        }
    } catch (error) {
        console.log("Could not load from localstore");
    }
    
    
})();

var layerControl = L.control.layers({}, {},{autoZIndex: false}).addTo(map);

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


map.on('moveend', function () {
    localStorage.setItem('mapCenter', JSON.stringify(map.getCenter()));
    localStorage.setItem('mapZoom', map.getZoom());
},1);

(async () => {

    let mapsRes = await fetch("/api/maps");
    let mapsData = await mapsRes.json();

    firstLayer = true;

    mapsData.forEach(mapInfo => {
        let url = mapInfo["url"]
        if (!mapInfo["isRemote"]) {
            url = `/map/${mapInfo["id"]}/${mapInfo["url"]}`;
        }
        
        let mapLayer = L.tileLayer(url, {
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

    let overlayRes = await fetch("/api/overlays");
    let overlayData = await overlayRes.json();

    overlayData.forEach(mapInfo => {
        let mapLayer = L.tileLayer(`/overlay/${mapInfo["id"]}${mapInfo["url"]}`, {
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