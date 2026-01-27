import React, { useEffect, useState } from 'react';
import { blogService } from '../../../services/blogService';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

export const BlogHome: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
        blogService.getPosts(),
        blogService.getCategories()
    ]).then(([p, c]) => {
        setPosts(p);
        setCategories(c);
        setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-20 text-center">Loading...</div>;

  const featured = posts[0];
  const recent = posts.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Blog</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
                {featured && (
                    <div onClick={() => navigate(`/blog/${featured.slug}`)} className="group cursor-pointer">
                        <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden mb-6">
                            {featured.image && <img src={featured.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            {featured.category && <span className="text-indigo-600 font-bold uppercase tracking-wider">{featured.category.name}</span>}
                            <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(featured.publishDate).toLocaleDateString()}</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">{featured.title}</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">{featured.excerpt}</p>
                        <span className="text-indigo-600 font-medium flex items-center gap-1">Read More <ArrowRight size={16}/></span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {recent.map(post => (
                        <div key={post._id} onClick={() => navigate(`/blog/${post.slug}`)} className="group cursor-pointer">
                            <div className="aspect-[3/2] bg-gray-100 rounded-xl overflow-hidden mb-4">
                                {post.image && <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                            </div>
                            <div className="text-xs text-gray-500 mb-2">{new Date(post.publishDate).toLocaleDateString()}</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 line-clamp-2">{post.title}</h3>
                            <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
                <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-bold text-lg mb-4">Categories</h3>
                    <ul className="space-y-2">
                        {categories.map(cat => (
                            <li key={cat._id} className="flex justify-between items-center text-gray-600 hover:text-indigo-600 cursor-pointer">
                                <span>{cat.name}</span>
                                <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-400">{cat.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
  );
};