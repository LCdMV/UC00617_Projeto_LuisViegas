import { useState } from "react";

export default function SearchBox({ onSelect }) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);

	const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

	const search = async (text) => {
		setQuery(text);

		if (text.length < 5) {
			setResults([]);
			return;
		}

		const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
			text
		)}&apiKey=${apiKey}`;

		const res = await fetch(url);
		const data = await res.json();

		setResults(data.features || []);
	};

	const handleSelect = (item) => {
		const { lat, lon, formatted } = item.properties;
		onSelect(lat, lon, formatted);
		setResults([]);
		setQuery("");
	};

	return (
		<div style={{ position: "relative" }}>
			<input
				type="text"
				value={query}
				onChange={(e) => search(e.target.value)}
				placeholder="Pesquisar morada..."
				style={{ width: "100%",
					padding: "8px",
					borderStyle: "double",
					borderRadius: "5px" }}
			/>

			{results.length > 0 && (
				<ul
					style={{
						position: "absolute",
						top: "40px",
						left: 0,
						right: 0,
						background: "white",
						border: "1px solid #ccc",
						listStyle: "none",
						padding: 0,
						margin: 0,
						maxHeight: "200px",
						overflowY: "auto",
						zIndex: 1000,
					}}
				>
					{results.map((item) => (
						<li
							key={item.properties.place_id}
							onClick={() => handleSelect(item)}
							style={{
								padding: "8px",
								cursor: "pointer",
								borderBottom: "1px solid #eee",
							}}
						>
							{item.properties.formatted}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
