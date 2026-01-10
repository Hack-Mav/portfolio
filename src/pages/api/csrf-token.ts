// src/pages/api/csrf-token.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { generateCsrfToken } from '../../utils/csrf';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = generateCsrfToken();
  
  // Set HTTP-only, Secure, SameSite cookie
  res.setHeader(
    'Set-Cookie',
    `csrf-token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict${
      process.env.NODE_ENV === 'production' ? '; Secure' : ''
    }`
  );

  return res.status(200).json({ token });
}