import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-500">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
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
              await signIn("google")
            }}
          >
            <Button type="submit" className="w-full">
              Entrar com Google
            </Button>
          </form>
          

        </div>
      </div>
    </div>
  )
}