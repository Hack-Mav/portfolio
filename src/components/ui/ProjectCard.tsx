import React from 'react';
import { FaGithub, FaStar, FaCodeBranch, FaEye } from 'react-icons/fa';

type ProjectCardProps = {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  updated_at: string;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  name,
  description,
  html_url,
  stargazers_count,
  forks_count,
  watchers_count,
  language,
  updated_at,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">
            <a 
              href={html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors flex items-center"
            >
              <FaGithub className="mr-2" />
              {name}
            </a>
          </h3>
        </div>
        
        {description && (
          <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        )}
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
          {language && (
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
              {language}
            </div>
          )}
          <div className="flex items-center">
            <FaStar className="mr-1 text-yellow-500" />
            {stargazers_count.toLocaleString()}
          </div>
          <div className="flex items-center">
            <FaCodeBranch className="mr-1 text-gray-500" />
            {forks_count.toLocaleString()}
          </div>
          <div className="flex items-center">
            <FaEye className="mr-1 text-gray-500" />
            {watchers_count.toLocaleString()}
          </div>
        </div>
        
        <div className="text-xs text-gray-400">
          Updated on {formatDate(updated_at)}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
