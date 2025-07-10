import { GetServerSideProps } from 'next';
import { requireAuth } from '../lib/auth';
import { useEffect, useState } from 'react';
import { Listing } from '../types';
import { useFeedback } from './context/FeedbackContext';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  requireAuth(ctx);
  return { props: {} };
};

export default function Dashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const { showMessage } = useFeedback();

  const fetchListings = async () => {
    const res = await fetch('/api/listings');
    const data = await res.json();
    setListings(data);
  };

  useEffect(() => { fetchListings(); }, []);

  const handleAction = async (id: number, action: string) => {
    await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    showMessage(`${action} action performed`);
    fetchListings();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <table className="w-full table-auto border">
        <thead className="bg-gray-100 text-black">
          <tr className='border-t'>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Car</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.id} className="border-t">
              <td className="p-2 border">{listing.id}</td>
              <td className="p-2 border">{listing.car}</td>
              <td className="p-2 capitalize border">{listing.status}</td>
              <td className="p-2 space-x-2 border">
                <button
                  onClick={() => handleAction(listing.id, 'approved')}
                  className="px-2 py-1 bg-green-500 text-white rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(listing.id, 'rejected')}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Reject
                </button>
                <Link href={`/edit/${listing.id}`}>
                  <span className="px-2 py-1 bg-blue-500 text-white rounded cursor-pointer">
                    Edit
                  </span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
