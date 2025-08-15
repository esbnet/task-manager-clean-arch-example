import { Button } from '../ui/button'

export default function SignInForm() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="space-y-8 shadow-xl p-8 rounded-lg w-full max-w-md">
                <div className="text-center">
                    <h2 className="font-bold text-3xl">
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
                        <Button variant={"default"} type="submit" className="px-4 py-2 rounded w-full">
                            Entrar com Google
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
