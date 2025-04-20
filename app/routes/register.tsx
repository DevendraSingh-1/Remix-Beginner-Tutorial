// app/routes/register.tsx
import { Form, Link, useActionData, useNavigate } from "@remix-run/react";
import { userService } from "~/services/user.service";
import type { User } from "~/services/user.service";
import { useEffect } from "react";

type ActionData = { error?: string; user?: User };

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const referCode = formData.get("referCode") as string;

  try {
    const user = await userService.createUser({
      username,
      email,
      password,
      phoneNumber,
      referCode,
    });
    return { user };
  } catch (e: any) {
    return { error: e.message };
  }
};

export default function Register() {
  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.user) {
      localStorage.setItem("userLogged", JSON.stringify(actionData.user));
      navigate(`/profile/${actionData.user.userId}`);
    }
  }, [actionData, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <Form method="post" className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-center">Register</h2>
        <input name="username" placeholder="Username" className="w-full p-2 border rounded" required />
        <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded" required />
        <input type="password" name="password" placeholder="Password" className="w-full p-2 border rounded" required />
        <input name="phoneNumber" placeholder="Phone Number (optional)" className="w-full p-2 border rounded" />
        <input name="referCode" placeholder="Refer Code (optional)" className="w-full p-2 border rounded" />
        {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Register</button>
        <Link
            to="/login"
            className="block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </Link>
      </Form>
    </div>
  );
}
