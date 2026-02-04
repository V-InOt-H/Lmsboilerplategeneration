import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { coursesAPI } from '../../../services/api';

export default function CourseBuilder({ course, onBack, onSave }) {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    category: course?.category || '',
    level: course?.level || 'Beginner',
    status: course?.status || 'Draft',
    modules: course?.modules || []
  });

  const handleAddModule = () => {
    setFormData({
      ...formData,
      modules: [...formData.modules, { title: '', description: '', order: formData.modules.length + 1, lessons: [] }]
    });
  };

  const handleAddLesson = (moduleIndex) => {
    const updatedModules = [...formData.modules];
    updatedModules[moduleIndex].lessons.push({
      title: '',
      type: 'Video',
      content: '',
      duration: 0,
      order: updatedModules[moduleIndex].lessons.length + 1
    });
    setFormData({ ...formData, modules: updatedModules });
  };

  const handleSave = async () => {
    try {
      if (course) {
        await coursesAPI.update(course._id, formData);
        toast.success('Course updated successfully!');
      } else {
        await coursesAPI.create(formData);
        toast.success('Course created successfully!');
      }
      onSave();
    } catch (err) {
      toast.error(err.message || 'Failed to save course');
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
          Save Course
        </Button>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 space-y-6">
        <h2 className="text-2xl font-bold text-white">{course ? 'Edit Course' : 'Create New Course'}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-white mb-2 block">Course Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter course title"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          <div>
            <Label className="text-white mb-2 block">Category</Label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Programming, Design"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        </div>

        <div>
          <Label className="text-white mb-2 block">Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter course description"
            className="bg-white/10 border-white/20 text-white min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-white mb-2 block">Level</Label>
            <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/20">
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-white mb-2 block">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/20">
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Modules</h3>
            <Button onClick={handleAddModule} size="sm" className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30">
              <Plus className="w-4 h-4 mr-2" />
              Add Module
            </Button>
          </div>

          {formData.modules.length === 0 ? (
            <p className="text-indigo-300 text-center py-8">No modules yet. Click "Add Module" to begin.</p>
          ) : (
            <div className="space-y-4">
              {formData.modules.map((module, idx) => (
                <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <Input
                    value={module.title}
                    onChange={(e) => {
                      const updated = [...formData.modules];
                      updated[idx].title = e.target.value;
                      setFormData({ ...formData, modules: updated });
                    }}
                    placeholder="Module title"
                    className="bg-white/10 border-white/20 text-white mb-3"
                  />
                  <Button
                    onClick={() => handleAddLesson(idx)}
                    size="sm"
                    variant="ghost"
                    className="text-indigo-300 hover:text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lesson
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
