import { useState, useEffect, useRef } from "react";
import { 
  RiSendPlaneFill, 
  RiMapPinLine, 
  RiBriefcaseLine, 
  RiListCheck, 
  RiShoppingCartLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiUserLocationLine
} from "react-icons/ri";

import { fetchProfessions, fetchCategories, fetchProducts } from "../../../api/professionsApi";
import { useAuth } from "../../../features/auth/context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";

const exampleCities = ["Ciudad de México", "Guadalajara", "Monterrey", "Cancún", "Tijuana"];

const DashboardChat = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    { 
      from: "system", 
      text: `¡Hola ${user.firstName}! Soy tu asistente de IA para encontrar proveedores. 😊`,
      timestamp: new Date()
    },
  ]);

  const [step, setStep] = useState(0);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    city: "",
    professionId: "",
    category: "",
    product: "",
  });

  const [options, setOptions] = useState([]);
  const [page, setPage] = useState(1);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, options]);

  // Detectar ciudad
  useEffect(() => {
    if (!form.city && navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`https://geocode.xyz/${latitude},${longitude}?geoit=json`);
            const data = await res.json();
            const detectedCity = data.city || data.region || "";
            const closestCity = exampleCities.find(
              c => detectedCity.toLowerCase().includes(c.toLowerCase())
            ) || detectedCity;

            setForm(prev => ({ ...prev, city: closestCity }));
            addSystemMessage(`📍 Detectamos que estás en ${closestCity}. ¿Es correcto?`);
            setOptions(exampleCities.map(c => ({ name: c, icon: RiMapPinLine })));
          } catch {
            addSystemMessage("❌ No pudimos detectar tu ciudad. Elige una de las ciudades sugeridas:");
            setOptions(exampleCities.map(c => ({ name: c, icon: RiMapPinLine })));
          } finally {
            setIsLoading(false);
          }
        },
        () => {
          addSystemMessage("📍 No se pudo acceder a tu ubicación. Elige tu ciudad:");
          setOptions(exampleCities.map(c => ({ name: c, icon: RiMapPinLine })));
          setIsLoading(false);
        }
      );
    }
  }, [form.city]);

  const addSystemMessage = (text) => {
    setMessages(prev => [...prev, { from: "system", text, timestamp: new Date() }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { from: "user", text, timestamp: new Date() }]);
  };

  // Manejo de botones o input
  const handleSelect = async (text, id = null, icon = null) => {
    addUserMessage(text);
    setIsLoading(true);

    try {
      switch(step){
        case 0: // Ciudad
          setForm(prev => ({ ...prev, city: text }));
          addSystemMessage("💼 Selecciona tu profesión o escríbela si no está:");
          const profs = await fetchProfessions();
          setOptions(profs.map(p => ({ name: p.name, id: p._id, icon: RiBriefcaseLine })));
          setStep(1);
          break;

        case 1: // Profesión
          setForm(prev => ({ ...prev, professionId: id }));
          addSystemMessage("📋 Selecciona la categoría:");
          const cats = await fetchCategories(id);
          setOptions(cats.map(c => ({ name: c, id: c, icon: RiListCheck })));
          setStep(2);
          break;

        case 2: // Categoría
          setForm(prev => ({ ...prev, category: text }));
          addSystemMessage("🛍️ Selecciona un producto:");
          const products = await fetchProducts(text, form.city);
          setOptions(products.map(p => ({ 
            name: p.name, 
            id: p._id, 
            provider: p.providerId,
            icon: RiShoppingCartLine
          })));
          setStep(3);
          break;

        case 3: // Producto
          const selected = options.find(o => o.name === text);
          if(selected){
            const { provider } = selected;
            addSystemMessage(
              `✅ **Producto seleccionado:** ${text}\n\n` +
              `👤 **Proveedor:** ${provider.name}\n` +
              `📍 **Ciudad:** ${provider.city}\n` +
              `📞 **Teléfono:** ${provider.phone}\n` +
              `⭐ **Calificación:** ${provider.rating || '4.5'}/5\n\n` +
              `¿Te gustaría contactar a este proveedor?`
            );
            setOptions([
              { name: "Sí, contactar", icon: RiCheckboxCircleLine },
              { name: "Ver más opciones", icon: RiListCheck }
            ]);
            setStep(4);
          }
          break;

        case 4: // Confirmación
          if (text === "Sí, contactar") {
            addSystemMessage("📞 Te hemos conectado con el proveedor. ¡Pronto se pondrán en contacto contigo!");
            setOptions([]);
          } else {
            addSystemMessage("🔍 Buscando más opciones...");
            // Lógica para buscar más opciones
            setStep(3);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      addSystemMessage("❌ Ocurrió un error. Por favor, intenta de nuevo.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (inputText.trim()) {
      handleSelect(inputText);
      setInputText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatMessage = (text) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line.includes('**') ? (
          <>
            {line.split('**').map((part, j) => 
              j % 2 === 1 ? (
                <strong key={j} className="text-primary">{part}</strong>
              ) : (
                part
              )
            )}
          </>
        ) : (
          line
        )}
        <br />
      </span>
    ));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className="text-xl font-bold text-text flex items-center">
          <RiUserLocationLine className="mr-2 text-primary" />
          Asistente de Proveedores IA
        </h2>
        <p className="text-sm text-text-muted">
          Te ayudo a encontrar los mejores proveedores en tu área
        </p>
      </div>

      {/* Chat Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-4 shadow-sm ${
                msg.from === "system"
                  ? isDark
                    ? "bg-gray-800 text-gray-100"
                    : "bg-white text-gray-800 border border-gray-200"
                  : isDark
                  ? "bg-primary text-white"
                  : "bg-primary text-white"
              }`}
            >
              <div className="text-sm">{formatMessage(msg.text)}</div>
              <div
                className={`text-xs mt-2 ${
                  msg.from === "system"
                    ? isDark
                      ? "text-gray-400"
                      : "text-gray-500"
                    : "text-blue-100"
                }`}
              >
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div
              className={`max-w-xs rounded-2xl p-4 shadow-sm ${
                isDark ? "bg-gray-800" : "bg-white border border-gray-200"
              }`}
            >
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Options Buttons */}
        {step < 5 && options.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {options.map((o, i) => {
              const Icon = o.icon;
              return (
                <button
                  key={i}
                  className={`flex items-center px-4 py-2 rounded-full transition-all duration-200 ${
                    isDark
                      ? "bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-700"
                      : "bg-white text-gray-800 hover:bg-gray-100 border border-gray-200"
                  } shadow-sm hover:shadow-md`}
                  onClick={() => handleSelect(o.name, o.id, o.icon)}
                >
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {o.name}
                </button>
              );
            })}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {step < 5 && (
        <div className={`p-4 border-t ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu respuesta..."
              className={`flex-1 p-3 rounded-2xl border transition-colors ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                  : "bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
              }`}
              disabled={isLoading}
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading || !inputText.trim()}
              className={`p-3 rounded-2xl transition-all duration-200 ${
                isLoading || !inputText.trim()
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-hover transform hover:-translate-y-0.5"
              } shadow-sm hover:shadow-md`}
            >
              <RiSendPlaneFill className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs text-text-muted mt-2 text-center">
            Presiona Enter para enviar
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardChat;