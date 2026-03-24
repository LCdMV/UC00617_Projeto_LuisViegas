import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import SearchBox from "./components/SearchBox";
import Layout from "./components/Layout";

import "./App.css"

export default function App() {
	const tileMapaRef = useRef(null);
	const markerRef = useRef(null);
	const [addresses, setAddresses] = useState([]);

	// Key para acesso à API
	const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

	// Icon para o pin no mapa
	const markerIcon = L.icon({
		iconUrl: `https://api.geoapify.com/v2/icon/?type=awesome&color=%23990c0c&size=35&icon=user&iconType=lucide&contentSize=15&contentColor=%23990c0c&noShadow&apiKey=${apiKey}`,
		iconSize: [35, 45],
		iconAnchor: [17, 42],
		popupAnchor: [0, -40]
	});

	// Icon para o Marker Home
	const homeMarkerIcon = L.icon({
		iconUrl: `https://api.geoapify.com/v2/icon/?type=circle&color=%23990c0c&size=50&icon=house&iconType=lucide&contentSize=20&contentColor=%23990c0c&noShadow&apiKey=${apiKey}`,
		iconSize: [35, 45],
		iconAnchor: [17, 42],
		popupAnchor: [0, -40]
	});

	// Mostrar e gerir o tile com o mapa
	useEffect(() => {
		if (!tileMapaRef.current) {
			// Ponto inicial do mapa
			tileMapaRef.current = L.map("map").setView([38.706133, -9.351160], 15); // Escola Matilde Rosa Araújo

			// Cria tile para o mapa
			L.tileLayer(
				`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`,
				{ maxZoom: 20 }
			).addTo(tileMapaRef.current);

			// Popup do Marker Home
			const homeMarkerPopup = L.popup().setContent("Escola Matilde Rosa Araújo");
			L.marker([38.706133, -9.351160], {
				icon: homeMarkerIcon
			}).bindPopup(homeMarkerPopup).addTo(tileMapaRef.current);

			// Adquirir coordenadas clicando no mapa e fazer reverse lookup para obter morada
			tileMapaRef.current.on("click", async (e) => {
				const { lat, lng } = e.latlng;

				// Atualiza o pin no mapa
				if (!markerRef.current) {
					markerRef.current = L.marker([lat, lng], { icon: markerIcon }).addTo(tileMapaRef.current);
				} else {
					markerRef.current.setLatLng([lat, lng]);
				}

				// Faz o reverse lookup à morada
				const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`;
				const res = await fetch(url);
				const data = await res.json();

				// Guarda os valores dados pela API na lista de moradas
				const formatted = data.features?.[0]?.properties?.formatted || "Sem morada";
				setAddresses(prev => [...prev, formatted]);
			});
		}
	}, []);

	// Pesquisar uma morada
	const handleSelectAddress = (lat, lon, formatted) => {
		// Centra o mapa na morada
		tileMapaRef.current.setView([lat, lon], 17);

		// Atualiza o pin no mapa
		if (!markerRef.current) {
			markerRef.current = L.marker([lat, lon], { icon: markerIcon }).addTo(tileMapaRef.current);
		} else {
			markerRef.current.setLatLng([lat, lon]);
		}

		// Guarda a morada na lista
		setAddresses(prev => [...prev, formatted]);
	};

	// Rever uma morada apresentada da lista de moradas procuradas
	const handleSelectOnList = async (address) => {
		// Procura a morada selecionada na API
		const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
			address
		)}&apiKey=${apiKey}`;

		// Recebe a informação da API
		const res = await fetch(url);
		const data = await res.json();

		// Centra o mapa na morada
		const { lat, lon } = data.features?.[0]?.properties || [ 38.6979, -9.3015 ];
		tileMapaRef.current.setView([lat, lon], 17);

		// Atualiza o pin no mapa
		if (!markerRef.current) {
			markerRef.current = L.marker([lat, lon], { icon: markerIcon }).addTo(tileMapaRef.current);
		} else {
			markerRef.current.setLatLng([lat, lon]);
		}
	};

	// Renderização
	return (
		<Layout>
			{/* Caixa de pesquisa */}
			<div className="text-center">
				<h2>Pesquisar Moradas</h2>
				<SearchBox onSelect={handleSelectAddress} />
			</div>

			{/* Tile do Mapa */}
			<div className="d-flex flex-column my-3">
				<div id="map" className="map-container"></div>
			</div>

			{/* Lista de moradas */}
			<div className="text-center">
				<h2>Moradas Pesquisadas</h2>
				<div>
					<ul className="list-group list-unstyled">
						{addresses.length === 0 && <li className="list-group-item">Nenhuma</li>}
						{addresses.map((addr, i) => (
							<li key={i} className="list-group-item" onClick={() => handleSelectOnList(addr)}>
									{addr}
							</li>
						))}
					</ul>
				</div>
			</div>
		</Layout>
	);
}
