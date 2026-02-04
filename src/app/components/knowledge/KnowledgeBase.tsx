import { useState, useEffect } from 'react';
import { knowledgeAPI } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { FileText, Plus, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';

export default function KnowledgeBase({ onSelectArticle, onCreateArticle }) {
  const { hasRole } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await knowledgeAPI.getAll();
      setArticles(response.articles || []);
    } catch (err) {
      console.error('Failed to fetch articles:', err);
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-white">Loading knowledge base...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Knowledge Base</h2>
          <p className="text-indigo-300 mt-1">Browse articles and documentation</p>
        </div>
        {hasRole('Super Admin', 'Admin', 'Trainer') && (
          <Button onClick={onCreateArticle} className="bg-gradient-to-r from-indigo-500 to-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            Create Article
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
        <Input
          type="search"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-indigo-300"
        />
      </div>

      {filteredArticles.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-12 text-center">
          <FileText className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
          <p className="text-white font-medium mb-2">No articles found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article._id}
              onClick={() => onSelectArticle(article)}
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:border-indigo-500/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <FileText className="w-8 h-8 text-indigo-400" />
                {article.status === 'Draft' && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg text-xs">
                    Draft
                  </span>
                )}
              </div>
              <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-indigo-200 text-sm mb-4 line-clamp-3">{article.content?.substring(0, 150)}...</p>
              <div className="flex items-center justify-between text-sm text-indigo-300">
                <span>{article.category}</span>
                <span>{article.views || 0} views</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
