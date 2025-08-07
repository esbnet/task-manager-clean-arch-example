import { auth } from "@/auth"

export default async function TestAuth() {
  const session = await auth()
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Auth</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(session, null, 2)}
      </pre>
      <div className="mt-4">
        <p>Environment variables:</p>
        <ul className="list-disc ml-4">
          <li>GOOGLE_CLIENT_ID: {process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set'}</li>
          <li>GOOGLE_CLIENT_SECRET: {process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set'}</li>
          <li>AUTH_SECRET: {process.env.AUTH_SECRET ? 'Set' : 'Not set'}</li>
          <li>NEXTAUTH_URL: {process.env.NEXTAUTH_URL ? 'Set' : 'Not set'}</li>
        </ul>
      </div>
    </div>
  )
}