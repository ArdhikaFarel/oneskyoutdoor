import type { VercelRequest, VercelResponse } from '@vercel/node';

let items = [
  {
    id: "item-1",
    name: "Tenda Camping",
    price: 50000,
    stock: 10,
    availableStock: 7,
    image: "",
    category: "camping"
  }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return res.status(200).json(items);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}