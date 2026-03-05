import { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { MessageCircle, Send, X, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../context/AppContext";

function Chatbot() {
  const { backendUrl } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      user: null,
      bot: "Hi! I'm your Campus Connect assistant. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = message;
    setMessage("");
    setChat((prev) => [...prev, { user: userMsg, bot: null }]);
    setIsLoading(true);

    try {
      // Pass history to the backend for context
      const res = await axios.post(`${backendUrl || ""}/chatbot/chat`, {
        message: userMsg,
        history: chat.slice(-10) // Only send last 10 messages to keep context concise
      });

      setChat((prev) => {
        const newChat = [...prev];
        newChat[newChat.length - 1].bot = res.data.reply;
        return newChat;
      });
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { bot: "Sorry, I'm having trouble connecting right now." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="rounded-2xl shadow-2xl w-80 sm:w-96 h-[520px] flex flex-col mb-4 overflow-hidden bg-white/80 backdrop-blur-xl border border-white/30 ring-1 ring-black/5"
          >
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <img src="/chatbbot_icon.webp" alt="Chatbot" className="w-7 h-7 object-contain" />
                <div>
                  <h3 className="font-semibold">Campus Assistant</h3>
                  <p className="text-xs text-blue-100 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                    Always online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white/60 to-white/30">
              {chat.map((c, i) => (
                <div key={i} className="space-y-4">
                  {c.user && (
                    <div className="flex justify-end">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-[80%] text-sm shadow-md">
                        {c.user}
                      </div>
                    </div>
                  )}
                  {c.bot && (
                    <div className="flex justify-start items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/70 border border-white/40 shadow-sm flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="bg-white/90 text-gray-800 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%] text-sm shadow-sm border border-gray-200 whitespace-pre-wrap backdrop-blur">
                        {c.bot}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/70 border border-white/40 shadow-sm flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="bg-white/90 text-gray-800 rounded-2xl rounded-tl-none px-4 py-2 shadow-sm border border-gray-200 backdrop-blur">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-3 bg-white/70 backdrop-blur border-t border-white/40">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask something..."
                  className="flex-1 bg-gray-100/80 border-none rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !message.trim()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-full hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-0 bg-transparent rounded-none shadow-none transition-all hover:scale-110 active:scale-95"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <motion.img
            src="/chatbbot_icon.webp"
            alt="Chatbot"
            className="w-24 h-24 object-contain filter brightness-100 contrast-115 saturate-110 drop-shadow"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </button>
    </div>
  );
}

export default Chatbot;
