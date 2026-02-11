'use client';
import Image from 'next/image';
import { LuArrowUpRight, LuShieldCheck, LuUsers, LuZap } from 'react-icons/lu';
import { Navbar } from '@/components/Navbar';

export default function Home() {
  return (
    <main className="bg-[#fcfcfc] text-[#222222] min-h-screen font-sans selection:bg-[#FF8D1D]/30">
      <Navbar />
      
      <section className="relative pt-32 pb-20 md:pt-52 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10 opacity-50"></div>

        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF8D1D] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF8D1D]"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Secure Blockchain Voting</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[1.1] mb-8">
              Every Vote <span className="text-[#FF8D1D]">Counts</span>,<br />
              Every Voice Matters
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience the next generation of democratic participation. Transparent, immutable, and secured by decentralized technology.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <a href="/login/voter" className="group w-full md:w-auto bg-black text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all">
                Start Voting <LuArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              <a href="/login/company" className="w-full md:w-auto bg-white border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:border-[#FF8D1D] transition-all">
                For Organizations
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-2 gap-4 relative">
              <div className="absolute -inset-4 bg-[#FF8D1D]/5 rounded-[40px] -z-10 rotate-3"></div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`aspect-square rounded-3xl bg-gray-100 overflow-hidden border-4 border-white shadow-xl group ${i % 2 === 0 ? 'mt-8' : ''}`}>
                   <img 
                    src={`/img/profile${i}.png`} 
                    alt="Candidate" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100"
                   />
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="w-12 h-12 bg-[#FF8D1D]/10 rounded-2xl flex items-center justify-center text-[#FF8D1D]">
                <LuUsers size={28} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Manage Candidates with Precision</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our intuitive dashboard allows organizations to verify candidates, set up profiles, and manage election cycles with zero technical friction. 
              </p>
              <ul className="space-y-3">
                {['Direct profile management', 'Blockchain verification', 'Real-time analytics'].map((item) => (
                  <li key={item} className="flex items-center gap-3 font-medium text-gray-700">
                    <LuShieldCheck className="text-[#FF8D1D]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-[1200px]">
           <div className="flex flex-col-reverse md:flex-row gap-16 items-center">
             <div className="md:w-1/2 space-y-6">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
                  <LuZap size={28} />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Instant Voter Registration</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Onboarding has never been easier. Voters can register using secure identity protocols, ensuring one-person-one-vote without compromising privacy.
                </p>
                <button className="text-black font-bold flex items-center gap-2 hover:gap-4 transition-all">
                  Learn more about security <LuArrowUpRight />
                </button>
             </div>
             <div className="md:w-1/2">
                <div className="relative p-8">
                  <div className="absolute inset-0 bg-[#FF8D1D] rounded-[2rem] rotate-6 opacity-10"></div>
                  <img src="/img/voter.png" alt="Registration UI" className="relative rounded-2xl shadow-2xl hover:-translate-y-2 transition-transform duration-500" />
                </div>
             </div>
           </div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-gray-400 text-sm">© 2026 RayaVote. Built on Secure Decentralized Ledger.</p>
      </footer>
    </main>
  );
}