import React, { useState } from 'react';
import { ArrowRight, Mail, Zap, CheckCircle } from 'lucide-react';

const CTA = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-32 bg-emerald-400 text-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 5L90 25L90 75L50 95L10 75L10 25Z' fill='none' stroke='%23000000' stroke-width='2'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
        {/* Main CTA */}
        <div className="mb-20">
          <h2 className="text-6xl lg:text-8xl font-black mb-8 leading-tight">
            JOIN THE
            <br />
            <span className="text-black">REVOLUTION</span>
          </h2>
          <p className="text-2xl font-bold mb-12 max-w-3xl mx-auto">
            Be among the first to access H₂OS and shape the future of clean energy infrastructure.
          </p>

          <button className="group px-16 py-6 bg-black text-emerald-400 font-black text-2xl hover:bg-gray-900 transition-all duration-300 flex items-center gap-4 mx-auto mb-8">
            <Zap className="w-8 h-8" />
            <span>GET EARLY ACCESS</span>
            <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform duration-300" />
          </button>

          <div className="text-lg font-bold">
            Limited beta spots available
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-black text-white p-12 max-w-2xl mx-auto">
          <div className="mb-8">
            <h3 className="text-3xl font-black mb-4 text-emerald-400">
              STAY IN THE LOOP
            </h3>
            <p className="text-lg">
              Get exclusive updates on H₂OS development and hydrogen industry insights.
            </p>
          </div>

          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="YOUR EMAIL ADDRESS"
                  className="flex-1 px-6 py-4 bg-gray-900 border-2 border-gray-700 text-white placeholder-gray-400 font-bold focus:outline-none focus:border-emerald-400 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-emerald-400 text-black font-black hover:bg-emerald-300 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>SUBSCRIBE</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-3 py-4 text-emerald-400">
              <CheckCircle className="w-6 h-6" />
              <span className="font-bold text-xl">SUBSCRIBED!</span>
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl font-black mb-2">2024</div>
            <div className="text-lg font-bold">FOUNDED</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black mb-2">BETA</div>
            <div className="text-lg font-bold">IN DEVELOPMENT</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black mb-2">OPEN</div>
            <div className="text-lg font-bold">SOURCE READY</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;