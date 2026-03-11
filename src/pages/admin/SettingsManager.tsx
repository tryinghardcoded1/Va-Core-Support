import React, { useState } from 'react';
import { Settings, Bell, Shield, Globe, Mail, Save } from 'lucide-react';
import { motion } from 'motion/react';

export default function SettingsManager({ user }: { user: any }) {
  const [settings, setSettings] = useState({
    siteName: 'Vacoresupport',
    contactEmail: 'support@vacoresupport.com',
    maintenanceMode: false,
    allowNewRegistrations: true,
    requireEmailVerification: true,
    featuredJobPrice: 49,
  });

  const handleSave = () => {
    alert('Settings saved successfully (simulated)');
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">Platform Settings</h2>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-100"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 space-y-6">
          <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-4">
            <Globe className="w-5 h-5 text-teal-600" />
            General Configuration
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700">Site Name</label>
              <input 
                type="text" 
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700">Support Email</label>
              <input 
                type="email" 
                value={settings.contactEmail}
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 space-y-6">
          <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-4">
            <Shield className="w-5 h-5 text-teal-600" />
            Security & Access
          </h3>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl cursor-pointer hover:bg-zinc-100 transition-colors">
              <div>
                <p className="font-bold text-zinc-900">Maintenance Mode</p>
                <p className="text-sm text-zinc-500">Disable the frontend for regular users</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                className="w-5 h-5 accent-teal-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl cursor-pointer hover:bg-zinc-100 transition-colors">
              <div>
                <p className="font-bold text-zinc-900">Allow New Registrations</p>
                <p className="text-sm text-zinc-500">Enable or disable new user signups</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.allowNewRegistrations}
                onChange={(e) => setSettings({...settings, allowNewRegistrations: e.target.checked})}
                className="w-5 h-5 accent-teal-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl cursor-pointer hover:bg-zinc-100 transition-colors">
              <div>
                <p className="font-bold text-zinc-900">Email Verification</p>
                <p className="text-sm text-zinc-500">Require users to verify email before using the platform</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.requireEmailVerification}
                onChange={(e) => setSettings({...settings, requireEmailVerification: e.target.checked})}
                className="w-5 h-5 accent-teal-600"
              />
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
