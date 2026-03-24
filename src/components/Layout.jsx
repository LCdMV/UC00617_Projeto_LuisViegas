// Biblioteca Básica
import React from "react";

export default function Layout({ children }) {
	return (
		<div className="d-flex flex-column min-vh-100 p-0">
			<main className="flex-grow-1 m-5">
				{children}
			</main>

			<footer className="bg-dark text-light pt-0 pb-3 mt-0">
				<div className="container">
					<div className="text-center pt-3">
						<p className="mb-0">© 2026 - Autor Luis Viegas.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
