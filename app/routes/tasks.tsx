import {
  json,
  redirect,
  type LoaderFunction,
  type ActionFunction,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useActionData,
  useSubmit,
  useNavigation,
} from "@remix-run/react";
import { useState } from "react";
import { getSession } from "~/utils/session.server";
import { userService } from "~/services/user.service";
import { taskService } from "~/services/task.service";

// 🧠 Loader: Fetch user, tasks, and user's submissions
export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) return redirect("/login");

  const user = await userService.findUserById(userId);
  if (!user) return redirect("/login");

  const allTasks = await taskService.getAllTasks();
  const userSubmissions = await taskService.getSubmissionsByUser(userId);

  return json({ user, tasks: allTasks, submissions: userSubmissions });
};

// 🧠 Action: Create task or submit to a task based on intent
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "create-task") {
      const title = formData.get("title")?.toString();
      const description = formData.get("description")?.toString();
      const link = formData.get("link")?.toString();
      const amount = Number(formData.get("amount"));
      const expiryDate = formData.get("expiryDate")?.toString();
      const creatorId = formData.get("creatorId")?.toString();

      if (!title || !creatorId || isNaN(amount)) {
        return json({ error: "Missing required fields" }, { status: 400 });
      }

      const newTask = await taskService.createTask({
        creatorId,
        title,
        description,
        link,
        amount,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      });

      return json({ success: true, task: newTask });
    }

    if (intent === "submit-task") {
      const taskId = formData.get("taskId")?.toString();
      const userId = formData.get("userId")?.toString();
      const content = formData.get("content")?.toString();

      if (!taskId || !userId) {
        return json({ error: "Missing submission data" }, { status: 400 });
      }

      const submission = await taskService.submitTask({
        taskId,
        userId,
        content,
      });

      return json({ success: true, submission });
    }

    return json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return json({ error: error.message }, { status: 500 });
  }
};

// 🧠 UI
export default function TasksPage() {
  const { user, tasks, submissions } = useLoaderData<typeof loader>();
  const actionData = useActionData();
  const navigation = useNavigation();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* 🧾 Task Creation */}
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create New Task</h2>

        {actionData?.error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {actionData.error}
          </div>
        )}

        {actionData?.success && actionData.task && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
            Task created successfully!
          </div>
        )}

        <Form method="post" className="space-y-4">
          <input type="hidden" name="intent" value="create-task" />
          <input type="hidden" name="creatorId" value={user.userId} />

          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              required
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Link</label>
            <input
              type="url"
              name="link"
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              min="1"
              step="0.01"
              required
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {navigation.state === "submitting" ? "Creating..." : "Create Task"}
          </button>
        </Form>
      </div>

      {/* 📋 Available Tasks */}
      <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto mb-8">
        <h2 className="text-xl font-semibold mb-4">Available Tasks</h2>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.taskId} className="border rounded p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">{task.title}</h3>
                <span className="text-sm text-gray-500">{task.status}</span>
              </div>
              <p className="text-sm text-gray-600">{task.description}</p>
              {task.link && (
                <a
                  href={task.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Task Link
                </a>
              )}
              <p className="text-sm text-gray-700 mt-1">
                Reward: ${task.amount.toFixed(2)} | Expires:{" "}
                {task.expiryDate
                  ? new Date(task.expiryDate).toLocaleDateString()
                  : "No expiry"}
              </p>

              <Form method="post" className="mt-3 space-y-2">
                <input type="hidden" name="intent" value="submit-task" />
                <input type="hidden" name="taskId" value={task.taskId} />
                <input type="hidden" name="userId" value={user.userId} />

                <textarea
                  name="content"
                  placeholder="Your submission..."
                  className="w-full border rounded px-2 py-1 text-sm"
                />

                <button
                  type="submit"
                  className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 text-sm"
                >
                  Submit Task
                </button>
              </Form>
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ User Submissions */}
      <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Your Submissions</h2>
        <ul className="space-y-3">
          {submissions.map((sub) => (
            <li key={sub.submissionId} className="border rounded p-3">
              <p className="text-sm">
                <strong>Task ID:</strong> {sub.taskId}
              </p>
              <p className="text-sm text-gray-600">{sub.content}</p>
              <p className="text-sm text-gray-500 mt-1">
                Status: {sub.status} | Claimed: {sub.isClaimed ? "Yes" : "No"}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
