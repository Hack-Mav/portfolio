import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaArrowLeft, FaCalendar, FaUser, FaTag } from 'react-icons/fa';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import { useBlogs } from '@/hooks/useBlogs';
import { format } from 'date-fns';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchBlogById } = useBlogs();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlog = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      
      const data = await fetchBlogById(id);
      if (data) {
        setBlog(data);
      } else {
        setError('Blog not found');
      }
      setLoading(false);
    };

    loadBlog();
  }, [id, fetchBlogById]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
            {error || 'Blog not found'}
          </h2>
          <Link
            to="/blogs"
            className="inline-flex items-center text-primary-600 dark:text-primary-300 hover:text-primary-700"
          >
            <FaArrowLeft className="mr-2" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blog.title} | Portfolio</title>
        <meta name="description" content={blog.excerpt} />
      </Helmet>

      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/blogs"
              className="inline-flex items-center text-primary-600 dark:text-primary-300 hover:text-primary-700 mb-8"
            >
              <FaArrowLeft className="mr-2" />
              Back to Blogs
            </Link>

            {blog.coverImage && (
              <div className="mb-8 overflow-hidden rounded-xl">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            <div className="surface-panel p-8 md:p-12">
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center text-sm font-medium px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-300"
                  >
                    <FaTag className="mr-1 text-xs" />
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="font-heading text-3xl md:text-5xl text-slate-900 dark:text-white mb-6">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-300 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center">
                  <FaUser className="mr-2" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendar className="mr-2" />
                  <span>{format(new Date(blog.publishedAt), 'MMMM d, yyyy')}</span>
                </div>
                {blog.readTime && (
                  <div className="flex items-center">
                    <span>{blog.readTime} min read</span>
                  </div>
                )}
              </div>

              <div
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;
