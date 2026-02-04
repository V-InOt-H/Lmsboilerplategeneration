import { useState, useEffect } from 'react';
import { settingsAPI } from '../../../services/api';
import { Settings, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';

export default function OrgSettings() {
  const [settings, setSettings] = useState({
    organization: {
      name: '',
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
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      if (response.settings) {
        setSettings(response.settings);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await settingsAPI.update(settings);
      toast.success('Settings saved successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to save settings');
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
          <p className="text-indigo-300 mt-1">Configure your LMS settings</p>
        </div>
        <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-500 to-purple-600">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Organization Settings */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Organization
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
            />
          </div>
          <div>
            <Label className="text-white mb-2 block">Primary Color</Label>
            <Input
              type="color"
              value={settings.organization?.primaryColor || '#6366f1'}
              onChange={(e) => setSettings({
                ...settings,
                organization: { ...settings.organization, primaryColor: e.target.value }
              })}
              className="bg-white/10 border-white/20 h-10"
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 space-y-6">
        <h3 className="text-xl font-bold text-white">Features</h3>
        <div className="space-y-4">
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
