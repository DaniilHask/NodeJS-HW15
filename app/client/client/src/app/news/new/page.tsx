'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateNews() {
  const router = useRouter();
  const [header, setHeader] = useState('');
  const [text, setText] = useState('');
  const [genre, setGenre] = useState<'Politic' | 'Business' | 'Sport' | 'Other'>('Other');
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const token = localStorage.getItem('token');
    const res = await fetch('/api/newsposts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify({ header, text, genre, isPrivate }), // Передаем header вместо title
    });

    if (res.ok) {
      router.push('/');
    } else {
      alert('Error creating news item');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <button
          onClick={() => router.push('/')}
          className="mb-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg transition duration-200 text-sm"
        >
          ← Back to the list
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a new news item</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-black font-medium mb-2">Title (max 50 chars)</label>
            <input
              type="text"
              maxLength={50}
              value={header}
              onChange={(e) => setHeader(e.target.value)} // Используем setHeader
              required
              className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter a title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">News text (max 256 chars)</label>
            <textarea
              rows={4}
              maxLength={256}
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter text..."
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
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isPrivate" className="text-sm font-medium text-gray-700">Private</label>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Confirm creation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}