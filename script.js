document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = document.getElementById('mapContainer');
    const mapUpload = document.getElementById('mapUpload');
    const clearButton = document.getElementById('clearButton');
    const downloadButton = document.getElementById('downloadButton');
    const layerControls = document.getElementById('layerControls');
    const fullscreenButton = document.getElementById('fullscreenButton');

    let maps = [];

    // Base maps to load on startup
    const baseMaps = [
        {
            name: "Basiskaart 1",
            path: "maps/base-map-1.png"
        },
        {
            name: "Basiskaart 2",
            path: "maps/base-map-2.png"
        }
    ];

    // Load base maps on startup
    function loadBaseMaps() {
        // Clear the "No maps uploaded yet" message
        layerControls.innerHTML = '';

        // Load each base map
        baseMaps.forEach(map => {
            // Create a new image element to load the base map
            const img = new Image();
            img.onload = function() {
                // Once loaded, add it to the map display
                addMap(img.src, map.name);
            };
            img.onerror = function() {
                console.error(`Failed to load base map: ${map.path}`);
            };
            img.src = map.path;
        });
    }

    // Handle map uploads
    mapUpload.addEventListener('change', function(e) {
        const files = e.target.files;

        if (files.length === 0) return;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type === 'image/png') {
                const reader = new FileReader();

                reader.onload = function(event) {
                    addMap(event.target.result, file.name);
                };

                reader.readAsDataURL(file);
            }
        }

        mapUpload.value = '';
    });

    // Add a map to the container
    function addMap(src, name) {
        const id = 'map-' + Date.now();
        const mapIndex = maps.length;

        // Create map layer
        const mapLayer = document.createElement('div');
        mapLayer.className = 'map-layer';
        mapLayer.id = id;

        const img = document.createElement('img');
        img.src = src;
        mapLayer.appendChild(img);

        mapContainer.appendChild(mapLayer);

        // Create layer control
        const layerControl = document.createElement('div');
        layerControl.className = 'layer-control';

        const layerName = document.createElement('div');
        layerName.className = 'layer-name';
        layerName.textContent = name || `Map ${mapIndex + 1}`;

        const visibilityToggle = document.createElement('input');
        visibilityToggle.type = 'checkbox';
        visibilityToggle.checked = true;
        visibilityToggle.addEventListener('change', function() {
            mapLayer.style.display = this.checked ? 'block' : 'none';
        });

        const opacitySlider = document.createElement('input');
        opacitySlider.type = 'range';
        opacitySlider.min = '0';
        opacitySlider.max = '100';
        opacitySlider.value = '70';
        opacitySlider.addEventListener('input', function() {
            mapLayer.style.opacity = this.value / 100;
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '×';
        deleteButton.style.marginLeft = '5px';
        deleteButton.style.backgroundColor = '#f44336';
        deleteButton.addEventListener('click', function() {
            mapContainer.removeChild(mapLayer);
            layerControls.removeChild(layerControl);
            maps = maps.filter(m => m.id !== id);

            if (maps.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'layer-control';
                emptyMessage.innerHTML = '<div class="layer-name">Nog geen kaarten geüpload</div>';
                layerControls.appendChild(emptyMessage);
            }
        });

        // Add a label for the opacity slider
        const opacityLabel = document.createElement('span');
        opacityLabel.textContent = 'Transparantie:';
        opacityLabel.style.display = 'none'; // Hidden by default for cleaner UI

        // Create a container for the opacity slider
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';
        sliderContainer.appendChild(opacitySlider);

        // Apply grid areas to elements
        visibilityToggle.style.gridArea = "visibility";
        layerName.style.gridArea = "name";
        sliderContainer.style.gridArea = "slider";
        deleteButton.style.gridArea = "delete";

        // Add elements to the layer control
        layerControl.appendChild(visibilityToggle);
        layerControl.appendChild(layerName);
        layerControl.appendChild(deleteButton);
        layerControl.appendChild(sliderContainer);

        if (maps.length === 0) {
            layerControls.innerHTML = '';
        }

        layerControls.appendChild(layerControl);

        maps.push({ id, name, src });
    }

    // Clear all maps
    clearButton.addEventListener('click', function() {
        mapContainer.innerHTML = '<button class="fullscreen-button" id="fullscreenButton">⛶</button>';
        layerControls.innerHTML = '<div class="layer-control"><div class="layer-name">Nog geen kaarten geüpload</div></div>';
        maps = [];

        // Reconnect fullscreen button
        document.getElementById('fullscreenButton').addEventListener('click', toggleFullscreen);
    });

    // Save current view
    downloadButton.addEventListener('click', function() {
        // This is a simple approach - for a proper implementation,
        // you would need to use a canvas to composite the images
        alert("In een werkende versie zou je bijvoorbeeld de png kunnen opslaan. Misschien zelfs mailen?");
    });

    // Fullscreen toggle
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            if (mapContainer.requestFullscreen) {
                mapContainer.requestFullscreen();
            } else if (mapContainer.mozRequestFullScreen) {
                mapContainer.mozRequestFullScreen();
            } else if (mapContainer.webkitRequestFullscreen) {
                mapContainer.webkitRequestFullscreen();
            } else if (mapContainer.msRequestFullscreen) {
                mapContainer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    fullscreenButton.addEventListener('click', toggleFullscreen);

    // Load base maps when the page loads
    loadBaseMaps();
});