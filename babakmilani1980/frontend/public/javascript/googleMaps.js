// frontend/public/javascript/googleMaps.js

document.addEventListener('DOMContentLoaded', () => {
    const loader = new google.maps.plugins.loader.Loader({
        apiKey: process.env.MAPS_API, // Replace with your actual API key
        version: "weekly",
        libraries: ["places"]
    });

    loader.load()
        .then(() => initializeMap())
        .catch((e) => {
            console.error("Error loading Google Maps API:", e);
        });
});

async function fetchEmergencyData() {
    try {
        const response = await fetch('/maps/data');
        if (!response.ok) throw new Error('Failed to fetch emergency data');
        return await response.json();
    } catch (error) {
        console.error("Error fetching emergency data:", error);
        return [];
    }
}

function initializeMap() {
    // Initialize the map
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.7749, lng: -122.4194 }, // Default center
        zoom: 10,
    });

    // Initialize the Places SearchBox
    const input = document.getElementById("text"); // Attach search input
    const searchBox = new google.maps.places.SearchBox(input);

    // Bias the search results to the map's current bounds
    map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
    });

    let searchMarkers = [];
    searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();

        if (!places || places.length === 0) return;

        // Clear existing search markers
        searchMarkers.forEach(marker => marker.setMap(null));
        searchMarkers = [];

        const bounds = new google.maps.LatLngBounds();
        places.forEach(place => {
            if (!place.geometry || !place.geometry.location) return;

            const marker = new google.maps.Marker({
                map,
                position: place.geometry.location,
                title: place.name,
                icon: {
                    url: place.icon,
                    scaledSize: new google.maps.Size(30, 30),
                },
            });

            searchMarkers.push(marker);

            if (place.geometry.viewport) bounds.union(place.geometry.viewport);
            else bounds.extend(place.geometry.location);
        });

        map.fitBounds(bounds);
    });

    // Fetch and render emergency data
    fetchEmergencyData().then((data) => {
        if (!data || data.length === 0) {
            console.warn("No emergency data received.");
            return;
        }

        data.forEach((emergency) => {
            const marker = new google.maps.Marker({
                position: { lat: emergency.lat, lng: emergency.lng },
                map: map,
                title: emergency.agency,
                icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", // Custom icon for emergency markers
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div>
                        <h4>${emergency.agency}</h4>
                        <p><strong>Emergency:</strong> ${emergency.emergency}</p>
                        <p><strong>Threat:</strong> ${emergency.threat}</p>
                        <p><strong>Address:</strong> ${emergency.address}, ${emergency.state}, ${emergency.zip}</p>
                    </div>
                `,
            });

            marker.addListener("click", () => {
                infoWindow.open(map, marker);
            });
        });
    }).catch((error) => {
        console.error("Error rendering markers:", error);
    });
}

