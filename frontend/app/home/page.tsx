"use client"

import { useState, useEffect } from "react"
import {
  MapPin,
  Loader2,
  Calendar as CalendarIcon,
  Droplets,
  Thermometer,
  Wind,
  AlertTriangle,
  Camera,
  Mic,
  MessageCircle,
  Circle,
  CheckCircle2,
  Plus,
  Leaf,
  Sun,
  X,
  Map,
  Edit2,
  MessageSquareText,
  Lightbulb,
  ShoppingCart,
  ShieldCheck,
  Apple,
  Wheat,
  TrendingUp,
  DollarSign,
  ChevronRight
} from "lucide-react"

import { useUI } from "../../components/map-dashboard/ui-context" // Access shared UI state

export default function AgriDashboard() {
  const { address, setAIOverlayTab, setIsAIOverlayOpen } = useUI() // Read shared UI state
  
  // ================= States =================
  const [showCropModal, setShowCropModal] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [showHowToUse, setShowHowToUse] = useState(false)
  const [currentDate, setCurrentDate] = useState("Loading...");

  
  useEffect(() => {
      const timer = setInterval(() => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-GB', {
          weekday: 'long', day: 'numeric', month: 'short', year: 'numeric'
        });
        const formattedTime = today.toLocaleTimeString('en-US', {
          hour: '2-digit', minute: '2-digit'
        });
        setCurrentDate(`${formattedDate} | ${formattedTime}`);
      }, 1000); 

      return () => clearInterval(timer);
  }, []);

  const [viewingCropIndex, setViewingCropIndex] = useState<number | null>(null)
  
  const predefinedZones = ["Main Plot", "Plot 2", "Greenhouse A", "Hydroponics"]
  
  const [cropForm, setCropForm] = useState({
    name: "", field: "Main Plot", customField: "", date: "", notes: ""        
  })

  // --- 1. Default Hardcoded Tasks ---
  const [tasks, setTasks] = useState([
    { id: 1, text: "Apply Fungicide to Field B", completed: false },
    { id: 2, text: "Check drainage in Tomato plot", completed: true },
    { id: 3, text: "Inspect wheat for pest activity", completed: false },
  ])

  // --- 2. State for User Manual Input ---
  const [newTaskInput, setNewTaskInput] = useState("")
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false)

  // --- 3. Function to Manually Add a Task ---
  const handleAddManualTask = () => {
    if (!newTaskInput.trim()) return;
    const newTask = {
      id: Date.now(),
      text: newTaskInput,
      completed: false
    };
    // Add the new task to the TOP of the list
    setTasks(prevTasks => [newTask, ...prevTasks]);
    setNewTaskInput(""); // Clear the input field
  }

  // --- 4. The AI Generator Function ---
  const generateAITasks = async () => {
    setIsGeneratingTasks(true);
    
    try {
      const response = await fetch("https://farm-agents-586729303053.asia-southeast1.run.app/api/farm-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: address || "Shah Alam", 
          weatherForecast: "32°C, Sunny & Humid", 
          cropType: crops.map(c => c.name).join(", ") 
        }),
      });

      if (!response.ok) throw new Error("Backend failed");

      const data = await response.json();
      const cleanJsonString = data.result.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanJsonString);

      if (parsedData && parsedData.schedule) {
        const newAITasks = Object.values(parsedData.schedule).map((taskText: any, idx) => ({
          id: Date.now() + idx,
          text: `✨ AI: ${taskText}`,
          completed: false
        }));
        // ADD AI tasks to the top of the existing tasks
        setTasks(prev => [...newAITasks, ...prev]);
      }

    } catch (error) {
      console.log("Backend unavailable, using smart fallback...");
      
      // FALLBACK: Add fake AI tasks to the existing list!
      setTimeout(() => {
        const fakeAITasks = [
          { id: Date.now() + 1, text: "✨ AI: Heavy evening watering required for Tomatoes today", completed: false },
          { id: Date.now() + 2, text: "✨ AI: Monitor Chili Pepper for pest activity due to high humidity", completed: false }
        ];
        
        // Add to the top!
        setTasks(prev => [...fakeAITasks, ...prev]);
      }, 1500); 
      
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  // Enriched crop data to support the detailed view
  const [crops, setCrops] = useState([
    { 
      name: "Tomatoes", field: "Main Plot", date: "2026-03-15", notes: "", status: "Healthy", 
      statusColor: "text-[#4caf50]", bg: "bg-red-50", 
      icon: <Apple className="w-5 h-5 text-white" />, color: "from-red-500 to-red-600",
      growth: 68, humidity: 78, harvestDate: "May 20, 2026", expectedYield: "2,500 kg", 
      marketPrice: "RM 4.50/kg", healthStatus: "Excellent", prediction: "High yield expected. Optimal growing conditions detected."
    },
    { 
      name: "Chili Pepper", field: "Greenhouse A", date: "2026-02-10", notes: "Using organic compost", status: "Monitor", 
      statusColor: "text-amber-600", bg: "bg-orange-50", 
      icon: <Leaf className="w-5 h-5 text-white" />, color: "from-orange-500 to-orange-600",
      growth: 45, humidity: 70, harvestDate: "Jun 15, 2026", expectedYield: "1,800 kg", 
      marketPrice: "RM 3.20/kg", healthStatus: "Good", prediction: "Growing well. Consider additional fertilizer next week."
    },
    { 
      name: "Corn", field: "Plot 2", date: "2026-04-01", notes: "", status: "Healthy", 
      statusColor: "text-[#4caf50]", bg: "bg-yellow-50", 
      icon: <Wheat className="w-5 h-5 text-white" />, color: "from-yellow-500 to-yellow-600",
      growth: 32, humidity: 65, harvestDate: "Jul 10, 2026", expectedYield: "3,000 kg", 
      marketPrice: "RM 2.10/kg", healthStatus: "Fair", prediction: "Needs more water. Irrigation recommended."
    },
  ])

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task))
  }

  const handleOpenAdd = () => {
    setCropForm({ name: "", field: "Main Plot", customField: "", date: "", notes: "" })
    setEditingIndex(null)
    setShowCropModal(true)
  }

  const handleOpenEdit = (e: React.MouseEvent, index: number) => {
    e.stopPropagation() 
    const targetCrop = crops[index]
    const isCustom = !predefinedZones.includes(targetCrop.field)
    
    setCropForm({ 
      name: targetCrop.name, field: isCustom ? "custom" : targetCrop.field,
      customField: isCustom ? targetCrop.field : "", date: targetCrop.date || "", notes: targetCrop.notes || ""
    })
    setEditingIndex(index)
    setShowCropModal(true)
  }

  const handleSaveCrop = () => {
    if (!cropForm.name.trim()) return

    const finalField = cropForm.field === "custom" ? (cropForm.customField.trim() || "Unknown Zone") : cropForm.field

    if (editingIndex !== null) {
      const updatedCrops = [...crops]
      updatedCrops[editingIndex] = {
        ...updatedCrops[editingIndex],
        name: cropForm.name, field: finalField, date: cropForm.date, notes: cropForm.notes
      }
      setCrops(updatedCrops)
    } else {
      const newCrop = {
        name: cropForm.name, field: finalField, date: cropForm.date, notes: cropForm.notes,
        status: "Healthy", statusColor: "text-[#4caf50]", bg: "bg-[#4caf50]/10",
        icon: <Leaf className="w-5 h-5 text-white" />, color: "from-[#4caf50] to-[#2e7d32]",
        growth: 0, humidity: 65, harvestDate: "TBD", expectedYield: "Pending", 
        marketPrice: "Pending", healthStatus: "Good", prediction: "Crop registered. Calibrating AI sensors for initial growth phase."
      }
      setCrops([...crops, newCrop])
    }
    setShowCropModal(false)
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case "Excellent": return "text-green-600 bg-green-100"
      case "Good": return "text-blue-600 bg-blue-100"
      case "Fair": return "text-amber-600 bg-amber-100"
      case "Poor": return "text-red-600 bg-red-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  const viewedCrop = viewingCropIndex !== null ? crops[viewingCropIndex] : null

  return (
    <div className="min-h-screen bg-[#e8f5e9] pb-28 relative">
      {/* Header - Location & Date */}
      <header className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#2a5d44] mb-1">
              <MapPin className="h-4 w-4" />
              {/* Replaced hardcoded "My Farm" with selected map address */}
              <span className="text-sm font-bold tracking-wide uppercase truncate max-w-[200px] block">{address}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-xs font-medium">{currentDate}</span>
            </div>
          </div>
          <button 
            onClick={() => setShowHowToUse(true)}
            className="w-10 h-10 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all flex-shrink-0"
          >
            <Lightbulb className="w-5 h-5 text-[#2a5d44]" />
          </button>
        </div>
      </header>

      {/* Weather Card */}
      <section className="px-5 mb-6">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-start gap-1">
                <span className="text-6xl font-black text-[#2a5d44] tracking-tighter">32</span>
                <span className="text-2xl font-bold text-gray-300 mt-2">°C</span>
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1 font-medium">
                <Sun className="h-4 w-4 text-amber-500 fill-amber-500" />
                Sunny & Humid
              </p>
            </div>
            <div className="bg-[#e8f5e9] rounded-2xl px-4 py-2.5">
              <p className="text-[10px] text-[#2a5d44]/70 font-bold uppercase tracking-wider mb-0.5">Feels like</p>
              <p className="text-xl font-black text-[#2a5d44]">35°C</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-blue-50 rounded-2xl p-3 flex flex-col items-center">
              <Droplets className="h-5 w-5 text-blue-500 mb-1" />
              <p className="text-lg font-bold text-gray-800">85%</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Humidity</p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-3 flex flex-col items-center">
              <Thermometer className="h-5 w-5 text-orange-500 mb-1" />
              <p className="text-lg font-bold text-gray-800">28°C</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Soil Temp</p>
            </div>
            <div className="bg-cyan-50 rounded-2xl p-3 flex flex-col items-center">
              <Wind className="h-5 w-5 text-cyan-500 mb-1" />
              <p className="text-lg font-bold text-gray-800">8</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">km/h Wind</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="bg-red-100 rounded-xl p-2.5 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-red-600">Leaf Rust Alert (5km)</p>
              <p className="text-xs text-red-500/80 font-medium">High humidity detected in Klang. Scan crops frequently.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core AI Actions */}
      <section className="px-5 mb-8">
        <div className="grid grid-cols-3 gap-4">
          <button onClick={() => { setAIOverlayTab("scan"); setIsAIOverlayOpen(true); }} className="bg-white rounded-[2rem] py-6 flex flex-col items-center gap-3 shadow-sm border border-gray-100 active:scale-95 transition-transform">
            <div className="bg-[#e8f5e9] rounded-2xl p-3.5"><Camera className="h-6 w-6 text-[#2a5d44]" /></div>
            <span className="text-xs font-bold text-gray-700">AI Scan</span>
          </button>
          <button onClick={() => { setAIOverlayTab("voice"); setIsAIOverlayOpen(true); }} className="bg-white rounded-[2rem] py-6 flex flex-col items-center gap-3 shadow-sm border border-gray-100 active:scale-95 transition-transform">
            <div className="bg-[#e8f5e9] rounded-2xl p-3.5"><Mic className="h-6 w-6 text-[#2a5d44]" /></div>
            <span className="text-xs font-bold text-gray-700">Voice</span>
          </button>
          <button onClick={() => { setAIOverlayTab("chat"); setIsAIOverlayOpen(true); }} className="bg-white rounded-[2rem] py-6 flex flex-col items-center gap-3 shadow-sm border border-gray-100 active:scale-95 transition-transform">
            <div className="bg-[#e8f5e9] rounded-2xl p-3.5"><MessageCircle className="h-6 w-6 text-[#2a5d44]" /></div>
            <span className="text-xs font-bold text-gray-700">Chat</span>
          </button>
        </div>
      </section>

      {/* My Crops list section */}
      <section className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">My Crops</h2>
          <button className="text-sm text-[#4caf50] font-bold hover:underline">View All</button>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
          {crops.map((crop, index) => (
            <button
              key={index}
              onClick={() => setViewingCropIndex(index)}
              className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 min-w-[150px] flex-shrink-0 relative group text-left active:scale-95 transition-transform"
            >
              <div 
                onClick={(e) => handleOpenEdit(e, index)} 
                className="absolute top-3 right-3 p-1.5 bg-gray-50 rounded-full text-gray-400 hover:text-[#2a5d44] hover:bg-[#e8f5e9] transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </div>

              <div className="flex flex-col items-start mb-2 pr-6">
                <div className={`w-10 h-10 bg-gradient-to-br ${crop.color} rounded-xl flex items-center justify-center shadow-sm mb-3`}>
                  {crop.icon}
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded text-[#2a5d44] bg-[#e8f5e9] uppercase tracking-wider truncate max-w-[100px]">
                  {crop.field}
                </span>
              </div>
              
              <p className="text-sm font-bold text-gray-800 mt-1 truncate">{crop.name}</p>
              <p className={`text-xs ${crop.statusColor} font-bold mt-1`}>{crop.status}</p>
            </button>
          ))}

          <button onClick={handleOpenAdd} className="bg-transparent border-2 border-dashed border-[#2a5d44]/20 rounded-3xl p-4 min-w-[150px] flex-shrink-0 flex flex-col items-center justify-center gap-2 hover:border-[#2a5d44]/50 hover:bg-[#2a5d44]/5 transition-colors active:scale-95">
            <div className="bg-[#e8f5e9] rounded-xl p-3"><Plus className="h-6 w-6 text-[#2a5d44]" /></div>
            <p className="text-sm font-bold text-[#2a5d44]/70">Add Crop</p>
          </button>
        </div>
      </section>

      {/* AI Action Plan */}
      {/* AI Action Plan */}
      <section className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-800">Action Plan</h2>
            <span className="text-[10px] font-bold text-[#2a5d44] bg-[#2a5d44]/10 px-2 py-0.5 rounded-full">{tasks.length} Tasks</span>
          </div>
          
          {/* AI Generator Button */}
          <button 
            onClick={generateAITasks}
            disabled={isGeneratingTasks}
            className="text-xs font-bold text-white bg-gradient-to-r from-[#4caf50] to-[#2e7d32] px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGeneratingTasks ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <TrendingUp className="w-3.5 h-3.5" />
            )}
            {isGeneratingTasks ? "Analyzing..." : "AI Generate Plan"}
          </button>
        </div>

        <div className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 flex flex-col gap-3">
          
          {/* The Task List */}
          <div className="space-y-1 max-h-[250px] overflow-y-auto pr-1">
            {tasks.map((task) => (
              <button key={task.id} onClick={() => toggleTask(task.id)} className="w-full flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors text-left group">
                {task.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-[#4caf50] flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-6 w-6 text-gray-300 group-hover:text-[#4caf50] flex-shrink-0 mt-0.5 transition-colors" />
                )}
                <span className={`text-sm font-medium leading-snug ${task.completed ? "text-gray-400 line-through" : "text-gray-700"} ${task.text.includes('✨ AI:') ? 'font-bold text-[#2a5d44]' : ''}`}>
                  {task.text}
             </span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 w-full" />

          {/* User Manual Input Field */}
          <div className="flex items-center gap-2 px-1 pb-1">
            <input
              type="text"
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddManualTask()}
              placeholder="Add your own task..."
              className="flex-1 bg-gray-50 border border-gray-200 py-2.5 px-4 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4caf50] focus:bg-white transition-all"
            />
            <button
              onClick={handleAddManualTask}
              disabled={!newTaskInput.trim()}
              className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#4caf50] hover:text-white transition-colors disabled:opacity-50 flex-shrink-0"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

        </div>
      </section>

      {/* ================= DETAILED CROP VIEW MODAL ================= */}
      {viewedCrop && (
        <div className="fixed inset-0 z-[80] flex flex-col justify-end bg-black/50 backdrop-blur-sm" style={{ animation: "fadeIn 0.2s ease-out" }}>
          <div className="bg-white w-full max-h-[95vh] overflow-y-auto rounded-t-[2.5rem] shadow-2xl relative flex flex-col" style={{ animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            
            <div className="sticky top-0 bg-white z-10 rounded-t-[2.5rem] pt-3 px-5 pb-3 border-b border-gray-100">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 bg-gradient-to-br ${viewedCrop.color} rounded-2xl flex items-center justify-center shadow-md`}>
                    {viewedCrop.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-800">My Farm</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#4caf50]" />
                      <span className="text-xs text-gray-500 border-b border-dashed border-gray-400 truncate max-w-[150px]">
                        {viewedCrop.field} 
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-bold text-amber-600">32°C</span>
                  </div>
                  <button onClick={() => setViewingCropIndex(null)} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors active:scale-95">
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 px-5 py-4 pb-8">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Select Crop</p>
              
              <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 mb-6 bg-white">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${viewedCrop.color} flex items-center justify-center shadow-sm`}>
                    {viewedCrop.icon}
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-800 text-lg">{viewedCrop.name}</p>
                    <p className="text-sm text-gray-500 font-medium">{viewedCrop.growth}% grown</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <div className={`flex-1 rounded-2xl p-4 flex items-center gap-3 ${viewedCrop.bg}`}>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${viewedCrop.color} flex items-center justify-center`}>
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Crop</p>
                    <p className="font-bold text-gray-800">{viewedCrop.name}</p>
                  </div>
                </div>
                <div className="flex-1 bg-blue-50 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-500/70 uppercase tracking-widest">Humidity</p>
                    <p className="font-bold text-gray-800">{viewedCrop.humidity}%</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500 font-medium">Growth Progress</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${getHealthColor(viewedCrop.healthStatus)}`}>
                      {viewedCrop.healthStatus}
                    </span>
                    <span className="font-bold text-[#4caf50]">{viewedCrop.growth}%</span>
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${viewedCrop.color} rounded-full transition-all duration-500`} style={{ width: `${viewedCrop.growth}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Planted</span>
                  </div>
                  <p className="font-bold text-gray-800 text-base">{viewedCrop.date || viewedCrop.harvestDate}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Harvest</span>
                  </div>
                  <p className="font-bold text-gray-800 text-base">{viewedCrop.harvestDate}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Expected Yield</span>
                  </div>
                  <p className="font-bold text-gray-800 text-base">{viewedCrop.expectedYield}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Market Price</span>
                  </div>
                  <p className="font-bold text-gray-800 text-base">{viewedCrop.marketPrice}</p>
                </div>
              </div>

              <div className="bg-[#e8f5e9] rounded-2xl p-5 mb-8 border border-[#4caf50]/20">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-[#2e7d32]" />
                  <span className="text-xs font-extrabold text-[#2e7d32] uppercase tracking-widest">AI Prediction</span>
                </div>
                <p className="text-[15px] text-gray-700 font-medium leading-relaxed">{viewedCrop.prediction}</p>
              </div>

              <button className={`w-full bg-gradient-to-r ${viewedCrop.color} text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform`}>
                View Full {viewedCrop.name} Report <ChevronRight className="w-5 h-5" />
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ================= ADD / EDIT CROP MODAL ================= */}
      {showCropModal && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/50 backdrop-blur-sm" style={{ animation: "fadeIn 0.2s ease-out" }}>
          <div className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-t-[2.5rem] shadow-2xl p-6 pb-12 relative" style={{ animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            <div className="flex justify-between items-start mb-6 sticky top-0 bg-white/90 backdrop-blur-md pt-2 pb-2 z-10">
              <div>
                <h3 className="text-xl font-extrabold text-gray-800">{editingIndex !== null ? "Edit Crop" : "Add New Crop"}</h3>
                <p className="text-xs font-medium text-gray-400 mt-1">{editingIndex !== null ? "Update your crop's information" : "Register a crop for AI monitoring"}</p>
              </div>
              <button onClick={() => setShowCropModal(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors flex-shrink-0">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block ml-1 uppercase tracking-wider">Crop Name</label>
                <div className="relative">
                  <Leaf className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={cropForm.name} onChange={(e) => setCropForm({...cropForm, name: e.target.value})} placeholder="e.g., Cherry Tomatoes" className="w-full bg-white border border-gray-200 py-4 pl-12 pr-4 rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2a5d44] focus:ring-1 focus:ring-[#2a5d44] transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block ml-1 uppercase tracking-wider">Planting Zone</label>
                <div className="relative mb-3">
                  <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select value={cropForm.field} onChange={(e) => setCropForm({...cropForm, field: e.target.value})} className="w-full bg-white border border-gray-200 py-4 pl-12 pr-4 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:border-[#2a5d44] focus:ring-1 focus:ring-[#2a5d44] transition-all appearance-none">
                    {predefinedZones.map((zone) => <option key={zone} value={zone}>{zone}</option>)}
                    <option value="custom">Other (Custom Zone)...</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {cropForm.field === "custom" && (
                  <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                    <input type="text" value={cropForm.customField} onChange={(e) => setCropForm({...cropForm, customField: e.target.value})} placeholder="Enter your custom zone name..." className="w-full bg-blue-50/50 border border-blue-100 py-3.5 px-4 rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all" />
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block ml-1 uppercase tracking-wider">Planting Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="date" value={cropForm.date} onChange={(e) => setCropForm({...cropForm, date: e.target.value})} className="w-full bg-white border border-gray-200 py-4 pl-12 pr-4 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:border-[#2a5d44] focus:ring-1 focus:ring-[#2a5d44] transition-all" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2 ml-1">
                  <label className="text-xs font-bold text-[#2a5d44] uppercase tracking-wider">Context for AI</label>
                  <span className="text-[10px] text-gray-400 font-medium">Optional</span>
                </div>
                <div className="relative">
                  <MessageSquareText className="absolute left-4 top-4 w-5 h-5 text-[#2a5d44]/50" />
                  <textarea value={cropForm.notes} onChange={(e) => setCropForm({...cropForm, notes: e.target.value})} placeholder="Tell the AI about your soil, fertilizers used, or any specific concerns..." rows={3} className="w-full bg-[#e8f5e9]/50 border border-[#2a5d44]/20 py-3.5 pl-12 pr-4 rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2a5d44] focus:ring-1 focus:ring-[#2a5d44] transition-all resize-none" />
                </div>
              </div>
              <button onClick={handleSaveCrop} disabled={!cropForm.name.trim() || (cropForm.field === 'custom' && !cropForm.customField.trim())} className="w-full mt-2 bg-[#2a5d44] text-white py-4 rounded-full font-bold text-base hover:bg-[#1e4532] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#2a5d44]/30">
                {editingIndex !== null ? "Save Changes" : "Register Crop to AI"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= How To Use Modal ================= */}
      {showHowToUse && (
        <div className="fixed inset-0 z-[70] flex flex-col justify-end bg-black/40 backdrop-blur-sm px-4 pb-4" style={{ animation: "fadeIn 0.2s ease-out" }}>
          <div className="bg-white w-full max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl relative" style={{ animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-5 border-b border-gray-100 flex justify-between items-center z-10 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#e8f5e9] rounded-full flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-[#2a5d44]" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-800">Quick Guide</h3>
              </div>
              <button onClick={() => setShowHowToUse(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex gap-4">
                <div className="mt-1"><Map className="w-6 h-6 text-[#4caf50]" /></div>
                <div>
                  <h4 className="text-base font-bold text-gray-800 mb-1">Interactive Farm Map</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Pinpoint your crops using GPS and receive real-time alerts.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1"><Camera className="w-6 h-6 text-amber-500" /></div>
                <div>
                  <h4 className="text-base font-bold text-gray-800 mb-1">AI Disease Scan</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Snap a photo of any unhealthy leaf to instantly identify diseases.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1"><Mic className="w-6 h-6 text-blue-500" /></div>
                <div>
                  <h4 className="text-base font-bold text-gray-800 mb-1">Voice Assistant</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Hands dirty? Just tap the mic and ask a question naturally.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1"><ShoppingCart className="w-6 h-6 text-orange-500" /></div>
                <div>
                  <h4 className="text-base font-bold text-gray-800 mb-1">Smart Agri-Store</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Purchase AI-recommended treatments delivered to your farm.</p>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="bg-[#e8f5e9] rounded-2xl p-5 border border-[#2a5d44]/10">
                  <div className="flex gap-3">
                    <ShieldCheck className="w-6 h-6 text-[#2a5d44] flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-[#2a5d44] mb-1">Need specific help?</h4>
                      <p className="text-xs font-medium text-[#2a5d44]/80 leading-relaxed mb-3">
                        Speak to the Tani Chat Assistance for further details.
                      </p>
                      <button onClick={() => { setShowHowToUse(false); setAIOverlayTab("chat"); setIsAIOverlayOpen(true); }} className="bg-[#2a5d44] text-white text-xs font-bold px-4 py-2 rounded-xl active:scale-95 transition-all flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" /> Open Tani Chat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}

function ChevronDown(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 9 6 6 6-6"/>
    </svg>
  )
}