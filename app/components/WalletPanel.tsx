import type { Wallet, Transaction } from "~/services/wallet.service";
import { Form } from "@remix-run/react";

type Props = {
  wallet: Wallet;
  transactions: Transaction[];
};

export default function WalletPanel({ wallet, transactions }: Props) {
  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-lg mt-8 space-y-4">
      <h2 className="text-xl font-semibold">Wallet</h2>
      <p><strong>Balance:</strong> ₹{wallet.balance.toFixed(2)}</p>
      <p><strong>Currency:</strong> {wallet.currency}</p>
      <p><strong>Status:</strong> {wallet.isActive ? "Active" : "Inactive"}</p>

      {/* Create Transaction */}
      <Form method="post" className="space-y-2">
        <input type="hidden" name="walletId" value={wallet.walletId} />
        <input type="hidden" name="action" value="transaction" />

        <div className="flex gap-2">
          <select name="type" className="flex-1 p-2 border rounded">
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
          </select>
          <input name="amount" type="number" step="0.01" placeholder="Amount" className="flex-1 p-2 border rounded" required />
        </div>
        <input name="source" placeholder="Source" className="w-full p-2 border rounded" required />
        <input name="description" placeholder="Description (optional)" className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">
          Submit Transaction
        </button>
      </Form>

      {/* Transaction History */}
      <div>
        <h3 className="font-semibold text-lg mt-4 mb-2">Transaction History</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <ul className="divide-y">
            {transactions.map((tx) => (
              <li key={tx.transactionId} className="py-2">
                <p><strong>{tx.type}</strong> ₹{tx.amount} from {tx.source}</p>
                <p className="text-sm text-gray-500">{tx.status} on {new Date(tx.transactionTime).toLocaleString()}</p>
                {tx.description && <p className="text-sm italic">{tx.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
