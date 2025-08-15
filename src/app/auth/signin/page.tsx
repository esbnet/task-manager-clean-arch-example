import { Button } from "@/components/ui/button"
import { signIn } from "@/auth"

export default function SignIn() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="space-y-8 bg-gray-200 shadow-xl p-8 rounded-lg w-full max-w-md">
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