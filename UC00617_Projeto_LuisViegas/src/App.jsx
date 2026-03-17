import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import SearchBox from "./components/SearchBox";
import Layout from "./components/Layout";

import "./App.css"

export default function App() {
	const mapRef = useRef(null);
	const markerRef = useRef(null);
	const [addresses, setAddresses] = useState([]);

	const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

	useEffect(() => {
		if (!mapRef.current) {
			mapRef.current = L.map("map").setView([38.6979, -9.3015], 13); // Oeiras

			L.tileLayer(
				`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`,
				{ maxZoom: 20 }
			).addTo(mapRef.current);

			mapRef.current.on("click", async (e) => {
				const { lat, lng } = e.latlng;

				if (!markerRef.current) {
					markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
				} else {
					markerRef.current.setLatLng([lat, lng]);
				}

				const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`;
				const res = await fetch(url);
				const data = await res.json();

				const formatted = data.features?.[0]?.properties?.formatted || "Sem morada";
				setAddresses(prev => [...prev, formatted]);
			});
		}
	}, []);

	const handleSelectAddress = (lat, lon, formatted) => {
		mapRef.current.setView([lat, lon], 17);

		if (!markerRef.current) {
			markerRef.current = L.marker([lat, lon]).addTo(mapRef.current);
		} else {
			markerRef.current.setLatLng([lat, lon]);
		}

		setAddresses(prev => [...prev, formatted]);
	};

	return (
		<Layout>
			<div className="text-center">
				<h2>Pesquisar Moradas</h2>
				<SearchBox onSelect={handleSelectAddress} />
			</div>

			<div className="d-flex flex-column my-3">
				<div id="map" className="map-container"></div>
			</div>

			<div className="text-center">
				<h2>Moradas Pesquisadas</h2>
				<div>
					<ul className="list-group list-unstyled">
						{addresses.length === 0 && <li className="list-group-item">Nenhuma</li>}
						{addresses.map((addr, i) => (
							<li key={i} className="list-group-item">{addr}</li>
						))}
					</ul>
				</div>
			</div>
		</Layout>
	);
}
