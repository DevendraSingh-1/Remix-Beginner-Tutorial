// app/routes/login.tsx
import {
    ActionFunctionArgs,
    json,
    redirect,
  } from "@remix-run/node";
  import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
  import { userService } from "~/services/user.service";
  import { verifyPassword } from "~/utils/auth.server";
  import { getSession, commitSession } from "~/utils/session.server";
  
  type ActionData = { error?: string };
  
  export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
  
    const user = await userService.findUserByEmail(email);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return json<ActionData>({ error: "Invalid credentials" }, { status: 401 });
    }
  
    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", user.userId);
  
    return redirect(`/profile/${user.userId}`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  };
  
  export default function Login() {
    const actionData = useActionData<ActionData>();
    const navigation = useNavigation();
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-100">
        <Form method="post" className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
          <h2 className="text-xl font-semibold text-center">Login</h2>
          <input
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            required
          />
          {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
            disabled={navigation.state === "submitting"}
          >
            {navigation.state === "submitting" ? "Logging in..." : "Login"}
          </button>
          <Link
            to="/register"
            className="block w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 text-center"
          >
            Register
          </Link>
        </Form>
      </div>
    );
  }
  