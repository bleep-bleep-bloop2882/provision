import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, GitPullRequest, GitCommit, Plus, CheckCircle2, Clock, Check, FileText, Copy, ChevronDown, ChevronRight, FolderTree, FileCode2, Trash2, X } from 'lucide-react';

export default function GitView({ currentUser }) {
  const [activeTab, setActiveTab] = useState('branches'); // 'branches' | 'prs'
  const [expandedBranches, setExpandedBranches] = useState(new Set());
  
  const [branches, setBranches] = useState([
    { id: 'main', name: 'main', updated: '2 hours ago', author: 'System', status: 'default', files: [] },
    { id: 'feat/auth', name: 'feat/oauth2-login', updated: '1 day ago', author: 'Alex Rivera', status: 'active', files: [{ name: 'src/components/Login.jsx', type: 'modified' }, { name: 'src/hooks/useAuth.js', type: 'added' }] },
    { id: 'fix/ui', name: 'fix/dashboard-padding', updated: '3 days ago', author: 'Priya Nair', status: 'merged', files: [{ name: 'src/index.css', type: 'modified' }, { name: 'src/components/Dashboard.jsx', type: 'modified' }] },
  ]);

  const [prs, setPrs] = useState([
    { id: 1, title: 'Add OAuth 2.1 support to login', branch: 'feat/oauth2-login', target: 'main', status: 'Open', author: 'Alex Rivera', comments: 3, reviewers: ['Manager (Sarah Johnson)'] },
    { id: 2, title: 'Fix padding on manager dashboard', branch: 'fix/dashboard-padding', target: 'main', status: 'Merged', author: 'Priya Nair', comments: 1, reviewers: ['Manager (Sarah Johnson)'] },
  ]);

  const [showNewBranch, setShowNewBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');

  const [showNewPR, setShowNewPR] = useState(false);
  const [prTitle, setPrTitle] = useState('');
  const [prBranch, setPrBranch] = useState('');
  const [prTargetBranch, setPrTargetBranch] = useState('main');
  const [copiedBranch, setCopiedBranch] = useState(null);
  const [selectedPR, setSelectedPR] = useState(null);

  const [prReviewers, setPrReviewers] = useState(['Manager (Sarah Johnson)']);
  const [isEditingReviewers, setIsEditingReviewers] = useState(false);
  const availableReviewers = ['Manager (Sarah Johnson)', 'Alex Rivera', 'Priya Nair', 'Jordan Lee', 'Morgan Chen'];
  
  const toggleReviewer = (rev) => {
    setPrReviewers(prev => prev.includes(rev) ? prev.filter(r => r !== rev) : [...prev, rev]);
  };

  const handleCopy = (e, name) => {
    e.stopPropagation();
    navigator.clipboard.writeText(name);
    setCopiedBranch(name);
    setTimeout(() => setCopiedBranch(null), 2000);
  };

  const toggleBranch = (id) => {
    setExpandedBranches(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCreateBranch = (e) => {
    e.preventDefault();
    if (!newBranchName.trim()) return;
    setBranches(prev => [{
      id: Date.now().toString(),
      name: newBranchName,
      updated: 'Just now',
      author: currentUser?.name || 'You',
      status: 'active',
      files: [{ name: 'src/new-feature.js', type: 'added' }]
    }, ...prev]);
    setNewBranchName('');
    setShowNewBranch(false);
  };

  const handleCreatePR = (e) => {
    e.preventDefault();
    if (!prTitle.trim() || !prBranch || !prTargetBranch) return;
    setPrs(prev => [{
      id: Date.now(),
      title: prTitle,
      branch: prBranch,
      target: prTargetBranch,
      status: 'Open',
      author: currentUser?.name || 'You',
      comments: 0,
      reviewers: prReviewers.length > 0 ? prReviewers : ['None']
    }, ...prev]);
    setPrTitle('');
    setPrBranch('');
    setPrTargetBranch('main');
    setPrReviewers(['Manager (Sarah Johnson)']);
    setIsEditingReviewers(false);
    setShowNewPR(false);
    setActiveTab('prs');
  };

  const handleDeletePR = (id) => {
    setPrs(prev => prev.filter(pr => pr.id !== id));
    setSelectedPR(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Version Control</h2>
          <p className="text-slate-400 text-sm">Manage your branches, commits, and pull requests for the Provision Platform.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowNewBranch(true)} className="btn-secondary flex items-center gap-2">
            <GitBranch size={16} /> New Branch
          </button>
          <button onClick={() => setShowNewPR(true)} className="btn-primary flex items-center gap-2">
            <GitPullRequest size={16} /> Raise PR
          </button>
        </div>
      </div>

      <div className="flex border-b border-surface-600 mb-6">
        <button
          onClick={() => setActiveTab('branches')}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'branches' ? 'border-primary-500 text-primary-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          Branches
        </button>
        <button
          onClick={() => setActiveTab('prs')}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'prs' ? 'border-primary-500 text-primary-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          Pull Requests
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'branches' && (
            <motion.div key="branches" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-600 bg-surface-800 text-slate-400">
                      <th className="text-left font-medium px-4 py-3">Branch Name</th>
                      <th className="text-left font-medium px-4 py-3">Author</th>
                      <th className="text-left font-medium px-4 py-3">Updated</th>
                      <th className="text-left font-medium px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.map(b => (
                      <React.Fragment key={b.id}>
                        <tr onClick={() => b.files && b.files.length > 0 && toggleBranch(b.id)} className={`border-b border-surface-700 hover:bg-surface-800/50 transition-colors ${b.files && b.files.length > 0 ? 'cursor-pointer' : ''}`}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 text-white">
                              {b.files && b.files.length > 0 ? (
                                expandedBranches.has(b.id) ? <ChevronDown size={14} className="text-slate-400 shrink-0" /> : <ChevronRight size={14} className="text-slate-400 shrink-0" />
                              ) : <span className="w-[14px]"></span>}
                              <GitBranch size={14} className="text-slate-400 shrink-0" />
                              <span className="font-mono text-xs font-semibold px-2 py-1 bg-surface-700 rounded-md text-primary-300 flex items-center gap-2">
                                {b.name}
                                <button type="button" onClick={(e) => handleCopy(e, b.name)} className="text-slate-400 hover:text-white" title="Copy Branch Name">
                                  {copiedBranch === b.name ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                                </button>
                              </span>
                              {b.status === 'default' && <span className="text-[10px] uppercase font-bold text-slate-500 border border-slate-600 px-1.5 py-0.5 rounded">Default</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-400">{b.author}</td>
                          <td className="px-4 py-3 text-slate-400">{b.updated}</td>
                          <td className="px-4 py-3">
                            {b.status === 'merged' && <span className="text-purple-400 text-xs flex items-center gap-1"><GitCommit size={14}/> Merged</span>}
                            {b.status === 'active' && <span className="text-green-400 text-xs flex items-center gap-1"><Clock size={14}/> Active</span>}
                          </td>
                        </tr>
                        {expandedBranches.has(b.id) && b.files && b.files.length > 0 && (
                          <tr className="bg-surface-900/40 border-b border-surface-700/50">
                            <td colSpan={4} className="p-4 pl-12 text-sm text-slate-300">
                              <div className="flex items-center gap-2 mb-2 font-medium text-slate-400">
                                <FolderTree size={14} /> Changed Files
                              </div>
                              <div className="space-y-1 ml-4 pl-2 border-l border-surface-600">
                                {b.files.map((file, idx) => (
                                  <div key={idx} className="flex items-center gap-2 py-1">
                                    <FileCode2 size={13} className="text-slate-500" />
                                    <span className="font-mono text-xs">{file.name}</span>
                                    <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${file.type === 'added' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{file.type}</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'prs' && (
            <motion.div key="prs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="space-y-3">
                {prs.map(pr => (
                  <div key={pr.id} onClick={() => setSelectedPR(pr)} className="card p-4 hover:border-primary-500 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${pr.status === 'Open' ? 'text-green-500' : 'text-purple-500'}`}>
                          <GitPullRequest size={18} />
                        </div>
                        <div>
                          <h4 className="text-white font-medium group-hover:text-primary-400 transition-colors">{pr.title} <span className="text-slate-500 text-xs ml-2">#{pr.id}</span></h4>
                          <div className="text-xs text-slate-500 mt-1 flex items-center flex-wrap gap-2">
                            <span>Opened by {pr.author}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <span className="font-mono bg-surface-700 px-1 py-0.5 text-[10px] rounded text-primary-300">{pr.branch}</span>
                              <span>→</span>
                              <span className="font-mono bg-surface-700 px-1 py-0.5 text-[10px] rounded text-primary-300">{pr.target}</span>
                            </div>
                            <span>•</span>
                            <span className="bg-surface-800 border border-surface-600 px-1.5 py-0.5 rounded inline-flex items-center gap-1 overflow-hidden" style={{ maxWidth: '200px' }}>
                              Reviewers: <span className="text-white font-medium truncate">{pr.reviewers.join(', ')}</span>
                            </span>
                            <FileText size={12} className="ml-2" /> {pr.comments}
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className={`text-xs px-2 py-1 rounded-full border ${pr.status === 'Open' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-purple-500/30 text-purple-400 bg-purple-500/10'}`}>
                          {pr.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* New Branch Modal */}
      <AnimatePresence>
        {showNewBranch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card w-full max-w-sm p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><GitBranch size={18}/> Create Branch</h3>
              <form onSubmit={handleCreateBranch}>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Branch Name</label>
                  <input autoFocus type="text" className="input w-full" placeholder="e.g. feature/new-button" value={newBranchName} onChange={e => setNewBranchName(e.target.value)} />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowNewBranch(false)} className="btn-ghost">Cancel</button>
                  <button type="submit" className="btn-primary">Create</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* New PR Modal */}
        {showNewPR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card w-full max-w-md p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><GitPullRequest size={18}/> New Pull Request</h3>
              <form onSubmit={handleCreatePR}>
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">From Branch</label>
                    <select className="input w-full appearance-none bg-surface-900 border-surface-600" value={prBranch} onChange={e => setPrBranch(e.target.value)}>
                      <option value="" disabled>Select source...</option>
                      {branches.filter(b => b.status !== 'default').map(b => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">To Branch</label>
                    <select className="input w-full appearance-none bg-surface-900 border-surface-600" value={prTargetBranch} onChange={e => setPrTargetBranch(e.target.value)}>
                      {branches.map(b => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-400">Reviewers</label>
                    <button type="button" onClick={() => setIsEditingReviewers(!isEditingReviewers)} className="text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium">
                      {isEditingReviewers ? 'Done' : 'Edit'}
                    </button>
                  </div>
                  
                  {isEditingReviewers ? (
                    <div className="p-3 border border-surface-600 bg-surface-800 rounded flex flex-wrap gap-2">
                      {availableReviewers.map(rev => {
                        const isSelected = prReviewers.includes(rev);
                        return (
                          <button type="button" key={rev} onClick={() => toggleReviewer(rev)} className={`text-[10px] px-2 py-1.5 rounded-full flex items-center gap-1.5 border transition-all ${isSelected ? 'border-primary-500/50 bg-primary-500/10 text-primary-300' : 'border-surface-600 bg-surface-900 text-slate-400 hover:text-white hover:border-slate-500'}`}>
                            {isSelected && <Check size={12} className="text-primary-400" />} {rev}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-2 border border-surface-600 bg-surface-800 rounded text-slate-300 text-sm flex items-center gap-2 flex-wrap">
                      {prReviewers.length > 0 ? prReviewers.map(r => (
                        <span key={r} className="flex items-center gap-1.5 text-[10px] bg-surface-900 px-2 py-1 rounded">
                          <CheckCircle2 size={12} className="text-green-500 shrink-0" /> <span className="truncate max-w-[100px]">{r}</span>
                        </span>
                      )) : <span className="text-xs text-slate-500 italic px-2">No reviewers assigned</span>}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Title</label>
                  <input type="text" className="input w-full" placeholder="Brief summary of your changes" value={prTitle} onChange={e => setPrTitle(e.target.value)} />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowNewPR(false)} className="btn-ghost">Cancel</button>
                  <button type="submit" className="btn-primary" disabled={!prBranch || !prTitle}>Create PR</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* PR Details Modal */}
        {selectedPR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card w-full max-w-2xl flex flex-col max-h-[85vh]">
              <div className="p-6 border-b border-surface-600 flex items-start justify-between shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {selectedPR.title} <span className="text-slate-500 font-normal text-sm">#{selectedPR.id}</span>
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-bold tracking-wider ${selectedPR.status === 'Open' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-purple-500/30 text-purple-400 bg-purple-500/10'}`}>
                      {selectedPR.status}
                    </span>
                    <span className="text-xs text-slate-400">Opened by {selectedPR.author}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedPR(null)} className="text-slate-500 hover:text-white p-1">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 text-sm bg-surface-900/50">
                <div className="flex items-center gap-1.5 mb-6 text-xs bg-surface-800 p-3 rounded-lg border border-surface-600">
                  <span className="text-slate-400">Merging from</span>
                  <span className="font-mono bg-surface-700 px-1.5 py-0.5 rounded text-primary-300">{selectedPR.branch}</span>
                  <span className="text-slate-400 mx-1">into</span>
                  <span className="font-mono bg-surface-700 px-1.5 py-0.5 rounded text-primary-300">{selectedPR.target}</span>
                </div>

                <div className="mb-6">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2"><FolderTree size={14} className="text-primary-400" /> Files Changed</h4>
                  {(() => {
                    const branchInfo = branches.find(b => b.name === selectedPR.branch);
                    const files = branchInfo && branchInfo.files && branchInfo.files.length > 0 ? branchInfo.files : [{ name: 'src/mock-patch.js', type: 'modified' }];
                    return (
                      <div className="space-y-4">
                        {files.map((file, i) => (
                          <div key={i} className="border border-surface-600 rounded overflow-hidden">
                            <div className="bg-surface-800 p-2.5 border-b border-surface-600 flex items-center gap-3 justify-between text-xs">
                              <span className="font-mono text-slate-300 flex items-center gap-2"><FileCode2 size={13} className="text-slate-500" /> {file.name}</span>
                              <span className={`px-1.5 py-0.5 rounded uppercase font-bold text-[9px] ${file.type === 'added' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'}`}>{file.type}</span>
                            </div>
                            <div className="bg-[#1e1e1e] p-3 overflow-x-auto">
                              <pre className="text-[11px] font-mono leading-relaxed">
                                {file.type === 'added' ? (
                                  <span className="text-green-400">
                                    + export function Component() {'{'}{'\n'}
                                    +   return &lt;div&gt;Hello World&lt;/div&gt;;{'\n'}
                                    + {'}'}
                                  </span>
                                ) : (
                                  <>
                                    <span className="text-slate-500">@@ -42,7 +42,7 @@</span>{'\n'}
                                    <span className="text-slate-300">  function handleAction() {'{'}</span>{'\n'}
                                    <span className="text-red-400">-   console.log("old");</span>{'\n'}
                                    <span className="text-green-400">+   console.log("new action updated");</span>{'\n'}
                                    <span className="text-slate-300">    return true;</span>{'\n'}
                                    <span className="text-slate-300">  {'}'}</span>
                                  </>
                                )}
                              </pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="p-4 border-t border-surface-600 flex justify-end gap-3 shrink-0 bg-surface-900 rounded-b-xl">
                {selectedPR.status === 'Open' ? (
                  <button onClick={() => handleDeletePR(selectedPR.id)} className="btn-ghost text-red-400 hover:bg-red-500/10 hover:text-red-400 mr-auto flex items-center gap-2 font-medium">
                    <Trash2 size={14} /> Delete PR
                  </button>
                ) : <div className="mr-auto"></div>}
                <button onClick={() => setSelectedPR(null)} className="btn-secondary">Close</button>
                {selectedPR.status !== 'Merged' && (
                  <button className="btn-primary" disabled>Merge PR</button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
