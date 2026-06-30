import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const reviews = [
    {
      id: "rev-1",
      username: "User A",
      rating: 5,
      comment: "Mantap!",
      date: "2026-01-01"
    }
  ];

  res.status(200).json(reviews);
}