import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    totalItems: 10,
    availableItems: 7,
    rentedItems: 3,
    totalTransactions: 120,
    totalCustomers: 45
  });
}