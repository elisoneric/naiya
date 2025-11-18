
import React, { useState } from 'react';
import { ticketService } from '../../services/ticketService';

const AgentUploader: React.FC<{onClose: () => void}> = ({ onClose }) => {
    const [status, setStatus] = useState('');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            const text = evt.target?.result as string;
            if (text) {
                try {
                    await ticketService.uploadAgents(text);
                    setStatus('Successfully imported agents!');
                    setTimeout(onClose, 1500);
                } catch (err) {
                    setStatus('Error parsing file.');
                }
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Manage Agents</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Upload a .csv or .txt file containing agent emails (comma or newline separated) to update the <code>agents.json</code> database.
                </p>
                
                <div className="space-y-4">
                    <input 
                        type="file" 
                        accept=".csv,.txt,.json"
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-outlook-blue file:text-white
                        hover:file:bg-outlook-darkBlue
                        "
                    />
                    
                    {status && <p className="text-sm font-medium text-green-600 text-center">{status}</p>}

                    <button 
                        onClick={onClose}
                        className="w-full py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgentUploader;
