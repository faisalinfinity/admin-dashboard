import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { requireAuth } from '../../lib/auth';
import { useFeedback } from '../context/FeedbackContext';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  requireAuth(ctx);
  return { props: {} };
};

export default function EditListing() {
  const router = useRouter();
  const { id } = router.query;
  const { showMessage } = useFeedback();
  const [car, setCar] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetch(`/api/listings?id=${id}`)
        .then(res => res.json())
        .then(data => setCar(data.car));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/listings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, car }),
    });
    showMessage('Listing updated');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
        <h1 className="text-xl font-bold">Edit Listing #{id}</h1>
        <input
          value={car}
          onChange={(e) => setCar(e.target.value)}
          className="border p-2 w-full"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
