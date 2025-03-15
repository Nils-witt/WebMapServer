var map = L.map('map').setView([50.703546, 7.127326], 14);
map.setMaxZoom(20);
map.setMinZoom(10);

var layerControl = L.control.layers({}, {}).addTo(map);

new L.Control.SimpleLocate({
    position: "topleft",
    className: "button-locate",
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

    let mapsRes = await fetch("/api/maps");
    let mapsData = await mapsRes.json();

    firstLayer = true;

    mapsData.forEach(mapInfo => {
        let mapLayer = L.tileLayer(`/map/${mapInfo["id"]}/${mapInfo["path"]}`, {
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
        let mapLayer = L.tileLayer(`/overlay/${mapInfo["id"]}/${mapInfo["path"]}`, {
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


let icon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBjb2xvcj0iI2ZmZmZmZiIgZmlsbD0idHJhbnNwYXJlbnQiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIgdmlld0JveD0iMCAtMi41IDc1IDU3LjUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGNsaXBQYXRoIGlkPSJ0el9rcmFmdGZhaHJ6ZXVnLWdlbGFlbmRlZ2FlbmdpZyI+PHBhdGggZD0iTTEsNDQgVjEgUTM3LjUsMTAgNzQsMSBWNDQgWiIgLz48L2NsaXBQYXRoPjwvZGVmcz48Zz48cGF0aCBkPSJNMSw0NCBWMSBRMzcuNSwxMCA3NCwxIFY0NCBaIiBmaWxsPSIjY2MwMDAwIiAvPjxjaXJjbGUgY3g9IjEwIiBjeT0iNDkiIHI9IjUiIC8+PGNpcmNsZSBjeD0iMzcuNSIgY3k9IjQ5IiByPSI1IiAvPjxjaXJjbGUgY3g9IjY1IiBjeT0iNDkiIHI9IjUiIC8+PC9nPjxnIGNsaXAtcGF0aD0idXJsKCN0el9rcmFmdGZhaHJ6ZXVnLWdlbGFlbmRlZ2FlbmdpZykiPjxnPjxwYXRoIGQ9Ik0wLDIyLjUgSDc1IE03NSwwIEw1MCwyMi41IEw3NSw0NSIgLz48L2c+PC9nPjxnIGZpbGw9ImJsYWNrIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMSwtMi41KSI+PGNpcmNsZSBjeD0iMyIgY3k9IjMiIHI9IjIiIC8+PGNpcmNsZSBjeD0iMTAiIGN5PSIzIiByPSIyIiAvPjwvZz48L3N2Zz4=',
    iconSize: [40, 95]
})

let marker = L.marker(map.getCenter(), {
    icon: icon

});
marker.bindTooltip("Test Label",
    {
        permanent: true,
        direction: 'bottom',
        offset: [0, 15]
    });
marker.addTo(map);