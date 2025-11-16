import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import {
    ArrowLeftIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    MapPinIcon,
    CalendarIcon,
    TrophyIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';

const ProblemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    const fetchProblemDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get(`/problems/${id}`);
            setProblem(response.data.data);
        } catch (error) {
            console.error('Error fetching problem details:', error);
            toast.error('Failed to load problem details');
            navigate('/student/my-problem-reports');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchProblemDetails();
    }, [fetchProblemDetails]);

    const getStatusBadge = (status) => {
        const badges = {
            pending: {
                icon: ClockIcon,
                text: 'Pending Review',
                color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
            },
            approved: {
                icon: CheckCircleIcon,
                text: 'Approved',
                color: 'bg-green-100 text-green-800 border-green-300'
            },
            rejected: {
                icon: XCircleIcon,
                text: 'Rejected',
                color: 'bg-red-100 text-red-800 border-red-300'
            },
            resolved: {
                icon: CheckCircleIcon,
                text: 'Resolved',
                color: 'bg-blue-100 text-blue-800 border-blue-300'
            }
        };

        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;

        return (
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-medium border ${badge.color}`}>
                <Icon className="w-5 h-5" />
                {badge.text}
            </span>
        );
    };

    const getSeverityBadge = (severity) => {
        const colors = {
            low: 'bg-green-100 text-green-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-orange-100 text-orange-800',
            critical: 'bg-red-100 text-red-800'
        };

        return (
            <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${colors[severity]}`}>
                {severity.toUpperCase()}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <ExclamationTriangleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Problem Not Found</h2>
                    <p className="text-gray-600 mb-4">The problem you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/student/my-problem-reports')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to My Reports
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/student/my-problem-reports')}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    Back to My Reports
                </button>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-3">{problem.title}</h1>
                                <div className="flex flex-wrap items-center gap-3">
                                    {getStatusBadge(problem.status)}
                                    {getSeverityBadge(problem.severity)}
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-medium">
                                        {problem.category}
                                    </span>
                                </div>
                            </div>
                            {problem.pointsAwarded > 0 && (
                                <div className="bg-yellow-400 text-yellow-900 rounded-lg px-6 py-3 shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <TrophyIcon className="w-6 h-6" />
                                        <span className="text-xl font-bold">
                                            +{problem.pointsAwarded} Points
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-6 text-blue-100">
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="w-5 h-5" />
                                <span>{problem.location.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5" />
                                <span>Reported on {new Date(problem.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Images Section */}
                    {problem.images && problem.images.length > 0 && (
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <PhotoIcon className="w-6 h-6" />
                                Images ({problem.images.length})
                            </h2>
                            <div className="space-y-4">
                                {/* Main Image */}
                                <div className="relative">
                                    <img
                                        src={problem.images[selectedImage]}
                                        alt={`${problem.title} - view ${selectedImage + 1}`}
                                        className="w-full h-96 object-contain bg-gray-100 rounded-lg"
                                    />
                                </div>
                                {/* Thumbnail Gallery */}
                                {problem.images.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {problem.images.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedImage(index)}
                                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                                        ? 'border-blue-600 shadow-lg'
                                                        : 'border-gray-300 hover:border-blue-400'
                                                    }`}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Description Section */}
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {problem.description}
                        </p>
                    </div>

                    {/* Location Details */}
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-900 mb-3">Location Details</h2>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700 mb-2">
                                <span className="font-semibold">Address:</span> {problem.location.address}
                            </p>
                            {problem.location.coordinates && (
                                <p className="text-gray-700">
                                    <span className="font-semibold">Coordinates:</span>{' '}
                                    {problem.location.coordinates[1]}, {problem.location.coordinates[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Admin Feedback */}
                    {problem.adminFeedback && (
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">Admin Feedback</h2>
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                <p className="text-blue-900">{problem.adminFeedback}</p>
                            </div>
                        </div>
                    )}

                    {/* Event Link */}
                    {problem.eventId && (
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">Related Event</h2>
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                                <p className="text-green-900 font-semibold mb-2">
                                    ✅ An event has been created for this problem!
                                </p>
                                <button
                                    onClick={() => navigate(`/student/events/${problem.eventId._id}`)}
                                    className="text-green-700 hover:text-green-800 font-medium underline"
                                >
                                    View Event: {problem.eventId.title}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="p-6 bg-gray-50">
                        <div className="flex flex-wrap gap-3">
                            {problem.status === 'pending' && (
                                <button
                                    onClick={() => navigate(`/student/report-problem?edit=${problem._id}`)}
                                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Edit Report
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/student/my-problem-reports')}
                                className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Back to Reports
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemDetails;
