import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import type { Blog } from '@/types/blog';

interface BlogCardProps {
  blog: Blog;
  index: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link to={`/blogs/${blog.id}`} className="block h-full">
        <div className="surface-panel h-full p-6 hover:shadow-lg transition-shadow duration-300">
          {blog.coverImage && (
            <div className="mb-4 overflow-hidden rounded-lg">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-2 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
            {blog.title}
          </h3>

          <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
            {blog.excerpt}
          </p>

          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>{blog.author}</span>
            <span>
              {format(new Date(blog.publishedAt), 'MMM d, yyyy')}
              {blog.readTime && ` · ${blog.readTime} min read`}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;
