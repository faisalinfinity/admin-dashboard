import { NextApiRequest, NextApiResponse } from 'next';
import { Listing } from '../../types';

let listings: Listing[] = [
  { id: 1, car: 'Toyota Corolla', status: 'pending' },
  { id: 2, car: 'Honda Civic', status: 'pending' },
  { id: 3, car: 'Ford Focus', status: 'pending' },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query;
    if (id) {
      const listing = listings.find(l => l.id === Number(id));
      return res.status(200).json(listing);
    }
    return res.status(200).json(listings);
  }

  if (req.method === 'POST') {
    const { id, action } = req.body;
    listings = listings.map(l =>
      l.id === Number(id) ? { ...l, status: action } : l
    );
    return res.status(200).json({ success: true });
  }

  if (req.method === 'PUT') {
    const { id, car } = req.body;
    listings = listings.map(l =>
      l.id === Number(id) ? { ...l, car } : l
    );
    return res.status(200).json({ success: true });
  }
}
