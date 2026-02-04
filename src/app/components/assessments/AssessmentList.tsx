import { useState, useEffect } from 'react';
import { assessmentsAPI } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { ClipboardCheck, Plus, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';

export default function AssessmentList({ onSelectAssessment, onCreateAssessment }) {
  const { hasRole } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await assessmentsAPI.getAll();
      setAssessments(response.assessments || []);
    } catch (err) {
      console.error('Failed to fetch assessments:', err);
      toast.error('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const filteredAssessments = assessments.filter(assessment =>
    assessment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-white">Loading assessments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Assessments</h2>
          <p className="text-indigo-300 mt-1">Test your knowledge</p>
        </div>
        {hasRole('Super Admin', 'Admin', 'Trainer') && (
          <Button onClick={onCreateAssessment} className="bg-gradient-to-r from-indigo-500 to-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            Create Assessment
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
        <Input
          type="search"
          placeholder="Search assessments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-indigo-300"
        />
      </div>

      {filteredAssessments.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-12 text-center">
          <ClipboardCheck className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
          <p className="text-white font-medium mb-2">No assessments found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment) => (
            <div
              key={assessment._id}
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:border-indigo-500/50 transition-all"
            >
              <h3 className="text-white font-bold text-lg mb-2">{assessment.title}</h3>
              <p className="text-indigo-200 text-sm mb-4">{assessment.description}</p>
              <div className="flex items-center justify-between text-sm text-indigo-300 mb-4">
                <span>{assessment.questions?.length || 0} questions</span>
                <span>{assessment.duration} mins</span>
              </div>
              <Button
                onClick={() => onSelectAssessment(assessment)}
                className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30"
              >
                Start Assessment
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
