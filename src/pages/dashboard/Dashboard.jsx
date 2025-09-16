import { useState } from "react";
import { 
  RiChat3Line, 
  RiUserLine, 
  RiLogoutBoxRLine, 
  RiDashboardLine,
  RiSettingsLine,
  RiFileList3Line,
  RiTeamLine,
  RiLightbulbLine,
  RiMoonLine,
  RiSunLine 
} from "react-icons/ri";

import DashboardChat from "./components/DashboardChat";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../features/auth/context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("chat");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: "chat", label: "Chat IA", icon: RiChat3Line },
    { id: "profile", label: "Perfil", icon: RiUserLine },
    { id: "projects", label: "Proyectos", icon: RiFileList3Line },
    { id: "team", label: "Equipo", icon: RiTeamLine },
    { id: "settings", label: "Configuración", icon: RiSettingsLine },
  ];

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} ${isDark ? 'bg-gray-800' : 'bg-white'} text-white p-4 transition-all duration-300 shadow-lg flex flex-col`}>
        {/* Logo y toggle */}
        <div className="flex items-center justify-between mb-8">
          {sidebarOpen && (
            <h2 className="text-xl font-bold text-primary flex items-center">
              <RiDashboardLine className="mr-2" />
              ProviAI
            </h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} text-text`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
            </svg>
          </button>
        </div>

        {/* User info */}
        <div className={`flex items-center ${sidebarOpen ? 'mb-6' : 'mb-4 justify-center'}`}>
          <div className={`rounded-full bg-gradient-to-r from-primary to-secondary p-1 ${sidebarOpen ? 'mr-3' : ''}`}>
            <div className="bg-elevated rounded-full p-2">
              <RiUserLine className="h-6 w-6 text-primary" />
            </div>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="font-medium text-text truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-text-muted truncate">{user.email}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'professional' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                {user.role}
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                      activeTab === item.id 
                        ? 'bg-primary text-white shadow-lg' 
                        : `${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''}`} />
                    {sidebarOpen && <span className="text-sm">{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer actions */}
        <div className="mt-auto space-y-2 pt-4 border-t border-gray-700">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center p-3 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            {isDark ? (
              <RiSunLine className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''}`} />
            ) : (
              <RiMoonLine className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''}`} />
            )}
            {sidebarOpen && <span className="text-sm">{isDark ? 'Modo claro' : 'Modo oscuro'}</span>}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className={`w-full flex items-center p-3 rounded-lg transition-colors ${
              isDark ? 'hover:bg-red-900/20 text-red-300' : 'hover:bg-red-100 text-red-600'
            }`}
          >
            <RiLogoutBoxRLine className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''}`} />
            {sidebarOpen && <span className="text-sm">Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 p-6 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header */}
        <header className={`flex items-center justify-between mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div>
            <h1 className="text-2xl font-bold text-text">
              {activeTab === "chat" && "Chat con IA"}
              {activeTab === "profile" && "Perfil de Usuario"}
              {activeTab === "projects" && "Mis Proyectos"}
              {activeTab === "team" && "Gestión de Equipo"}
              {activeTab === "settings" && "Configuración"}
            </h1>
            <p className="text-text-muted text-sm">
              {activeTab === "chat" && "Conversa con nuestra inteligencia artificial para resolver tus dudas"}
              {activeTab === "profile" && "Gestiona tu información personal y preferencias"}
              {activeTab === "projects" && "Revisa y administra todos tus proyectos activos"}
              {activeTab === "team" && "Coordina con tu equipo de trabajo"}
              {activeTab === "settings" && "Personaliza tu experiencia en la plataforma"}
            </p>
          </div>
          
          {/* Quick actions */}
          <div className="flex items-center space-x-3">
            <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} text-text`}>
              <RiLightbulbLine className="h-5 w-5" />
            </button>
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-sm font-bold`}>
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className={`rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm p-6`}>
          {activeTab === "chat" && <DashboardChat />}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-text mb-3">Información personal</h3>
                  <div className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <p><strong className="text-text">Nombre:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong className="text-text">Email:</strong> {user.email}</p>
                    <p><strong className="text-text">Rol:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        user.role === 'professional' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {user.role}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-text mb-3">Estadísticas</h3>
                  <div className={`grid grid-cols-2 gap-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
                      <p className="text-2xl font-bold text-primary">12</p>
                      <p className="text-sm">Proyectos</p>
                    </div>
                    <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
                      <p className="text-2xl font-bold text-secondary">8</p>
                      <p className="text-sm">Mensajes</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`border-t pt-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className="text-lg font-semibold text-text mb-3">Acciones rápidas</h3>
                <div className="flex space-x-3">
                  <button className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} text-text transition-colors`}>
                    Editar perfil
                  </button>
                  <button className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} text-text transition-colors`}>
                    Cambiar contraseña
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Placeholder content for other tabs */}
          {activeTab === "projects" && (
            <div className="text-center py-12">
              <RiFileList3Line className="h-16 w-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text mb-2">Gestión de Proyectos</h3>
              <p className="text-text-muted">Aquí podrás administrar todos tus proyectos con proveedores</p>
            </div>
          )}
          
          {activeTab === "team" && (
            <div className="text-center py-12">
              <RiTeamLine className="h-16 w-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text mb-2">Gestión de Equipo</h3>
              <p className="text-text-muted">Coordina y gestiona a los miembros de tu equipo</p>
            </div>
          )}
          
          {activeTab === "settings" && (
            <div className="text-center py-12">
              <RiSettingsLine className="h-16 w-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text mb-2">Configuración</h3>
              <p className="text-text-muted">Personaliza tu experiencia en la plataforma</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center">
          <p className="text-text-muted text-sm">
            ProviAI Dashboard v1.0 • {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;