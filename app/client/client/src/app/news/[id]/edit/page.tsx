'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

export default function EditNews({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [header, setHeader] = useState('');
  const [text, setText] = useState('');
  const [genre, setGenre] = useState<'Politic' | 'Business' | 'Sport' | 'Other'>('Other');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }

    if (!id) return;
    
    fetch(`/api/newsposts/${id}`, {
      headers: {
        'Authorization': token,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem('token');
          router.push('/auth');
          return;
        }
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        if (data) {
          setHeader(data.header || data.title || '');
          setText(data.text || '');
          if (data.genre) setGenre(data.genre);
          if (data.isPrivate !== undefined) setIsPrivate(data.isPrivate);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }

    try {
      const res = await fetch(`/api/newsposts/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ header, text, genre, isPrivate }),
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth');
        return;
      }

      if (res.ok) {
        router.push(`/news/${id}`);
      } else {
        alert('Error during update');
        setSubmitting(false);
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Error during update');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <button
          onClick={() => router.push(`/news/${id}`)}
          className="mb-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm transition"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit an existing news item</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              maxLength={50}
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              required
              className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">News text</label>
            <textarea
              rows={4}
              maxLength={256}
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value as any)}
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Politic">Politic</option>
              <option value="Business">Business</option>
              <option value="Sport">Sport</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPrivateEdit"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isPrivateEdit" className="text-sm font-medium text-gray-700">Is Private</label>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg transition"
            >
              To the general list
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Confirm edits'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}