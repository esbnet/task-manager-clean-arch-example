import { auth } from "@/auth";
import { ModeToggleButton } from "@/components/mode-toggle-button";
import { ClientProviders } from "@/components/providers/client-providers";

export default async function Home() {
	const session = await auth();

	// Se não estiver logado, mostrar página de login
	if (!session) {
		return (
			<div className="flex justify-center items-center bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-500 min-h-screen">
				<div className="space-y-8 bg-white shadow-xl p-8 rounded-lg w-full max-w-md">
					<div className="text-center">
						<h2 className="font-bold text-gray-900 text-3xl">
							Gerenciador de Tarefas
						</h2>
						<p className="mt-2 text-gray-600">
							Faça login para acessar suas tarefas
						</p>
					</div>

					<div className="space-y-4">
						<form
							action={async () => {
								"use server"
								const { signIn } = await import("@/auth")
								await signIn("google", { redirectTo: "/" })
							}}
						>
							<button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full text-white">
								Entrar com Google
							</button>
						</form>
					</div>
				</div>
			</div>
		);
	}

	return (
		<main className="relative flex flex-col gap-4 bg-gradient-to-br from-10% from-indigo-500 via-30% via-sky-500 to-90% to-emerald-500 m-auto p-2 lg:max-w-[80vw] min-h-screen">
			<div className="flex bg-background/80 shadow-xl rounded-lg text-center animate-[fadeIn_1s_ease-in-out_forwards]">
				<div className="flex justify-between items-center p-4 w-full">
					<div className="flex-1 bg-clip-text bg-gradient-to-br from-10% from-indigo-500 via-30% via-sky-500 to-90% to-emerald-500 font-bold text-transparent text-6xl text-center">
						Gerenciador de Tarefas
					</div>
					{/* <div className="flex items-center gap-2">
						<UserAvatar user={session.user ?? { name: "", email: "", image: "" }} />
					</div> */}
				</div>
			</div>

			<div className="flex flex-col flex-1 gap-4 bg-background/50 shadow-xl p-4 rounded-lg animate-[fadeIn_1s_ease-in-out_forwards]">
				<ClientProviders />
			</div>

			<ModeToggleButton />
		</main>
	);
}
