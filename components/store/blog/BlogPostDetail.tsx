import React, { useEffect, useState } from 'react';
import { blogService } from '../../../services/blogService';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';

export const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
        blogService.getPostBySlug(slug).then(data => {
            setPost(data.post);
            setRelated(data.related);
        });
    }
  }, [slug]);

  if (!post) return <div className="p-20 text-center">Loading...</div>;

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
        <button onClick={() => navigate('/blog')} className="text-gray-500 hover:text-indigo-600 flex items-center gap-2 mb-8 transition-colors">
            <ArrowLeft size={18} /> Back to Blog
        </button>

        <div className="text-center mb-10">
            {post.category && <span className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-4 block">{post.category.name}</span>}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>
            <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
                <span className="flex items-center gap-2"><User size={16}/> {post.author?.name}</span>
                <span className="flex items-center gap-2"><Calendar size={16}/> {new Date(post.publishDate).toLocaleDateString()}</span>
            </div>
        </div>

        {post.image && (
            <div className="aspect-video w-full bg-gray-100 rounded-2xl overflow-hidden mb-12">
                <img src={post.image} className="w-full h-full object-cover" />
            </div>
        )}

        <div className="prose prose-lg max-w-none text-gray-700 mb-12" dangerouslySetInnerHTML={{ __html: post.content }} />

        {post.tags?.length > 0 && (
            <div className="flex gap-2 mb-12 pt-8 border-t border-gray-100">
                {post.tags.map((tag: string) => (
                    <span key={tag} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                        <Tag size={12} /> {tag}
                    </span>
                ))}
            </div>
        )}

        {related.length > 0 && (
            <div className="pt-12 border-t border-gray-100">
                <h3 className="text-2xl font-bold mb-8">Related Posts</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {related.map(p => (
                        <div key={p._id} onClick={() => navigate(`/blog/${p.slug}`)} className="cursor-pointer group">
                            <div className="aspect-[3/2] bg-gray-100 rounded-xl overflow-hidden mb-3">
                                {p.image && <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                            </div>
                            <h4 className="font-bold text-gray-900 group-hover:text-indigo-600">{p.title}</h4>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </article>
  );
};