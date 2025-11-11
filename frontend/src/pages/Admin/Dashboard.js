import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import {
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import VibrantPageLayout from '../../components/VibrantPageLayout';
import anime from 'animejs/lib/anime.es.js';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  // Animate dashboard elements after data loads
  useEffect(() => {
    if (!loading && stats) {
      // Animate stat cards with stagger and bounce
      anime({
        targets: '.admin-stat-card',
        scale: [0.5, 1],
        opacity: [0, 1],
        translateY: [60, 0],
        rotate: [10, 0],
        delay: anime.stagger(120),
        duration: 800,
        easing: 'easeOutElastic(1, .7)'
      });

      // Add pulsing glow effect to cards
      anime({
        targets: '.admin-stat-card',
        boxShadow: [
          '0 4px 6px rgba(0,0,0,0.1)',
          '0 20px 40px rgba(59, 130, 246, 0.3)',
          '0 4px 6px rgba(0,0,0,0.1)'
        ],
        duration: 2000,
        delay: anime.stagger(150, {start: 800}),
        easing: 'easeInOutQuad',
        loop: true
      });
    }
  }, [loading, stats]);

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
      title: 'Pending Problems',
      value: stats?.pendingProblems || 0,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500'
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
            <div key={stat.title} className="admin-stat-card bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 overflow-hidden shadow-xl rounded-2xl border-2 border-blue-100 dark:border-blue-900 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105" style={{opacity: 0}}>
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`${stat.color} rounded-xl p-4 shadow-lg transform transition-transform duration-300 hover:rotate-12 hover:scale-110`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-bold text-gray-600 dark:text-gray-300 truncate uppercase tracking-wide">
                        {stat.title}
                      </dt>
                      <dd className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-1">
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

