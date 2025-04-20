import { Form, Link, redirect, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { userService } from "~/services/user.service";
import { walletService } from "~/services/wallet.service";
import { locationService } from "~/services/location.service";
import type { User } from "~/services/user.service";
import type { Wallet } from "~/services/wallet.service";
import type { Location } from "~/services/location.service";
import WalletPanel from "~/components/WalletPanel";

export const loader = async ({ params }: { params: { id: string } }) => {
  const user = await userService.findUserById(params.id);
  if (!user) return redirect("/");

  let wallet = await walletService.getWallet(user.userId);
  if (!wallet) {
    wallet = await walletService.createWallet(user.userId);
  }

  const transactions = await walletService.getTransactions(wallet.walletId);
  const locations = await locationService.getUserLocations(user.userId);

  return { user, wallet, transactions, locations };
};

export const action = async ({ request, params }: { request: Request; params: { id: string } }) => {
  const formData = await request.formData();
  const actionType = formData.get("action");

  if (actionType === "logout") return redirect("/login");

  if (actionType === "delete") {
    await userService.updateUser(params.id, { isActive: false });
    return redirect("/register");
  }

  if (actionType === "update") {
    return await userService.updateUser(params.id, {
      username: formData.get("username") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      referCode: formData.get("referCode") as string,
    });
  }

  if (actionType === "transaction") {
    const walletId = formData.get("walletId") as string;
    const type = formData.get("type") as "Credit" | "Debit";
    const amount = parseFloat(formData.get("amount") as string);
    const source = formData.get("source") as string;
    const description = formData.get("description") as string;

    await walletService.createTransaction({
      walletId,
      type,
      amount,
      source,
      description,
    });

    return null;
  }

  if (actionType === "addLocation") {
    await locationService.createLocation({
      userId: params.id,
      latitude: parseFloat(formData.get("latitude") as string),
      longitude: parseFloat(formData.get("longitude") as string),
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      country: formData.get("country") as string,
    });

    return null;
  }

  if (actionType === "setDefaultLocation") {
    await locationService.setDefaultLocation(
      params.id,
      formData.get("locationId") as string
    );

    return null;
  }
};

export default function Profile() {
  const { user, wallet, transactions, locations } = useLoaderData<{
    user: User;
    wallet: Wallet;
    transactions: any[];
    locations: Location[];
  }>();

  const logoutHandler = (action: string) => {
    if (action === "logout" || action === "delete") {
      localStorage.removeItem("userLogged");
    }
  };

  useEffect(() => {
    if (locations.length === 0 && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          const address = data.display_name || "";
          const city = data.address.city || data.address.town || data.address.village || "";
          const country = data.address.country || "";

          const form = document.getElementById("location-form") as HTMLFormElement;

          if (form) {
            (form.elements.namedItem("latitude") as HTMLInputElement).value = latitude.toString();
            (form.elements.namedItem("longitude") as HTMLInputElement).value = longitude.toString();
            (form.elements.namedItem("address") as HTMLInputElement).value = address;
            (form.elements.namedItem("city") as HTMLInputElement).value = city;
            (form.elements.namedItem("country") as HTMLInputElement).value = country;

            form.submit();
          }
        } catch (error) {
          console.error("Failed to reverse geocode location:", error);
        }
      });
    }
  }, [locations]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <Form method="post" className="bg-white p-6 rounded shadow-md w-full max-w-lg space-y-4">
        <h2 className="text-xl font-semibold">Profile</h2>

        <label>Email (read-only)</label>
        <input value={user.email} readOnly className="w-full p-2 border rounded bg-gray-100" />

        <label>Username</label>
        <input name="username" defaultValue={user.username} className="w-full p-2 border rounded" />

        <label>Phone Number</label>
        <input name="phoneNumber" defaultValue={user.phoneNumber} className="w-full p-2 border rounded" />

        <label>Refer Code</label>
        <input name="referCode" defaultValue={user.referCode} className="w-full p-2 border rounded" />

        <div className="flex space-x-2">
          <button name="action" value="update" className="bg-yellow-500 text-white px-4 py-2 rounded">
            Update Profile
          </button>
          <button
            name="action"
            value="logout"
            onClick={() => logoutHandler("logout")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
          <button
            name="action"
            value="delete"
            onClick={() => logoutHandler("delete")}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Account
          </button>
        </div>
      </Form>

      <WalletPanel wallet={wallet} transactions={transactions} />

      {/* Locations Section */}
      <div className="mt-10 bg-white p-6 rounded shadow-md w-full max-w-lg space-y-4">
        <h3 className="text-lg font-semibold">Locations</h3>

        {locations.length === 0 ? (
          <p>No locations added yet. Fetching your current location...</p>
        ) : (
          <ul className="space-y-2">
            {locations.map((loc) => (
              <li
                key={loc.locationId}
                className={`p-3 border rounded ${
                  loc.isDefault ? "bg-green-100" : "bg-gray-50"
                }`}
              >
                <p>{loc.address}, {loc.city}, {loc.country}</p>
                <p className="text-xs text-gray-500">Lat: {loc.latitude}, Lng: {loc.longitude}</p>
                {!loc.isDefault && (
                  <Form method="post">
                    <input type="hidden" name="locationId" value={loc.locationId} />
                    <button
                      type="submit"
                      name="action"
                      value="setDefaultLocation"
                      className="text-blue-600 underline text-sm"
                    >
                      Set as default
                    </button>
                  </Form>
                )}
                {loc.isDefault && <p className="text-green-700 text-sm font-semibold">Default</p>}
              </li>
            ))}
          </ul>
        )}

        <Form method="post" className="space-y-2 mt-6" id="location-form">
          <input type="hidden" name="action" value="addLocation" />
          <input name="address" placeholder="Address" className="w-full p-2 border rounded" />
          <input name="city" placeholder="City" className="w-full p-2 border rounded" />
          <input name="country" placeholder="Country" className="w-full p-2 border rounded" />
          <input type="hidden" name="latitude" />
          <input type="hidden" name="longitude" />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Location
          </button>
        </Form>
      </div>

      <div className="mt-8 w-full max-w-lg text-center">
        <Link
          to="/tasks"
          className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Go to Task Manager
        </Link>
      </div>
    </div>
  );
}
