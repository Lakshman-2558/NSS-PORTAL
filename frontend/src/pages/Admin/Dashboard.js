import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import {
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import VibrantPageLayout from '../../components/VibrantPageLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/users/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: UsersIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Events',
      value: stats?.totalEvents || 0,
      icon: CalendarIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Total Participations',
      value: stats?.totalParticipations || 0,
      icon: CheckCircleIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Volunteer Hours',
      value: stats?.totalVolunteerHours || 0,
      icon: ClockIcon,
      color: 'bg-orange-500'
    }
  ];

  const customCounters = {
    volunteers: { 
      value: stats?.totalStudents || 0, 
      label: 'Total Students', 
      icon: '👥' 
    },
    camps: { 
      value: stats?.totalEvents || 0, 
      label: 'Total Events', 
      icon: '📅' 
    },
    hours: { 
      value: stats?.totalParticipations || 0, 
      label: 'Total Participations', 
      icon: '✅' 
    },
    impact: { 
      value: stats?.totalVolunteerHours || 0, 
      label: 'Volunteer Hours', 
      icon: '⏰' 
    }
  };

  return (
    <VibrantPageLayout
      backgroundImage="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200"
      title="Admin Dashboard"
      subtitle="Manage and monitor NSS activities and statistics"
      counters={customCounters}
      showCounters={true}
      showBlog={true}
    >
      <div className="space-y-6">

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`${stat.color} rounded-md p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.title}
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/admin/events"
              className="block w-full text-left px-4 py-2 bg-primary-50 hover:bg-primary-100 rounded-md text-primary-700 font-medium"
            >
              Create New Event
            </a>
            <a
              href="/admin/participations"
              className="block w-full text-left px-4 py-2 bg-primary-50 hover:bg-primary-100 rounded-md text-primary-700 font-medium"
            >
              Review Participations
            </a>
            <a
              href="/admin/reports"
              className="block w-full text-left px-4 py-2 bg-primary-50 hover:bg-primary-100 rounded-md text-primary-700 font-medium"
            >
              Generate Reports
            </a>
          </div>
        </div>
      </div>
      </div>
    </VibrantPageLayout>
  );
};

export default AdminDashboard;

