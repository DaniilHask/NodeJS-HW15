'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

interface NewsPost {
  id: number;
  header: string;
  text: string;
  genre?: 'Politic' | 'Business' | 'Sport' | 'Other';
  isPrivate?: boolean;
  createDate?: string;
  createdAt?: string;
  author?: { id: number; email: string } | null;
}

export default function NewsDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [post, setPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        if (data) setPost(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this news item?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }

    try {
      const res = await fetch(`/api/newsposts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth');
        return;
      }

      if (res.ok) {
        router.push('/');
      } else {
        alert('Error during deletion');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error during deletion');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center text-red-500">News item not found (404)</div>;

  const dateToDisplay = post.createDate || post.createdAt;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <button
          onClick={() => router.push('/')}
          className="mb-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm transition"
        >
          ← Back
        </button>

        <div className="flex justify-between items-start mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{post.header}</h1>
          <div className="flex items-center space-x-2">
            {post.genre && (
              <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full">
                {post.genre}
              </span>
            )}
            {post.isPrivate && (
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full">
                Private
              </span>
            )}
          </div>
        </div>

        <span className="text-sm text-gray-400 block mb-6">
          Author: {post.author?.email ?? 'Unknown'}
          {dateToDisplay ? ` · Created: ${new Date(dateToDisplay).toLocaleString()}` : ''}
        </span>

        <div className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-8 text-lg">
          {post.text}
        </div>

        <div className="flex items-center gap-4 border-t pt-6">
          <button
            onClick={() => router.push(`/news/${id}/edit`)}
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-lg transition"
          >
            Edit news item
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}