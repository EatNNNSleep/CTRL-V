"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useUI } from "./ui-context"; // Access shared UI state

// Fix missing Leaflet marker icons in Next.js
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Invisible helper component that smoothly flies to new position
function LocationTracker({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 14, { animate: true, duration: 1.5 });
  }, [map, position]);
  return null;
}

// Core map click handler: update location and app-wide address
function MapClickHandler() {
  const { setLocation, setAddress } = useUI();
  
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLocation([lat, lng]); // Update marker position
      
      // Without geocoding API, show coordinates as a readable address label
      setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)} (Custom Pin)`);
    },
  });
  return null;
}

export function MapBackground() {
  // Read current location from shared UI state
  const { location } = useUI();

  // Threat zone center (slightly offset from current location)
  const threatPosition: [number, number] = [location[0] + 0.015, location[1] + 0.02];

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <MapContainer 
        center={location} 
        zoom={14} 
        zoomControl={false} 
        className="w-full h-full cursor-crosshair"
      >
        {/* High-resolution Google satellite tiles */}
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
          maxZoom={20}
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        />
        
        {/* Dynamic marker for current location */}
        <Marker position={location} icon={customIcon}>
          <Popup>
            <div className="text-center">
              <strong className="text-green-600 text-lg">My Farm</strong>
              <br />Location Synced
            </div>
          </Popup>
        </Marker>

        {/* Threat alert circle */}
        <Circle 
          center={threatPosition} 
          radius={1500} 
          pathOptions={{ color: 'red', fillColor: '#ef4444', fillOpacity: 0.4 }} 
        >
          <Popup>⚠️ Alert: High Humidity Risk Area</Popup>
        </Circle>

        {/* Render invisible listener components */}
        <LocationTracker position={location} />
        <MapClickHandler />
      </MapContainer>
    </div>
  );
}