"use client";

import React from 'react';
import { 
  Car, 
  TrendingUp, 
  Users, 
  MapPin, 
  ArrowUpRight, 
  Clock 
} from 'lucide-react';

export default function DashboardPage() {
  // Date simulate pentru interfață
  const stats = [
    { label: "Venit Total", value: "4,250 RON", change: "+12.5%", icon: <TrendingUp className="text-green-500" /> },
    { label: "Curse Finalizate", value: "158", change: "+8.2%", icon: <Car className="text-yellow-500" /> },
    { label: "Clienți Noi", value: "42", change: "+5.1%", icon: <Users className="text-blue-500" /> },
    { label: "Rating Mediu", value: "4.92", change: "Stabil", icon: <MapPin className="text-purple-500" /> },
  ];

  const recentRides = [
    { id: 1, user: "Ion Popescu", route: "Centru -> Aeroport", price: "45 RON", status: "Finalizat" },
    { id: 2, user: "Maria Enache", route: "Mall Vitan -> Unirii", price: "22 RON", status: "În curs" },
    { id: 3, user: "Andrei Radu", route: "Gara de Nord -> Pipera", price: "35 RON", status: "Finalizat" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Secțiune */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panou General</h1>
          <p className="text-gray-500">Monitorizează performanța UCAB în timp real.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all shadow-sm">
            Exportă Raport
          </button>
          <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all shadow-sm">
            Adaugă Cursă Nouă
          </button>
        </div>
      </div>

      {/* Grid de Statistici */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">{stat.icon}</div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.change.includes('+') ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabel Curse Recente */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-800">Activitate Recentă</h2>
            <button className="text-sm text-yellow-600 font-semibold hover:underline">Vezi tot</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-3">Utilizator</th>
                  <th className="px-6 py-3">Traseu</th>
                  <th className="px-6 py-3">Preț</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentRides.map((ride) => (
                  <tr key={ride.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{ride.user}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{ride.route}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{ride.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${ride.status === 'Finalizat' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {ride.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card Suplimentar (Harta sau Alertă) */}
        <div className="bg-black text-white rounded-xl p-6 flex flex-col justify-between shadow-lg">
          <div>
            <div className="bg-yellow-500 p-2 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Clock className="text-black" />
            </div>
            <h2 className="text-xl font-bold mb-2">Ești Online de 4h</h2>
            <p className="text-gray-400 text-sm">Ai parcurs aproximativ 120km astăzi. Nu uita să iei o pauză de 15 minute.</p>
          </div>
          <button className="mt-6 w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors">
            Trece în Mod Offline
          </button>
        </div>
      </div>
    </div>
  );
}
