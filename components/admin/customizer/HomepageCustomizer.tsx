
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../../contexts/SettingsContext';
import { settingsService } from '../../../services/settingsService';
import { StoreHome } from '../../store/StoreHome';
import { AdminMedia } from '../AdminMedia';
import { 
    ArrowLeft, Save, Monitor, Smartphone, Tablet, Plus, GripVertical, 
    Trash2, ChevronDown, ChevronRight, Eye, EyeOff, Layout, Type, Image as ImageIcon,
    Settings as SettingsIcon, ShoppingBag, Truck, Link as LinkIcon,
    Video, Clock, HelpCircle, Map, Users, BarChart2, Star
} from 'lucide-react';

const sectionTypes = [
    { type: 'hero', label: 'Hero Slider', icon: Layout, defaultSettings: { slides: [{ heading: 'New Arrival', buttonText: 'Shop Now' }], height: 'full' } },
    { type: 'products', label: 'Product Grid', icon: ShoppingBag, defaultSettings: { title: 'Featured Products', source: 'featured', limit: 4 } },
    { type: 'banner', label: 'Promo Banner', icon: ImageIcon, defaultSettings: { columns: 2, items: [{ title: 'Sale', buttonText: 'View' }, { title: 'New', buttonText: 'View' }] } },
    { type: 'features', label: 'Features', icon: Truck, defaultSettings: { items: [{ title: 'Free Shipping', icon: 'Truck' }, { title: 'Support', icon: 'Headphones' }] } },
    { type: 'reviews-grid', label: 'Reviews Grid', icon: Star, defaultSettings: { title: 'Customer Reviews', backgroundColor: '#ffffff', cardColor: '#f9fafb', starColor: '#fbbf24', textColor: '#111827' } },
    { type: 'video', label: 'Video', icon: Video, defaultSettings: { videoUrl: '', title: 'Watch Our Story', height: 'medium', autoPlay: true } },
    { type: 'countdown', label: 'Countdown', icon: Clock, defaultSettings: { heading: 'Limited Time Offer', targetDate: new Date(Date.now() + 86400000).toISOString(), backgroundColor: '#000000', textColor: '#ffffff' } },
    { type: 'faq', label: 'FAQ', icon: HelpCircle, defaultSettings: { title: 'Frequently Asked Questions', items: [{ question: 'Shipping?', answer: 'We ship worldwide.' }] } },
    { type: 'gallery', label: 'Image Gallery', icon: ImageIcon, defaultSettings: { title: 'Follow Us', columns: 4, images: [] } },
    { type: 'team', label: 'Team', icon: Users, defaultSettings: { title: 'Meet the Team', members: [{ name: 'John Doe', role: 'CEO' }] } },
    { type: 'stats', label: 'Stats Counter', icon: BarChart2, defaultSettings: { backgroundColor: '#4f46e5', items: [{ label: 'Happy Customers', value: '10k', suffix: '+' }] } },
    { type: 'map', label: 'Map Location', icon: Map, defaultSettings: { title: 'Our Store', address: 'New York, NY', height: 'medium' } }
];

export const HomepageCustomizer: React.FC = () => {
  const { settings: globalSettings, refreshSettings } = useSettings();
  const navigate = useNavigate();
  
  const [localSettings, setLocalSettings] = useState<any>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [viewDevice, setViewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  
  // Media Picker
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerCallback, setMediaPickerCallback] = useState<((url: string) => void) | null>(null);

  // Auto-save timer
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
      if (globalSettings) {
          setLocalSettings(JSON.parse(JSON.stringify(globalSettings)));
      }
  }, [globalSettings]);

  // Auto-Save Logic
  useEffect(() => {
      if (localSettings && activeSectionId) { // Only auto-save if actively editing
          if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
          saveTimeoutRef.current = setTimeout(() => {
              handleSave(true); // Silent save
          }, 30000); // 30 seconds
      }
      return () => {
          if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      };
  }, [localSettings]);

  if (!localSettings) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  const sections = localSettings.homepage.sections || [];

  const handleSave = async (silent = false) => {
      if (!silent) setSaving(true);
      try {
          await settingsService.updateSettings(localSettings, 'homepage');
          if (!silent) {
              await refreshSettings();
              alert('Saved successfully!');
          } else {
              console.log('Auto-saved');
          }
      } catch (err) {
          if (!silent) alert('Failed to save');
      } finally {
          if (!silent) setSaving(false);
      }
  };

  const handleAddSection = (type: string, defaultSettings: any) => {
      const newSection = {
          id: Math.random().toString(36).substr(2, 9),
          type,
          enabled: true,
          settings: defaultSettings
      };
      setLocalSettings({
          ...localSettings,
          homepage: { ...localSettings.homepage, sections: [...sections, newSection] }
      });
      setActiveSectionId(newSection.id);
  };

  const handleDeleteSection = (id: string) => {
      if(confirm('Remove this section?')) {
          setLocalSettings({
              ...localSettings,
              homepage: {
                  ...localSettings.homepage,
                  sections: sections.filter((s: any) => s.id !== id)
              }
          });
          if(activeSectionId === id) setActiveSectionId(null);
      }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
      const newSections = [...sections];
      if (direction === 'up' && index > 0) {
          [newSections[index], newSections[index-1]] = [newSections[index-1], newSections[index]];
      } else if (direction === 'down' && index < newSections.length - 1) {
          [newSections[index], newSections[index+1]] = [newSections[index+1], newSections[index]];
      }
      setLocalSettings({
          ...localSettings,
          homepage: { ...localSettings.homepage, sections: newSections }
      });
  };

  const updateSectionSettings = (id: string, newSettings: any) => {
      const newSections = sections.map((s: any) => 
          s.id === id ? { ...s, settings: { ...s.settings, ...newSettings } } : s
      );
      setLocalSettings({
          ...localSettings,
          homepage: { ...localSettings.homepage, sections: newSections }
      });
  };

  const openMediaPicker = (callback: (url: string) => void) => {
      setMediaPickerCallback(() => callback);
      setMediaPickerOpen(true);
  };

  const renderEditor = () => {
      if (!activeSectionId) return <div className="p-8 text-center text-gray-500">Select a section to edit</div>;
      
      const section = sections.find((s: any) => s.id === activeSectionId);
      if (!section) return null;

      return (
          <div className="p-4 space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="font-bold text-gray-800 capitalize">{section.type} Settings</h3>
                  <button onClick={() => setActiveSectionId(null)} className="text-sm text-indigo-600 font-medium">Done</button>
              </div>

              {/* Review Grid Editor */}
              {section.type === 'reviews-grid' && (
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium mb-1">Title</label>
                          <input className="w-full border rounded px-3 py-2" value={section.settings.title} onChange={e => updateSectionSettings(section.id, { title: e.target.value })} />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Subtitle</label>
                          <input className="w-full border rounded px-3 py-2" value={section.settings.subtitle || ''} onChange={e => updateSectionSettings(section.id, { subtitle: e.target.value })} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium mb-1">Star Color</label>
                              <div className="flex gap-2">
                                  <input type="color" className="h-9 w-9 border rounded p-0 cursor-pointer" value={section.settings.starColor || '#fbbf24'} onChange={e => updateSectionSettings(section.id, { starColor: e.target.value })} />
                                  <input type="text" className="flex-1 border rounded px-2 text-xs" value={section.settings.starColor || '#fbbf24'} onChange={e => updateSectionSettings(section.id, { starColor: e.target.value })} />
                              </div>
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-1">Card Color</label>
                              <div className="flex gap-2">
                                  <input type="color" className="h-9 w-9 border rounded p-0 cursor-pointer" value={section.settings.cardColor || '#f9fafb'} onChange={e => updateSectionSettings(section.id, { cardColor: e.target.value })} />
                                  <input type="text" className="flex-1 border rounded px-2 text-xs" value={section.settings.cardColor || '#f9fafb'} onChange={e => updateSectionSettings(section.id, { cardColor: e.target.value })} />
                              </div>
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-1">Text Color</label>
                              <div className="flex gap-2">
                                  <input type="color" className="h-9 w-9 border rounded p-0 cursor-pointer" value={section.settings.textColor || '#111827'} onChange={e => updateSectionSettings(section.id, { textColor: e.target.value })} />
                                  <input type="text" className="flex-1 border rounded px-2 text-xs" value={section.settings.textColor || '#111827'} onChange={e => updateSectionSettings(section.id, { textColor: e.target.value })} />
                              </div>
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-1">Section BG</label>
                              <div className="flex gap-2">
                                  <input type="color" className="h-9 w-9 border rounded p-0 cursor-pointer" value={section.settings.backgroundColor || '#ffffff'} onChange={e => updateSectionSettings(section.id, { backgroundColor: e.target.value })} />
                                  <input type="text" className="flex-1 border rounded px-2 text-xs" value={section.settings.backgroundColor || '#ffffff'} onChange={e => updateSectionSettings(section.id, { backgroundColor: e.target.value })} />
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {/* Video Editor */}
              {section.type === 'video' && (
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium mb-1">Video URL (YouTube/Vimeo)</label>
                          <input className="w-full border rounded px-3 py-2" value={section.settings.videoUrl} onChange={e => updateSectionSettings(section.id, { videoUrl: e.target.value })} />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Title Overlay</label>
                          <input className="w-full border rounded px-3 py-2" value={section.settings.title} onChange={e => updateSectionSettings(section.id, { title: e.target.value })} />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Height</label>
                          <select className="w-full border rounded px-3 py-2" value={section.settings.height} onChange={e => updateSectionSettings(section.id, { height: e.target.value })}>
                              <option value="small">Small</option>
                              <option value="medium">Medium</option>
                              <option value="large">Large</option>
                          </select>
                      </div>
                      <div className="flex items-center gap-2">
                          <input type="checkbox" checked={section.settings.autoPlay} onChange={e => updateSectionSettings(section.id, { autoPlay: e.target.checked })} />
                          <label className="text-sm">Auto Play (Muted)</label>
                      </div>
                  </div>
              )}

              {/* Countdown Editor */}
              {section.type === 'countdown' && (
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium mb-1">Target Date</label>
                          <input type="datetime-local" className="w-full border rounded px-3 py-2" value={section.settings.targetDate?.slice(0, 16)} onChange={e => updateSectionSettings(section.id, { targetDate: new Date(e.target.value).toISOString() })} />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Heading</label>
                          <input className="w-full border rounded px-3 py-2" value={section.settings.heading} onChange={e => updateSectionSettings(section.id, { heading: e.target.value })} />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Background Color</label>
                          <div className="flex gap-2">
                              <input type="color" className="h-10 w-10 border rounded p-0 cursor-pointer" value={section.settings.backgroundColor} onChange={e => updateSectionSettings(section.id, { backgroundColor: e.target.value })} />
                              <input type="text" className="flex-1 border rounded px-3 py-2" value={section.settings.backgroundColor} onChange={e => updateSectionSettings(section.id, { backgroundColor: e.target.value })} />
                          </div>
                      </div>
                  </div>
              )}

              {/* Map Editor */}
              {section.type === 'map' && (
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium mb-1">Title</label>
                          <input className="w-full border rounded px-3 py-2" value={section.settings.title} onChange={e => updateSectionSettings(section.id, { title: e.target.value })} />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Address (for pin)</label>
                          <input className="w-full border rounded px-3 py-2" value={section.settings.address} onChange={e => updateSectionSettings(section.id, { address: e.target.value })} />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Map Embed URL (Optional)</label>
                          <input className="w-full border rounded px-3 py-2" placeholder="https://www.google.com/maps/embed?..." value={section.settings.mapUrl || ''} onChange={e => updateSectionSettings(section.id, { mapUrl: e.target.value })} />
                          <p className="text-xs text-gray-500 mt-1">If empty, will try to generate based on address.</p>
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Height</label>
                          <select className="w-full border rounded px-3 py-2" value={section.settings.height} onChange={e => updateSectionSettings(section.id, { height: e.target.value })}>
                              <option value="small">Small (300px)</option>
                              <option value="medium">Medium (450px)</option>
                              <option value="large">Large (600px)</option>
                          </select>
                      </div>
                  </div>
              )}

              {/* Products Editor */}
              {section.type === 'products' && (
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium mb-1">Title</label>
                          <input className="w-full border rounded px-3 py-2" value={section.settings.title} onChange={e => updateSectionSettings(section.id, { title: e.target.value })} />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Source</label>
                          <select className="w-full border rounded px-3 py-2" value={section.settings.source} onChange={e => updateSectionSettings(section.id, { source: e.target.value })}>
                              <option value="featured">Featured</option>
                              <option value="bestseller">Best Sellers</option>
                              <option value="newest">Newest</option>
                          </select>
                      </div>
                  </div>
              )}

              {/* JSON Fallback for complex/other sections */}
              {!['video', 'countdown', 'products', 'map', 'reviews-grid'].includes(section.type) && (
                  <div>
                      <div className="text-xs text-gray-500 mb-2">Edit raw settings JSON:</div>
                      <textarea 
                        className="w-full h-64 border rounded p-2 font-mono text-xs"
                        value={JSON.stringify(section.settings, null, 2)}
                        onChange={e => {
                            try {
                                const parsed = JSON.parse(e.target.value);
                                updateSectionSettings(section.id, parsed);
                            } catch(e) {}
                        }}
                      />
                  </div>
              )}
          </div>
      );
  };

  return (
    <div className="fixed inset-0 bg-gray-100 flex flex-col z-50">
        <div className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6 shadow-sm z-20">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/admin/settings')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="font-bold text-gray-800 hidden sm:block">Homepage Customizer</h1>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button onClick={() => setViewDevice('desktop')} className={`p-2 rounded ${viewDevice === 'desktop' ? 'bg-white shadow' : 'text-gray-500'}`}><Monitor size={18}/></button>
                <button onClick={() => setViewDevice('tablet')} className={`p-2 rounded ${viewDevice === 'tablet' ? 'bg-white shadow' : 'text-gray-500'}`}><Tablet size={18}/></button>
                <button onClick={() => setViewDevice('mobile')} className={`p-2 rounded ${viewDevice === 'mobile' ? 'bg-white shadow' : 'text-gray-500'}`}><Smartphone size={18}/></button>
            </div>

            <button onClick={() => handleSave(false)} disabled={saving} className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2">
                <Save size={18} /> {saving ? 'Saving...' : 'Save'}
            </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg z-10">
                {activeSectionId ? renderEditor() : (
                    <div className="flex-1 flex flex-col">
                        <div className="p-4 border-b">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sections</h3>
                            <div className="space-y-2">
                                {sections.map((section: any, index: number) => (
                                    <div key={section.id} className="group bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 hover:border-indigo-300 transition-colors shadow-sm">
                                        <div className="flex flex-col gap-1 text-gray-300">
                                            <button onClick={() => moveSection(index, 'up')} disabled={index === 0} className="hover:text-indigo-600 disabled:opacity-20"><ChevronDown size={12} className="rotate-180"/></button>
                                            <button onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1} className="hover:text-indigo-600 disabled:opacity-20"><ChevronDown size={12}/></button>
                                        </div>
                                        <div className="flex-1 cursor-pointer font-medium text-sm text-gray-700 hover:text-indigo-600" onClick={() => setActiveSectionId(section.id)}>
                                            {sectionTypes.find(t => t.type === section.type)?.label || section.type}
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => {
                                                const newSections = [...sections];
                                                newSections[index].enabled = !newSections[index].enabled;
                                                setLocalSettings({...localSettings, homepage: {...localSettings.homepage, sections: newSections}});
                                            }} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                                                {section.enabled ? <Eye size={14}/> : <EyeOff size={14}/>}
                                            </button>
                                            <button onClick={() => handleDeleteSection(section.id)} className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Add Section</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {sectionTypes.map(t => (
                                    <button key={t.type} onClick={() => handleAddSection(t.type, t.defaultSettings)} className="flex flex-col items-center justify-center p-3 border border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all gap-1">
                                        <t.icon size={20} className="text-gray-500" />
                                        <span className="text-xs font-medium text-gray-700">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 bg-gray-100 overflow-y-auto flex justify-center p-4 md:p-8">
                <div className={`bg-white shadow-2xl transition-all duration-300 overflow-hidden relative
                        ${viewDevice === 'mobile' ? 'w-[375px]' : viewDevice === 'tablet' ? 'w-[768px]' : 'w-full max-w-[1600px]'}
                        min-h-[800px] border-x border-gray-200 rounded-lg ring-1 ring-black/5
                    `}>
                    <StoreHome addToCart={() => {}} previewSettings={localSettings} />
                </div>
            </div>
        </div>

        {mediaPickerOpen && (
            <AdminMedia 
                pickerMode 
                multiple={false}
                onSelect={(files) => {
                    if (mediaPickerCallback && files[0]) mediaPickerCallback(files[0].url);
                }}
                onClose={() => setMediaPickerOpen(false)} 
            />
        )}
    </div>
  );
};
