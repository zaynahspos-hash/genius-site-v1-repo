import React, { useState, useEffect } from 'react';
import { mediaService } from '../../services/mediaService';
import { 
    Upload, FolderPlus, Trash2, Search, Filter, Grid, List as ListIcon, 
    MoreHorizontal, CheckSquare, Image as ImageIcon, Video, FileText,
    Folder, Loader2, X, Move, ChevronRight, Menu, AlertCircle
} from 'lucide-react';

interface AdminMediaProps {
    pickerMode?: boolean;
    onSelect?: (files: any[]) => void;
    onClose?: () => void;
    multiple?: boolean;
}

export const AdminMedia: React.FC<AdminMediaProps> = ({ pickerMode, onSelect, onClose, multiple = true }) => {
  const [media, setMedia] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [currentFolder, setCurrentFolder] = useState<any>(null); // null = All, 'uncategorized' = Uncategorized
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<any>(null);
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // View State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle
  
  // Modals
  const [uploadOpen, setUploadOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<any>(null);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadMedia();
  }, [currentFolder, search]);

  const loadInitialData = async () => {
      try {
          const [f, s] = await Promise.all([mediaService.getFolders(), mediaService.getStats()]);
          setFolders(Array.isArray(f) ? f : []); // Safety check
          setStats(s || {});
      } catch(e) { console.error("Failed to load initial media data", e); }
  };

  const loadMedia = async () => {
      setLoading(true);
      setError('');
      try {
          const folderId = currentFolder?._id || (currentFolder === 'uncategorized' ? 'uncategorized' : 'all');
          const data = await mediaService.getMedia({ folder: folderId, search });
          // CRITICAL FIX: Ensure media is always an array
          // This prevents "e.map is not a function" if backend returns an error object
          if (data && Array.isArray(data.media)) {
              setMedia(data.media);
          } else {
              setMedia([]);
          }
      } catch(e: any) { 
          console.error("Failed to load media", e);
          setError('Failed to load media files. ' + (e.message || ''));
          setMedia([]); // Fallback to empty array to prevent crash
      }
      finally { setLoading(false); }
  };

  const handleCreateFolder = async () => {
      if(!newFolderName) return;
      try {
          await mediaService.createFolder(newFolderName);
          setNewFolderName('');
          setCreateFolderOpen(false);
          loadInitialData();
      } catch(e) { alert('Failed to create folder'); }
  };

  const handleDeleteFolder = async (id: string) => {
      if(confirm('Delete folder? Items will be moved to Uncategorized.')) {
          await mediaService.deleteFolder(id);
          loadInitialData();
          if(currentFolder?._id === id) setCurrentFolder(null);
      }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files && e.target.files.length > 0) {
          setLoading(true);
          try {
              const files = Array.from(e.target.files) as File[];
              await mediaService.upload(files, currentFolder?._id);
              loadMedia();
              loadInitialData(); // update stats
          } catch(err) { alert('Upload failed'); }
          finally { setLoading(false); setUploadOpen(false); }
      }
  };

  const toggleSelect = (id: string) => {
      if (pickerMode && !multiple) {
          setSelectedIds([id]);
          return;
      }
      if(selectedIds.includes(id)) setSelectedIds(prev => prev.filter(i => i !== id));
      else setSelectedIds(prev => [...prev, id]);
  };

  const handleBulkDelete = async () => {
      if(confirm(`Delete ${selectedIds.length} items?`)) {
          await mediaService.bulkDelete(selectedIds);
          setSelectedIds([]);
          loadMedia();
          loadInitialData();
      }
  };

  const handleBulkMove = async (targetFolderId: string | null) => {
      await mediaService.bulkMove(selectedIds, targetFolderId);
      setSelectedIds([]);
      loadMedia();
  };

  const formatSize = (bytes: number) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderIcon = (type: string) => {
      switch(type) {
          case 'video': return <Video size={32} className="text-gray-400" />;
          case 'document': return <FileText size={32} className="text-gray-400" />;
          default: return <ImageIcon size={32} className="text-gray-400" />;
      }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-140px)] overflow-hidden ${pickerMode ? 'fixed inset-0 sm:inset-4 z-[70] h-auto shadow-2xl' : ''}`}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-100 bg-white gap-4">
            <div className="flex items-center gap-3">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sm:hidden p-2 hover:bg-gray-100 rounded-lg">
                    <Menu size={20} />
                </button>
                <h2 className="text-lg font-bold text-gray-800">Media Library</h2>
                {pickerMode && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Picker Mode</span>}
                {pickerMode && (
                    <button onClick={onClose} className="sm:hidden ml-auto p-2 bg-gray-100 hover:bg-gray-200 rounded-full"><X size={18}/></button>
                )}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input 
                        className="pl-9 pr-4 py-2 border rounded-lg text-sm w-full sm:w-64 bg-gray-50 focus:bg-white transition-colors"
                        placeholder="Search media..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-500'}`}><Grid size={16}/></button>
                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-500'}`}><ListIcon size={16}/></button>
                </div>
                {pickerMode && (
                    <button onClick={onClose} className="hidden sm:block ml-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full"><X size={18}/></button>
                )}
            </div>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
            {/* Sidebar */}
            <div className={`
                absolute sm:static inset-y-0 left-0 w-64 bg-gray-50 border-r border-gray-100 z-10 transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full sm:translate-x-0'}
                flex flex-col p-4 overflow-y-auto
            `}>
                <div className="flex justify-between items-center sm:hidden mb-4">
                    <span className="font-bold text-gray-700">Folders</span>
                    <button onClick={() => setSidebarOpen(false)}><X size={20}/></button>
                </div>

                <button 
                    onClick={() => document.getElementById('media-upload')?.click()}
                    className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm mb-6"
                >
                    <Upload size={18} /> Upload New
                    <input id="media-upload" type="file" multiple className="hidden" onChange={handleUpload} />
                </button>

                <div className="space-y-1 mb-6">
                    <button 
                        onClick={() => { setCurrentFolder(null); setSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${!currentFolder ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <span className="flex items-center gap-2"><ImageIcon size={16}/> All Media</span>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">{stats?.count || 0}</span>
                    </button>
                    <button 
                        onClick={() => { setCurrentFolder('uncategorized'); setSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${currentFolder === 'uncategorized' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <span className="flex items-center gap-2"><Folder size={16}/> Uncategorized</span>
                    </button>
                </div>

                <div className="flex items-center justify-between mb-2 px-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">Folders</span>
                    <button onClick={() => setCreateFolderOpen(true)} className="text-indigo-600 hover:bg-indigo-50 p-1 rounded"><FolderPlus size={16}/></button>
                </div>
                <div className="space-y-1">
                    {folders.map(folder => (
                        <div key={folder._id} className="group relative">
                            <button 
                                onClick={() => { setCurrentFolder(folder); setSidebarOpen(false); }}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${currentFolder?._id === folder._id ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <Folder size={16} className="text-yellow-400" fill="currentColor" /> {folder.name}
                            </button>
                            <button 
                                onClick={() => handleDeleteFolder(folder._id)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-200">
                    <div className="bg-white p-3 rounded-lg border border-gray-100">
                        <div className="flex justify-between text-xs mb-2 font-medium text-gray-600">
                            <span>Storage Used</span>
                            <span>{formatSize(stats?.totalSize || 0)}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 w-1/4 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
                {/* Actions Toolbar */}
                {selectedIds.length > 0 && (
                    <div className="p-3 bg-indigo-50 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded">{selectedIds.length} Selected</span>
                            <button onClick={() => setSelectedIds([])} className="text-xs text-indigo-600 hover:underline">Clear</button>
                        </div>
                        <div className="flex items-center gap-2">
                            {pickerMode ? (
                                <button 
                                    onClick={() => {
                                        const selectedItems = media.filter(m => selectedIds.includes(m._id));
                                        if (onSelect) onSelect(selectedItems);
                                        if (onClose) onClose();
                                    }}
                                    className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-indigo-700"
                                >
                                    Insert Selected
                                </button>
                            ) : (
                                <>
                                    <div className="relative group">
                                        <button className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-1">
                                            <Move size={14} /> <span className="hidden sm:inline">Move</span>
                                        </button>
                                        <div className="absolute right-0 top-full mt-1 bg-white border shadow-xl rounded-lg w-48 py-1 hidden group-hover:block z-20">
                                            <button onClick={() => handleBulkMove(null)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Uncategorized</button>
                                            {folders.map(f => (
                                                <button key={f._id} onClick={() => handleBulkMove(f._id)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">{f.name}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={handleBulkDelete} className="bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-50 flex items-center gap-1">
                                        <Trash2 size={14} /> <span className="hidden sm:inline">Delete</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 flex items-center gap-2">
                        <AlertCircle size={18}/> {error}
                    </div>
                )}

                {/* Grid/List */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <div className="flex flex-col items-center">
                                <Loader2 className="animate-spin mb-2" size={32} />
                                <p>Loading assets...</p>
                            </div>
                        </div>
                    ) : media.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <ImageIcon size={48} className="mb-4 opacity-50" />
                            <p className="text-lg font-medium text-gray-500">No media found</p>
                            <p className="text-sm">Upload files to get started</p>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {media.map(item => (
                                <div 
                                    key={item._id} 
                                    onClick={() => toggleSelect(item._id)}
                                    className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all hover:shadow-md
                                        ${selectedIds.includes(item._id) ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-gray-200 bg-gray-50'}`}
                                >
                                    <div className="aspect-square relative flex items-center justify-center bg-gray-100 overflow-hidden">
                                        {item.type === 'image' ? (
                                            <img src={item.url} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                        ) : renderIcon(item.type)}
                                        
                                        {/* Overlay */}
                                        <div className={`absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center gap-2 ${selectedIds.includes(item._id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                            {!pickerMode && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setDetailItem(item); }}
                                                    className="p-2 bg-white/90 rounded-full hover:bg-white text-gray-800"
                                                    title="View Details"
                                                >
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            )}
                                            {selectedIds.includes(item._id) && (
                                                <div className="absolute top-2 left-2 bg-indigo-600 text-white rounded-full p-1">
                                                    <CheckSquare size={14} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-2 bg-white border-t border-gray-100">
                                        <p className="text-xs font-medium text-gray-900 truncate" title={item.filename}>{item.filename}</p>
                                        <p className="text-[10px] text-gray-500 mt-0.5">{formatSize(item.size)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-4 py-3 w-10"><CheckSquare size={16}/></th>
                                        <th className="px-4 py-3">File</th>
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3">Size</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {media.map(item => (
                                        <tr 
                                            key={item._id} 
                                            onClick={() => toggleSelect(item._id)}
                                            className={`hover:bg-gray-50 cursor-pointer ${selectedIds.includes(item._id) ? 'bg-indigo-50/50' : ''}`}
                                        >
                                            <td className="px-4 py-3">
                                                <input type="checkbox" checked={selectedIds.includes(item._id)} onChange={() => toggleSelect(item._id)} className="rounded text-indigo-600" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center overflow-hidden border shrink-0">
                                                        {item.type === 'image' ? <img src={item.url} className="w-full h-full object-cover" /> : renderIcon(item.type)}
                                                    </div>
                                                    <span className="font-medium text-gray-900 truncate max-w-[200px]">{item.filename}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 capitalize">{item.type}</td>
                                            <td className="px-4 py-3 text-gray-500">{formatSize(item.size)}</td>
                                            <td className="px-4 py-3 text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={(e) => { e.stopPropagation(); setDetailItem(item); }} className="text-gray-400 hover:text-indigo-600"><MoreHorizontal size={18}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Create Folder Modal */}
        {createFolderOpen && (
            <div className="fixed inset-0 bg-black/50 z-[80] flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
                    <h3 className="text-lg font-bold mb-4">Create Folder</h3>
                    <input 
                        autoFocus
                        className="w-full border rounded-lg px-4 py-2 mb-4" 
                        placeholder="Folder Name"
                        value={newFolderName}
                        onChange={e => setNewFolderName(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setCreateFolderOpen(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                        <button onClick={handleCreateFolder} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Create</button>
                    </div>
                </div>
            </div>
        )}

        {/* Detail Modal */}
        {detailItem && (
            <MediaDetailModal 
                item={detailItem} 
                onClose={() => setDetailItem(null)} 
                onDelete={() => { handleDeleteFolder(detailItem._id); setDetailItem(null); loadMedia(); }} 
                folders={folders}
                onUpdate={() => { loadMedia(); }}
            />
        )}
    </div>
  );
};

const MediaDetailModal = ({ item, onClose, onDelete, folders, onUpdate }: any) => {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ filename: item.filename, alt: item.alt || '', folder: item.folder?._id || '' });

    const handleSave = async () => {
        try {
            await mediaService.update(item._id, formData);
            onUpdate();
            setEditMode(false);
        } catch(e) { alert('Update failed'); }
    };

    const handleDelete = async () => {
        if(confirm('Delete this file?')) {
            await mediaService.delete(item._id);
            onUpdate();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[90] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col md:flex-row overflow-hidden">
                {/* Preview Area */}
                <div className="flex-1 bg-gray-100 flex items-center justify-center p-8 relative min-h-[300px]">
                    {item.type === 'image' ? (
                        <img src={item.url} className="max-w-full max-h-full object-contain shadow-lg" />
                    ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                            <FileText size={64} />
                            <p className="mt-4 text-lg font-medium">{item.filename}</p>
                        </div>
                    )}
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70">
                        <X size={20} />
                    </button>
                </div>

                {/* Info Sidebar */}
                <div className="w-full md:w-80 bg-white border-l border-gray-100 p-6 overflow-y-auto">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate" title={item.filename}>{item.filename}</h3>
                        <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleString()}</p>
                    </div>

                    <div className="space-y-4">
                        {editMode ? (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Filename</label>
                                    <input className="w-full border rounded px-2 py-1 text-sm" value={formData.filename} onChange={e => setFormData({...formData, filename: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Alt Text</label>
                                    <input className="w-full border rounded px-2 py-1 text-sm" value={formData.alt} onChange={e => setFormData({...formData, alt: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Folder</label>
                                    <select className="w-full border rounded px-2 py-1 text-sm" value={formData.folder} onChange={e => setFormData({...formData, folder: e.target.value})}>
                                        <option value="">Uncategorized</option>
                                        {folders.map((f: any) => <option key={f._id} value={f._id}>{f.name}</option>)}
                                    </select>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-1.5 rounded text-sm font-medium">Save</button>
                                    <button onClick={() => setEditMode(false)} className="px-3 border rounded text-sm">Cancel</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 text-xs">Size</p>
                                        <p className="font-medium text-gray-900">{(item.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Dimensions</p>
                                        <p className="font-medium text-gray-900">{item.width} x {item.height}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Type</p>
                                        <p className="font-medium text-gray-900 capitalize">{item.format || item.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Folder</p>
                                        <p className="font-medium text-gray-900">{item.folder?.name || 'Uncategorized'}</p>
                                    </div>
                                </div>
                                
                                {item.alt && (
                                    <div>
                                        <p className="text-gray-500 text-xs">Alt Text</p>
                                        <p className="text-sm text-gray-900">{item.alt}</p>
                                    </div>
                                )}

                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 break-all">
                                    <p className="text-xs text-gray-500 mb-1">Public URL</p>
                                    <p className="text-xs text-blue-600 truncate">{item.url}</p>
                                    <button onClick={() => navigator.clipboard.writeText(item.url)} className="text-xs font-bold text-gray-700 mt-2 hover:text-black">Copy URL</button>
                                </div>

                                <div className="pt-6 space-y-2">
                                    <button onClick={() => setEditMode(true)} className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                                        Edit Details
                                    </button>
                                    <button onClick={handleDelete} className="w-full border border-red-200 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-50">
                                        Delete File
                                    </button>
                                    <a href={item.url} download target="_blank" className="block w-full text-center border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                                        Download
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};