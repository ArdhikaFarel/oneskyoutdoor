import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { email, password } = req.body;

  if (email === 'ferdyonesky@outdoor.com' && password === 'oneskyoutdooradmin') {
    return res.status(200).json({
      success: true,
      token: 'onesky-admin-secure-token-2026',
      user: {
        email,
        role: 'admin',
        name: 'OneSky Administrator'
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid email or password'
  });
}