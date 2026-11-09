'use client';

import { useEffect, useState } from 'react';
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

export default function Home() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const size = 10;
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/auth');
      return;
    }

    setIsAuthorized(true);

    fetch(`/api/newsposts?page=${page}&size=${size}`, {
      headers: {
        'Authorization': token,
      },
    })
      .then(async (res) => {
        if (res.status === 401) {
          localStorage.removeItem('token');
          router.push('/auth');
          return;
        }
        return res.json();
      })
      .then((response) => {
        if (response && Array.isArray(response.data)) {
          setPosts(response.data);
          setTotal(response.total);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading news:', err);
        setLoading(false);
      });
  }, [page, router]);

  if (!isAuthorized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  const totalPages = Math.ceil(total / size);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">List of news</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/news/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow transition duration-200"
            >
              Add news
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                router.push('/auth');
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg shadow transition duration-200"
            >
              Log Out
            </button>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500 border border-gray-100">
            There is no news yet.
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const dateToDisplay = post.createDate || post.createdAt;
              return (
                <div
                  key={post.id}
                  onClick={() => router.push(`/news/${post.id}`)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 cursor-pointer border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {post.header}
                    </h2>
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
                  <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                    {post.text}
                  </p>
                  <span className="text-xs text-gray-400">
                    {post.author?.email ? `${post.author.email} · ` : ''}
                    {dateToDisplay ? new Date(dateToDisplay).toLocaleString() : ''}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Previous
          </button>
          
          <span className="text-gray-600 font-medium">
            Page {page + 1} of {totalPages || 1}
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={(page + 1) >= totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}