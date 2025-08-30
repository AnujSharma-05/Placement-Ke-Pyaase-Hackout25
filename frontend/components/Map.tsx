import React, { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { indiaMapData } from '../data/mockData';
import { InfrastructureType, InfrastructureProperties } from '../types';

// Leaflet's default icon path issue with bundlers, fix it.
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapProps {
  visibleLayers: { [key in InfrastructureType]?: boolean };
  pinpoint: L.LatLng | null;
  onMapClick: (latlng: L.LatLng) => void;
}

const getIcon = (type: InfrastructureType) => {
    const colors: Record<string, string> = {
        demand: '#9333ea',    // purple-600
        hub: '#2563eb',       // blue-600
        solar: '#f97316',     // orange-500
        wind: '#0891b2',      // cyan-600
        pinpoint: '#e11d48',   // rose-600
    };
    const color = colors[type] || '#6b7280'; // gray as fallback
    
    // SVG paths for different icons
    const svgPaths: Record<string, string> = {
      demand: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>', // Building/Factory
      hub: '<path d="M20 6c0-1.1-.9-2-2-2h-4c0-1.66-1.34-3-3-3S8 2.34 8 4H4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h1v4H4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h4c0 1.66 1.34 3 3 3s3-1.34 3-3h4c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2h-1v-4h1c1.1 0 2-.9 2-2V6zm-7 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-16c0-.55.45-1 1-1s1 .45 1 1H4v4h16V6h-6z"/>', // Simplified Port/Hub
      solar: '<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.03-.29.08-.58.14-.86L2.35 11.4l1.41-1.41 1.79 1.79c.28-.06.57-.11.86-.14V10h2v1.79c.29.03.58.08.86.14l1.79-1.79 1.41 1.41-1.79 1.79c.06.28.11.57.14.86H22v-2h-1.79c-.03.29-.08.58-.14.86l1.79 1.79-1.41 1.41-1.79-1.79c-.28.06-.57.11-.86.14V16h-2v-1.79c-.29-.03-.58-.08-.86-.14l-1.79 1.79-1.41-1.41 1.79-1.79c-.06-.28-.11-.57-.14-.86H2v2z"/>', // Sun
      wind: '<path d="M12 12c-1.84 0-3.38 1.22-3.86 2.84L5.3 13.42c-.52-.3-1.1-.5-1.7-.58L3 14.28V12h-.5L2 11.5V10h.5L3 9.5v-1.4L4.6 6.6c.6-.08 1.18-.28 1.7-.58l-2.84-2.84L4.88 2l2.84 2.84C8.78 4.38 10.32 3 12 3c3.31 0 6 2.69 6 6s-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-7.48.6L6.6 4.68c-.3.52-.5 1.1-.58 1.7L4.58 6.96l-.88-.88.88-.88zM19 12v.5l.5.5H22v-1.5l-.5-.5H20v-.58c-.08-.6-.28-1.18-.58-1.7l2.84-2.84L21.12 4l-2.84 2.84c-.48-.46-1.04-.84-1.66-1.12L18 4h-2v.5l-.5.5H14v2h1.5l.5-.5V10c.6.08 1.18.28 1.7.58l2.84 2.84-1.41 1.41-2.84-2.84c-.46.48-.84 1.04-1.12 1.66L14 14h-2v2h.5l.5-.5H16v2h2l1.42.58c.08-.6.28-1.18.58-1.7L22.84 19.12 24 18l-2.84-2.84c.46-.48.84-1.04 1.12-1.66L23 12h-4z"/>',
      pinpoint: `<path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>`,
    };

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32px" height="32px" style="filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));">
      ${svgPaths[type] || '<circle cx="12" cy="12" r="8"/>'}
    </svg>`;

    return L.divIcon({
        html: svg,
        className: 'bg-transparent border-0',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
    });
};

const createPopupContent = (props: InfrastructureProperties) => {
    let content = `<div class="font-sans max-w-xs"><h3 class="font-bold text-lg mb-1">${props.name || 'Unnamed Feature'}</h3><div class="space-y-1">`;
  
    for (const [key, value] of Object.entries(props)) {
        if (key === 'name' || key === 'type' || key.toLowerCase().includes('sl. no.') || !value) continue;
        
        // Format key for display
        const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        content += `<p><strong>${formattedKey}:</strong> ${value}</p>`;
    }
    content += `</div></div>`;
    return content;
};

const Map: React.FC<MapProps> = ({ visibleLayers, pinpoint, onMapClick }) => {
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<{[key: string]: L.LayerGroup}>({});
  const pinpointMarkerRef = useRef<L.Marker | null>(null);

  const dataLayers = useMemo(() => indiaMapData, []);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map-container').setView([20.5937, 78.9629], 5); // Center on India
      mapRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Initialize layer groups
      Object.keys(dataLayers).forEach(key => {
        layersRef.current[key] = L.layerGroup().addTo(map);
      });
      
      map.on('click', (e) => {
        onMapClick(e.latlng);
      });
    }
    
    return () => {
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }
    };
  }, [onMapClick, dataLayers]);

  // Handle data layer visibility
  useEffect(() => {
    if (!mapRef.current) return;

    Object.entries(dataLayers).forEach(([key, geoJsonData]) => {
      const layerGroup = layersRef.current[key];
      layerGroup.clearLayers();

      if (visibleLayers[key as InfrastructureType] && geoJsonData) {
        L.geoJSON(geoJsonData as any, {
          pointToLayer: (feature, latlng) => {
            const type = feature.properties.type as InfrastructureType;
            const marker = L.marker(latlng, { icon: getIcon(type) });
            const popupContent = createPopupContent(feature.properties);
            marker.bindPopup(popupContent);
            return marker;
          },
        }).addTo(layerGroup);
      }
    });
  }, [visibleLayers, dataLayers]);
  
  // Handle pinpoint marker
  useEffect(() => {
    if (!mapRef.current) return;

    if (pinpoint) {
      if (!pinpointMarkerRef.current) {
        pinpointMarkerRef.current = L.marker(pinpoint, { 
          icon: getIcon('pinpoint'),
          zIndexOffset: 1000 
        }).addTo(mapRef.current);
      } else {
        pinpointMarkerRef.current.setLatLng(pinpoint);
      }
    } else {
      if (pinpointMarkerRef.current) {
        pinpointMarkerRef.current.remove();
        pinpointMarkerRef.current = null;
      }
    }
  }, [pinpoint]);


  return <div id="map-container" className="h-full w-full" />;
};

export default Map;
