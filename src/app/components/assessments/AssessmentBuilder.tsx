import { useState } from 'react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { assessmentsAPI } from '../../../services/api';

export default function AssessmentBuilder({ assessment, onBack, onSave }) {
  const [formData, setFormData] = useState({
    title: assessment?.title || '',
    description: assessment?.description || '',
    passingScore: assessment?.passingScore || 70,
    duration: assessment?.duration || 30,
    questions: assessment?.questions || []
  });

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, {
        question: '',
        type: 'MCQ',
        options: ['', '', '', ''],
        correctAnswer: '',
        points: 1
      }]
    });
  };

  const handleSave = async () => {
    try {
      if (assessment) {
        await assessmentsAPI.update(assessment._id, formData);
        toast.success('Assessment updated!');
      } else {
        await assessmentsAPI.create(formData);
        toast.success('Assessment created!');
      }
      onSave();
    } catch (err) {
      toast.error(err.message || 'Failed to save assessment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="ghost" className="text-indigo-300 hover:text-white hover:bg-white/10">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-500 to-purple-600">
          <Save className="w-4 h-4 mr-2" />
          Save Assessment
        </Button>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 space-y-6">
        <h2 className="text-2xl font-bold text-white">{assessment ? 'Edit Assessment' : 'Create Assessment'}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Label className="text-white mb-2 block">Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Assessment title"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          <div className="md:col-span-2">
            <Label className="text-white mb-2 block">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Assessment description"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          <div>
            <Label className="text-white mb-2 block">Passing Score (%)</Label>
            <Input
              type="number"
              value={formData.passingScore}
              onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          <div>
            <Label className="text-white mb-2 block">Duration (minutes)</Label>
            <Input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Questions</h3>
            <Button onClick={handleAddQuestion} size="sm" className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>

          {formData.questions.length === 0 ? (
            <p className="text-indigo-300 text-center py-8">No questions yet. Click "Add Question" to begin.</p>
          ) : (
            <div className="space-y-4">
              {formData.questions.map((q, idx) => (
                <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white font-medium mb-2">Question {idx + 1}</p>
                  <Input
                    value={q.question}
                    onChange={(e) => {
                      const updated = [...formData.questions];
                      updated[idx].question = e.target.value;
                      setFormData({ ...formData, questions: updated });
                    }}
                    placeholder="Enter question"
                    className="bg-white/10 border-white/20 text-white mb-2"
                  />
                  <Select
                    value={q.type}
                    onValueChange={(value) => {
                      const updated = [...formData.questions];
                      updated[idx].type = value;
                      setFormData({ ...formData, questions: updated });
                    }}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white mb-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/20">
                      <SelectItem value="MCQ">Multiple Choice</SelectItem>
                      <SelectItem value="True/False">True/False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
