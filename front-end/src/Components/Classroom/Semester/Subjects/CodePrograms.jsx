import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// C programs a teacher shared under this subject. Students can read them,
// copy them, or open them straight in the Playground to run.
const CodePrograms = ({ subjectId }) => {
	const navigate = useNavigate();
	const [codes, setCodes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [expandedId, setExpandedId] = useState(null);
	const [copiedId, setCopiedId] = useState(null);

	useEffect(() => {
		const fetchCodes = async () => {
			setLoading(true);
			setError('');
			try {
				const res = await axios.get(`${apiUrl}/subjects/${subjectId}/codes`, { withCredentials: true });
				setCodes(res.data);
			} catch (err) {
				setError('Failed to load C programs.');
			} finally {
				setLoading(false);
			}
		};
		if (subjectId) fetchCodes();
	}, [subjectId]);

	const handleCopy = async (snippet) => {
		try {
			await navigator.clipboard.writeText(snippet.code);
			setCopiedId(snippet._id);
			setTimeout(() => setCopiedId((id) => (id === snippet._id ? null : id)), 1500);
		} catch {
			// Clipboard can be unavailable (e.g. insecure context); ignore.
		}
	};

	if (loading) return null;
	if (error) return <p className="text-center text-red-500 font-sans mt-12">{error}</p>;
	if (codes.length === 0) return null;

	return (
		<div className="mt-16">
			<h2 className="text-2xl font-bold text-gray-800 mb-6 font-sans">C Programs</h2>
			<div className="flex flex-col gap-4">
				{codes.map((snippet) => (
					<div key={snippet._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 font-sans">
						<div className="flex flex-wrap items-start justify-between gap-3">
							<div className="min-w-0">
								<h3 className="text-lg font-bold text-gray-800">{snippet.title}</h3>
								{snippet.description && <p className="text-sm text-gray-500">{snippet.description}</p>}
							</div>
							<div className="flex gap-2 flex-wrap">
								<button
									onClick={() => setExpandedId(expandedId === snippet._id ? null : snippet._id)}
									className="bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white transition-colors duration-200 font-semibold py-1.5 px-3 rounded-full text-sm"
								>
									{expandedId === snippet._id ? 'Hide Code' : 'View Code'}
								</button>
								<button
									onClick={() => handleCopy(snippet)}
									className="bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200 font-semibold py-1.5 px-3 rounded-full text-sm"
								>
									{copiedId === snippet._id ? 'Copied!' : 'Copy'}
								</button>
								<button
									onClick={() => navigate('/playground', { state: { language: 'c', code: snippet.code } })}
									className="bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:from-brand-700 hover:to-brand-600 transition-all font-semibold py-1.5 px-3 rounded-full text-sm"
								>
									Run in Playground ▶
								</button>
							</div>
						</div>
						{expandedId === snippet._id && (
							<pre className="mt-4 bg-gray-900 text-gray-100 text-sm rounded-lg p-4 overflow-x-auto text-left"><code>{snippet.code}</code></pre>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default CodePrograms;
