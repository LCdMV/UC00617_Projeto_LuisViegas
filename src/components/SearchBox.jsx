import { useState } from "react";

export default function SearchBox({ onSelect }) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);

	// Key para acesso à API
	const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

	// Fazer o auto complete na pesquisa da morada
	const search = async (text) => {
		// Atualiza o estado da pesquisa
		setQuery(text);

		// Só interage com API se tiverem sido inseridas mais de 5 caracteres
		if (text.length < 5) {
			setResults([]);
			return;
		}

		// Pede à API os valores para o auto complete
		const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
			text
		)}&apiKey=${apiKey}`;

		// Aguarda a resposta da API
		const res = await fetch(url);
		const data = await res.json();

		// Atualiza o estado
		setResults(data.features || []);
	};

	// Gere o selecionar na lista drop down do auto complete 
	const handleSelect = (item) => {
		const { lat, lon, formatted } = item.properties;
		
		// Seleciona a informacao necessária
		onSelect(lat, lon, formatted);

		// Atualiza os estados
		setResults([]);
		setQuery("");
	};

	// Renderização
	return (
		<div style={{ position: "relative" }}>
			{/* Caixa de texto para pesquisa */}
			<input type="text"
				value={query}
				onChange={(e) => search(e.target.value)}
				placeholder="Pesquisar morada..."
				className="form-control" />

			{/* Lista drop down com resultados do auto complete */}
			{results.length > 0 && (
				<ul className="drop_down list-group position-absolute w-100"
					style={{ top: "40px", zIndex: 1000 }} >
					{results.map((item) => (
						<li key={item.properties.place_id}
							onClick={() => handleSelect(item)}
							className="list-group-item" >
							{item.properties.formatted}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
