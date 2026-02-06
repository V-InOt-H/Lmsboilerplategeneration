import { useState, useEffect } from 'react';
import { settingsAPI } from '../../../services/api';
import { Settings, Save, Upload, Globe, GraduationCap, Award, Trophy } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

export default function OrgSettings() {
  const [settings, setSettings] = useState({
    organization: {
      name: '',
      logo: null as string | null,
      primaryColor: '',
      secondaryColor: ''
    },
    features: {
      enableCertificates: true,
      enableKnowledgeBase: true,
      enableAssessments: true
    },
    security: {
      passwordMinLength: 6,
      sessionTimeout: 60,
      maxLoginAttempts: 5
    },
    learningPolicies: {
      requireCourseApproval: false,
      allowSelfEnrollment: true,
      defaultCourseVisibility: 'public',
      certificateValidity: 0,
      requireAssessmentPassing: true,
      assessmentPassingScore: 70,
      enableGamification: false,
      showLeaderboard: false
    }
  });
  const [loading, setLoading] = useState(true);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      if (response.settings) {
        setSettings(prev => ({
          ...prev,
          ...response.settings,
          organization: {
            ...prev.organization,
            ...(response.settings.organization || {})
          },
          features: {
            ...prev.features,
            ...(response.settings.features || {})
          },
          security: {
            ...prev.security,
            ...(response.settings.security || {})
          },
          learningPolicies: {
            ...prev.learningPolicies,
            ...(response.settings.learningPolicies || {})
          }
        }));
        if (response.settings.organization?.logo) {
          setLogoPreview(response.settings.organization.logo);
        }
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSettings({
          ...settings,
          organization: { ...settings.organization, logo: base64 }
        });
        setLogoPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await settingsAPI.update(settings);
      toast.success('Settings saved successfully!');
    } catch (err) {
      toast.error((err as Error).message || 'Failed to save settings');
    }
  };

  if (loading) {
    return <div className="text-white">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Organization Settings</h2>
          <p className="text-indigo-300 mt-1">Configure your LMS branding and policies</p>
        </div>
        <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-500 to-purple-600">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Organization Branding */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Organization Branding
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-white mb-2 block">Organization Name</Label>
            <Input
              value={settings.organization?.name || ''}
              onChange={(e) => setSettings({
                ...settings,
                organization: { ...settings.organization, name: e.target.value }
              })}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Enter organization name"
            />
          </div>
          
          <div>
            <Label className="text-white mb-2 block">Logo</Label>
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/10">
                  <img src={logoPreview} alt="Organization Logo" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-indigo-400" />
                </div>
              )}
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="bg-white/10 border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600"
                />
                <p className="text-indigo-300 text-xs mt-1">Recommended: 200x50px PNG or JPG</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-white mb-2 block">Primary Color (Theme)</Label>
            <div className="flex items-center gap-3">
              <Input
                type="color"
                value={settings.organization?.primaryColor || '#6366f1'}
                onChange={(e) => setSettings({
                  ...settings,
                  organization: { ...settings.organization, primaryColor: e.target.value }
                })}
                className="w-14 h-10 bg-white/10 border-white/20 p-1"
              />
              <Input
                type="text"
                value={settings.organization?.primaryColor || '#6366f1'}
                onChange={(e) => setSettings({
                  ...settings,
                  organization: { ...settings.organization, primaryColor: e.target.value }
                })}
                className="bg-white/10 border-white/20 text-white flex-1"
              />
            </div>
          </div>
          <div>
            <Label className="text-white mb-2 block">Secondary Color</Label>
            <div className="flex items-center gap-3">
              <Input
                type="color"
                value={settings.organization?.secondaryColor || '#8b5cf6'}
                onChange={(e) => setSettings({
                  ...settings,
                  organization: { ...settings.organization, secondaryColor: e.target.value }
                })}
                className="w-14 h-10 bg-white/10 border-white/20 p-1"
              />
              <Input
                type="text"
                value={settings.organization?.secondaryColor || '#8b5cf6'}
                onChange={(e) => setSettings({
                  ...settings,
                  organization: { ...settings.organization, secondaryColor: e.target.value }
                })}
                className="bg-white/10 border-white/20 text-white flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Learning Policies */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Learning Policies
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <p className="text-white font-medium">Require Course Approval</p>
              <p className="text-indigo-300 text-sm">Admin must approve courses before publishing</p>
            </div>
            <Switch
              checked={settings.learningPolicies?.requireCourseApproval}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                learningPolicies: { ...settings.learningPolicies, requireCourseApproval: checked }
              })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <p className="text-white font-medium">Allow Self Enrollment</p>
              <p className="text-indigo-300 text-sm">Users can enroll in courses without approval</p>
            </div>
            <Switch
              checked={settings.learningPolicies?.allowSelfEnrollment}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                learningPolicies: { ...settings.learningPolicies, allowSelfEnrollment: checked }
              })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-white mb-2 block">Default Course Visibility</Label>
            <Select
              value={settings.learningPolicies?.defaultCourseVisibility || 'public'}
              onValueChange={(value) => setSettings({
                ...settings,
                learningPolicies: { ...settings.learningPolicies, defaultCourseVisibility: value }
              })}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Visible to all users</SelectItem>
                <SelectItem value="private">Private - Visible to enrolled users only</SelectItem>
                <SelectItem value="hidden">Hidden - Only visible to creators</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white mb-2 block">Certificate Validity (months)</Label>
            <Input
              type="number"
              value={settings.learningPolicies?.certificateValidity || 0}
              onChange={(e) => setSettings({
                ...settings,
                learningPolicies: { ...settings.learningPolicies, certificateValidity: parseInt(e.target.value) || 0 }
              })}
              className="bg-white/10 border-white/20 text-white"
              placeholder="0 = Lifetime"
            />
            <p className="text-indigo-300 text-xs mt-1">Enter 0 for lifetime validity</p>
          </div>
        </div>
      </div>

      {/* Assessment Policies */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5" />
          Assessment & Certification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <p className="text-white font-medium">Require Assessment Passing</p>
              <p className="text-indigo-300 text-sm">Users must pass assessments to complete courses</p>
            </div>
            <Switch
              checked={settings.learningPolicies?.requireAssessmentPassing}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                learningPolicies: { ...settings.learningPolicies, requireAssessmentPassing: checked }
              })}
            />
          </div>

          <div>
            <Label className="text-white mb-2 block">Passing Score (%)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={settings.learningPolicies?.assessmentPassingScore || 70}
              onChange={(e) => setSettings({
                ...settings,
                learningPolicies: { ...settings.learningPolicies, assessmentPassingScore: parseInt(e.target.value) || 70 }
              })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        </div>
      </div>

      {/* Gamification */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Gamification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <p className="text-white font-medium">Enable Gamification</p>
              <p className="text-indigo-300 text-sm">Award points and badges for achievements</p>
            </div>
            <Switch
              checked={settings.learningPolicies?.enableGamification}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                learningPolicies: { ...settings.learningPolicies, enableGamification: checked }
              })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <p className="text-white font-medium">Show Leaderboard</p>
              <p className="text-indigo-300 text-sm">Display top learners on dashboard</p>
            </div>
            <Switch
              checked={settings.learningPolicies?.showLeaderboard}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                learningPolicies: { ...settings.learningPolicies, showLeaderboard: checked }
              })}
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 space-y-6">
        <h3 className="text-xl font-bold text-white">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <p className="text-white font-medium">Enable Certificates</p>
              <p className="text-indigo-300 text-sm">Allow users to earn certificates</p>
            </div>
            <Switch
              checked={settings.features?.enableCertificates}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                features: { ...settings.features, enableCertificates: checked }
              })}
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <p className="text-white font-medium">Enable Knowledge Base</p>
              <p className="text-indigo-300 text-sm">Show knowledge base section</p>
            </div>
            <Switch
              checked={settings.features?.enableKnowledgeBase}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                features: { ...settings.features, enableKnowledgeBase: checked }
              })}
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <p className="text-white font-medium">Enable Assessments</p>
              <p className="text-indigo-300 text-sm">Allow quizzes and tests</p>
            </div>
            <Switch
              checked={settings.features?.enableAssessments}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                features: { ...settings.features, enableAssessments: checked }
              })}
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 space-y-6">
        <h3 className="text-xl font-bold text-white">Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label className="text-white mb-2 block">Min Password Length</Label>
            <Input
              type="number"
              value={settings.security?.passwordMinLength || 6}
              onChange={(e) => setSettings({
                ...settings,
                security: { ...settings.security, passwordMinLength: parseInt(e.target.value) }
              })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          <div>
            <Label className="text-white mb-2 block">Session Timeout (min)</Label>
            <Input
              type="number"
              value={settings.security?.sessionTimeout || 60}
              onChange={(e) => setSettings({
                ...settings,
                security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
              })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          <div>
            <Label className="text-white mb-2 block">Max Login Attempts</Label>
            <Input
              type="number"
              value={settings.security?.maxLoginAttempts || 5}
              onChange={(e) => setSettings({
                ...settings,
                security: { ...settings.security, maxLoginAttempts: parseInt(e.target.value) }
              })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

