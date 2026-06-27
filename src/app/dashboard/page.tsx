import Link from 'next/link';
import { LayoutTemplate, Layers, Hammer } from 'lucide-react';

export default function DashboardPage() {
  return (
    <>
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard Overview</h1>
        </div>
      </div>

      {/* Administration Info Panel */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-[#121614] to-[#1e1c18] border border-[#2d3a31]/60 backdrop-blur-md relative overflow-hidden mb-12">
        <div className="absolute right-[-5%] bottom-[-5%] w-[30%] h-[50%] bg-[#3b8450]/5 rounded-full blur-3xl pointer-events-none" />
        <h2 className="text-xl font-bold mb-2">Welcome Back, Administrator</h2>
        <p className="text-[#8ba393] text-sm max-w-2xl mb-6">
          You are successfully signed in as an administrator. From this workspace, you can manage landing page copy, list dynamic wood species, and control workshop services.
        </p>

        <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#8ba393]">
          <div className="px-4 py-2.5 rounded-xl bg-[#1a201c] border border-[#2d3a31]/60">
            Role: <span className="text-[#e3c79a]">ADMIN</span>
          </div>
        </div>
      </div>

      {/* Management Modules */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Management Modules</h2>
        <p className="text-xs text-[#8ba393] mt-1">Quick access to customize landing page copy, wood catalog, and workshop services.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Card 1: Homepage CMS */}
        <div className="p-6 rounded-3xl bg-[#121614]/80 border border-[#2d3a31]/60 backdrop-blur-md hover:border-[#3b8450]/40 transition duration-300 group flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#8ba393] text-xs font-bold uppercase tracking-wider">CMS Settings</span>
              <div className="p-2.5 rounded-xl bg-[#202722] text-[#3b8450] group-hover:bg-[#3b8450] group-hover:text-white transition duration-300">
                <LayoutTemplate className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Homepage CMS</h3>
            <p className="text-xs text-[#8ba393] leading-relaxed">
              Edit hero subtitle copy, advantages list, about description, and the work showcase carousel images.
            </p>
          </div>
          <div className="mt-6">
            <Link
              href="/dashboard/cms"
              className="inline-block text-xs font-semibold px-4 py-2.5 rounded-xl border border-border text-[#8ba393] hover:text-white hover:bg-input transition w-full text-center"

            >
              Open CMS Editor
            </Link>
          </div>
        </div>

        {/* Card 2: Wood Products Catalog */}
        <div className="p-6 rounded-3xl bg-[#121614]/80 border border-[#2d3a31]/60 backdrop-blur-md hover:border-[#3b8450]/40 transition duration-300 group flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#8ba393] text-xs font-bold uppercase tracking-wider">Inventory</span>
              <div className="p-2.5 rounded-xl bg-[#202722] text-[#3b8450] group-hover:bg-[#3b8450] group-hover:text-white transition duration-300">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Wood Products</h3>
            <p className="text-xs text-[#8ba393] leading-relaxed">
              Manage custom wood species, grain sample images, and timber attributes displayed on landing pages.
            </p>
          </div>
          <div className="mt-6">
            <Link
              href="/dashboard/wood-types"
              className="inline-block text-xs font-semibold px-4 py-2.5 rounded-xl border border-border text-[#8ba393] hover:text-white hover:bg-input transition w-full text-center"
            >
              Manage Wood Products
            </Link>
          </div>
        </div>

        {/* Card 3: Workshop Services */}
        <div className="p-6 rounded-3xl bg-[#121614]/80 border border-[#2d3a31]/60 backdrop-blur-md hover:border-[#3b8450]/40 transition duration-300 group flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#8ba393] text-xs font-bold uppercase tracking-wider">Services</span>
              <div className="p-2.5 rounded-xl bg-[#202722] text-[#3b8450] group-hover:bg-[#3b8450] group-hover:text-white transition duration-300">
                <Hammer className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Services Catalog</h3>
            <p className="text-xs text-[#8ba393] leading-relaxed">
              Manage carpentry categories, dimension rules, cubic meter volume pricing, and standard pricing matrices.
            </p>
          </div>
          <div className="mt-6">
            <Link
              href="/dashboard/services"
              className="inline-block text-xs font-semibold px-4 py-2.5 rounded-xl border border-border text-[#8ba393] hover:text-white hover:bg-input transition w-full text-center"
            >
              Manage Services & Prices
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
