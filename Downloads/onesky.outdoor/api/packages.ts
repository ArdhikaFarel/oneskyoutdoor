import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const packages = [
    {
      id: "pkg-1",
      name: "Paket Camping Hemat",
      contents: ["Tenda", "Sleeping Bag"],
      price: 120000,
      stock: 5,
      availableStock: 5,
      image: ""
    }
  ];

  res.status(200).json(packages);
}