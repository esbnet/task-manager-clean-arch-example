// App.js

function Vidro() {
	return (
		<div className="flex flex-col justify-center items-center bg-gradient-to-br from-blue-400 to-purple-600 p-6 min-h-screen">
			{/* Header com Animação */}
			<header className="bg-white/30 opacity-0 shadow-lg backdrop-blur-md mb-6 px-6 py-4 rounded-lg w-full max-w-4xl font-semibold text-white text-lg animate-[fadeIn_1s_ease-in-out_forwards]">
				Meu Cabeçalho com Efeito de Vidro
			</header>

			{/* Conteúdo Principal com Animação */}
			<main className="bg-white/20 opacity-0 shadow-xl backdrop-blur-md mb-6 p-8 rounded-xl w-full max-w-4xl text-white animate-[slideUp_1s_ease-in-out_forwards]">
				<h1 className="mb-4 font-bold text-2xl">
					Bem-vindo à Tela com Vidro
				</h1>
				<p className="opacity-90 text-sm">
					Este é um exemplo de layout com efeito de vidro
					(glassmorphism) usando React e Tailwind CSS. Você pode
					personalizar o conteúdo aqui dentro como quiser!
				</p>
			</main>

			{/* Footer com Animação */}
			<footer className="bg-white/30 opacity-0 shadow-lg backdrop-blur-md px-6 py-4 rounded-lg w-full max-w-4xl text-white text-sm text-center animate-[fadeIn_1s_ease-in-out_0.5s_forwards]">
				&copy; {new Date().getFullYear()} - Tela com Efeito de Vidro
			</footer>
		</div>
	);
}

export default Vidro;
