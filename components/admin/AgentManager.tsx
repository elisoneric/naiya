import React, { useState, useEffect } from 'react';
import { ticketService } from '../../services/ticketService';
import { storageService } from '../../services/storageService';
import { CloseIcon, TrashIcon, UsersIcon } from '../common/Icons';
import { useToast } from '../../contexts/ToastContext';

const AgentManager: React.FC<{onClose: () => void}> = ({ onClose }) => {
    const [agents, setAgents] = useState<string[]>([]);
    const [newAgent, setNewAgent] = useState('');
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        loadAgents();
    }, []);

    const loadAgents = () => {
        // @ts-ignore - accessing service directly
        const list = storageService.getAllowedAgents();
        setAgents(list);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAgent.trim()) return;
        
        if (agents.includes(newAgent.trim())) {
            addToast('Agent email already exists', 'error');
            return;
        }

        // @ts-ignore
        storageService.saveAllowedAgents([newAgent.trim()]);
        addToast('Agent added successfully', 'success');
        setNewAgent('');
        loadAgents();
    };

    const handleRemove = (email: string) => {
        if (window.confirm(`Remove ${email} from authorized agents?`)) {
            // @ts-ignore
            storageService.removeAllowedAgent(email);
            addToast('Agent removed', 'info');
            loadAgents();
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const reader = new FileReader();
        reader.onload = async (evt) => {
            const text = evt.target?.result as string;
            if (text) {
                try {
                    await ticketService.uploadAgents(text);
                    addToast('Bulk import successful', 'success');
                    loadAgents();
                } catch (err) {
                    addToast('Error parsing file', 'error');
                } finally {
                    setLoading(false);
                }
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 w-full max-w-4xl h-[80vh] rounded-lg shadow-2xl flex flex-col overflow-hidden animate-fade-in-down border dark:border-gray-700 transition-colors duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-outlook-blue dark:bg-outlook-darkBlue text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-full">
                            <UsersIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Agent Management Portal</h2>
                            <p className="text-xs opacity-90">Manage authorized user access</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar / Actions */}
                    <div className="w-1/3 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-6">
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">Add New Agent</h3>
                            <form onSubmit={handleAdd} className="space-y-3">
                                <input 
                                    type="email" 
                                    value={newAgent}
                                    onChange={(e) => setNewAgent(e.target.value)}
                                    placeholder="email@example.com"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-outlook-blue focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                                    required
                                />
                                <button type="submit" className="w-full bg-outlook-blue text-white py-2 rounded-md hover:bg-outlook-darkBlue font-medium shadow-sm transition">
                                    Add Agent
                                </button>
                            </form>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">Bulk Import</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Upload a CSV or TXT file with email addresses.</p>
                            <label className="block w-full cursor-pointer bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                                <span className="text-sm text-outlook-blue dark:text-blue-300 font-medium">{loading ? 'Importing...' : 'Choose File'}</span>
                                <input type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} disabled={loading} />
                            </label>
                        </div>
                        
                        <div className="mt-auto p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-800 dark:text-blue-200 border dark:border-blue-800/30">
                            <strong>Note:</strong> Agents must have their email in this list to access the User Portal.
                        </div>
                    </div>

                    {/* Main List */}
                    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
                            <span className="font-semibold text-gray-700 dark:text-gray-200">Authorized Agents ({agents.length})</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            {agents.length === 0 ? (
                                <div className="text-center text-gray-400 mt-10">No agents found.</div>
                            ) : (
                                <div className="grid gap-2">
                                    {agents.map((email) => (
                                        <div key={email} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg hover:shadow-sm transition group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold">
                                                    {email.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-gray-800 dark:text-gray-200 font-medium">{email}</span>
                                            </div>
                                            <button 
                                                onClick={() => handleRemove(email)}
                                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-2"
                                                title="Remove Access"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentManager;