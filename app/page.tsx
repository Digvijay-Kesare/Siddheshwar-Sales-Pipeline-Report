import Link from "next/link";
import {
  ArrowRight,
  Droplet,
  Calculator,
  FileCheck,
  Zap,
  CheckCircle,
  Layers,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50 text-gray-900 flex flex-col justify-between">
      {/* Top Navbar */}
      <nav className="max-w-6xl w-full mx-auto px-6 py-5 flex items-center justify-between border-b border-green-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-green-600 text-white rounded-xl shadow-sm">
            <Droplet size={20} />
          </div>
          <div>
            <span className="font-extrabold text-lg md:text-xl text-gray-900 tracking-tight">
              AgriPipeline
            </span>
            <span className="text-xs text-green-700 font-bold ml-1.5 px-2 py-0.5 bg-green-100 rounded-full">
              Survey Pro
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs md:text-sm font-semibold text-gray-700 hover:text-green-700 px-3 py-2 transition"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="text-xs md:text-sm font-semibold text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg shadow-sm transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20 text-center flex-1 flex flex-col items-center justify-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-100 border border-green-200 text-green-800 text-xs md:text-sm font-semibold mb-6 shadow-xs">
          <Zap size={14} className="text-green-600" />
          <span>Agricultural Pipeline & Pump Head Engineering Sizing</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight max-w-4xl leading-tight">
          Agriculture Pipeline <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-600">
            Survey Report System
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Design, analyze, and document agricultural irrigation pipelines with precision.
          Calculate component friction losses, static elevation head, and total pump head
          requirements in minutes.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-8 py-3.5 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            Open Dashboard
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3.5 rounded-xl text-base font-semibold shadow-xs transition"
          >
            Sign In / Register
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full text-left">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="p-3 bg-green-100 text-green-700 rounded-xl w-fit mb-4">
              <Calculator size={22} />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">
              Automated Friction Loss
            </h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              Preset hydraulic loss factors for PVC, HDPE, GI Bends, NRVs, and Foot Valves
              computed per meter and unit.
            </p>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-xl w-fit mb-4">
              <Layers size={22} />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">
              Total Pump Head Sizing
            </h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              Sum static elevation differences with dynamic friction losses to size the
              correct horsepower pump for farm irrigation.
            </p>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="p-3 bg-purple-100 text-purple-700 rounded-xl w-fit mb-4">
              <FileCheck size={22} />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">
              Instant PDF Generation
            </h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              Export clean, certified pipeline survey reports for clients, field technicians,
              and irrigation contractors with one click.
            </p>
          </div>
        </div>

        {/* Highlights List */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs md:text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <CheckCircle size={16} className="text-green-600" />
            <span>Cloud Sync via Supabase</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle size={16} className="text-green-600" />
            <span>Mobile-friendly Field Interface</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle size={16} className="text-green-600" />
            <span>Real-time PDF Export & Share</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-500 bg-white">
        <p>
          Agri Pipeline Survey & Sales Pipeline Report System • Designed for Agriculture Engineering & Irrigation Works
        </p>
      </footer>
    </div>
  );
}
