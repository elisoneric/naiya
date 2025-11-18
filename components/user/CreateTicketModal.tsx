import React, { useState, useContext } from 'react';
import { ticketService } from '../../services/ticketService';
import { AuthContext } from '../../contexts/AuthContext';
import { CloseIcon } from '../common/Icons';

interface CreateTicketModalProps {
    onClose: () => void;
    onTicketCreated: () => void;
}

const categories = [
    { value: 'nimc_client_password', label: 'NIMC Client Password Reset' },
    { value: 'webmail_password', label: 'Webmail Password Reset' },
    { value: 'vpn', label: 'VPN Connection Issue' },
    { value: 'device_activation', label: 'Device Activation' },
    { value: 'Onboarding', label: 'New Staff Onboarding' },
    { value: 'other', label: 'Other Issue' },
];

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ onClose, onTicketCreated }) => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        category: 'other',
        title: '',
        description: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            await ticketService.createTicket(formData, user);
            onTicketCreated();
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 dark:bg-gray-900 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up border border-gray-700 dark:border-gray-600">
                <div className="flex justify-between items-center p-5 border-b border-gray-700 dark:border-gray-800">
                    <h3 className="text-xl font-bold text-white">Create New Ticket</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full border-gray-600 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2.5 bg-gray-700 dark:bg-gray-800 border text-white"
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full border-gray-600 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2.5 border bg-gray-700 dark:bg-gray-800 text-white placeholder-gray-400"
                            placeholder="Brief summary of the issue"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full border-gray-600 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2.5 border bg-gray-700 dark:bg-gray-800 text-white placeholder-gray-400"
                            placeholder="Please provide detailed information..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-medium disabled:opacity-70"
                        >
                            {loading ? 'Creating...' : 'Submit Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTicketModal;