import { useState, useEffect } from "react";
import { CountdownTimer } from "@/components/countdown-timer";
import { Button } from "@/components/ui/button";
import { AdminLogin } from "@/components/admin-login";

export default function Landing() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showGetLinkButton, setShowGetLinkButton] = useState(false);

  // Extract URL parameter for dynamic redirect
  const getUrlParameter = (name: string): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  };

  // Handle step 1 countdown completion
  const handleStep1Complete = () => {
    setShowNextButton(true);
  };

  // Handle step 2 countdown completion
  const handleStep2Complete = () => {
    setShowGetLinkButton(true);
  };

  // Navigate to step 2
  const goToStep2 = () => {
    setCurrentStep(2);
    setShowNextButton(false);
  };

  // Handle external redirect
  const handleGetLink = () => {
    // First, try to get the most recent link from admin panel
    const savedLinks = localStorage.getItem('admin-links');
    let redirectUrl = 'https://example.com/default'; // Default fallback URL
    
    if (savedLinks) {
      try {
        const links = JSON.parse(savedLinks);
        if (links.length > 0) {
          redirectUrl = links[0].url; // Use the most recent link
        }
      } catch (error) {
        console.error('Error loading admin links:', error);
      }
    }
    
    // If no admin links, fall back to URL parameter logic
    if (redirectUrl === 'https://example.com/default') {
      const refParam = getUrlParameter('ref');
      if (refParam) {
        switch(refParam) {
          case 'instagram':
            redirectUrl = 'https://example.com/instagram-exclusive';
            break;
          case 'story':
            redirectUrl = 'https://example.com/story-access';
            break;
          case 'premium':
            redirectUrl = 'https://example.com/premium-content';
            break;
          default:
            redirectUrl = `https://example.com/ref-${refParam}`;
        }
      }
    }
    
    window.location.href = redirectUrl;
  };

  // Prevent back button to maintain engagement flow
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentStep === 1) {
        const confirmationMessage = 'Are you sure you want to leave? Your exclusive content is almost ready!';
        e.returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-blog-light">
      {/* Header */}
      <header className="border-b border-blog-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-blog-dark">Exclusive Access</h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-blog-muted">Step {currentStep} of 2</div>
              <AdminLogin />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-3xl mx-auto px-4 py-8 lg:py-12">
        
        {/* Step 1: Initial Blog Content */}
        {currentStep === 1 && (
          <article className="animate-fade-in">
            <div className="mb-8">
              {/* Featured Image Banner */}
              <div className="relative overflow-hidden rounded-2xl shadow-xl mb-8">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=600" 
                  alt="Modern workspace with laptop and productivity tools" 
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-blog-dark">
                🚀 The Secret Strategy That Changed Everything
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-blog-muted font-light leading-relaxed mb-8">
                Discover the proven method that helped thousands unlock their potential and achieve remarkable results in just 30 days.
              </p>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  What if I told you that the difference between those who succeed and those who struggle isn't talent, luck, or connections? After analyzing the habits of over 10,000 high achievers, we discovered a pattern that changes everything.
                </p>
                
                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  This isn't another generic productivity hack or motivational fluff. This is a systematic approach that has been quietly used by industry leaders, successful entrepreneurs, and top performers across every field imaginable.
                </p>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 my-8 border border-blue-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">The Hidden Success Pattern</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Through extensive research spanning over 5 years, we've identified the exact methodology that separates achievers from dreamers. It's not about working harder—it's about working with a system that amplifies your natural abilities.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    The most successful people don't just set goals; they follow a specific sequence of actions that creates unstoppable momentum. Today, you're about to discover this sequence.
                  </p>
                </div>

                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  Imagine having a blueprint that removes guesswork, eliminates procrastination, and creates a clear path to your objectives. This method has been tested across industries—from tech startups to Fortune 500 companies, from athletes to artists.
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-8">
                  <div className="bg-white rounded-xl p-6 shadow-md border">
                    <div className="text-3xl mb-3">🚀</div>
                    <h4 className="font-semibold text-lg mb-2">Real Results</h4>
                    <p className="text-gray-600 text-sm">
                      92% of people who implemented this system reported significant progress within 30 days.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-md border">
                    <div className="text-3xl mb-3">⏰</div>
                    <h4 className="font-semibold text-lg mb-2">Time Efficient</h4>
                    <p className="text-gray-600 text-sm">
                      Requires only 15-20 minutes daily to see transformational changes in your life.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-blog-border p-8 text-center mb-8">
              <h3 className="text-xl font-semibold mb-4 text-blog-dark">Please wait while we prepare your exclusive content...</h3>
              
              <CountdownTimer
                duration={5}
                onComplete={handleStep1Complete}
                color="#dc3545"
                label="Securing your access..."
              />
            </div>

            {/* Next Button */}
            <div className="text-center">
              {showNextButton && (
                <Button
                  onClick={goToStep2}
                  className="bg-blog-accent hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 animate-slide-up"
                  size="lg"
                >
                  Continue Reading →
                </Button>
              )}
            </div>
          </article>
        )}

        {/* Step 2: Continuation Content */}
        {currentStep === 2 && (
          <article className="animate-fade-in">
            <div className="mb-8">
              {/* Continuation Headline */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6 text-blog-dark">
                Here's What Makes This Different...
              </h2>

              {/* Content Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="bg-white rounded-xl p-6 shadow-md border border-blog-border h-full">
                    <div className="text-3xl mb-4">⚡</div>
                    <h3 className="text-xl font-semibold mb-3">Immediate Results</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Unlike other methods that take months to show progress, this approach delivers noticeable improvements within the first week of implementation.
                    </p>
                  </div>
                </div>
                <div>
                  <div className="bg-white rounded-xl p-6 shadow-md border border-blog-border h-full">
                    <div className="text-3xl mb-4">🎯</div>
                    <h3 className="text-xl font-semibold mb-3">Proven Framework</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Based on real data from successful individuals across 50+ industries, this isn't theory—it's a battle-tested system.
                    </p>
                  </div>
                </div>
              </div>

              {/* Article Continuation */}
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  The best part? You don't need special skills, expensive tools, or years of experience. This method works regardless of your background, current situation, or previous failures.
                </p>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="text-2xl">💡</div>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-lg font-semibold text-yellow-800 mb-2">Why This Works When Others Fail</h4>
                      <p className="text-yellow-700 leading-relaxed">
                        Unlike traditional approaches that focus on motivation (which fades), this system is built on consistency and small, compound actions. It's designed to work even when you don't feel motivated.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  What makes this different is the implementation strategy. Most people know WHAT to do but struggle with HOW to do it consistently. This guide bridges that gap with a step-by-step framework that removes decision fatigue and creates automatic progress.
                </p>

                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 my-8">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">What You'll Discover Inside:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">1</span>
                      <span className="text-gray-700">The 3-step formula that eliminates overwhelm and creates clear direction</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">2</span>
                      <span className="text-gray-700">How to build unstoppable momentum in just 15 minutes per day</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">3</span>
                      <span className="text-gray-700">The psychology hack that makes success inevitable (not just probable)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">4</span>
                      <span className="text-gray-700">Real case studies from people who transformed their lives using this method</span>
                    </li>
                  </ul>
                </div>
                
                <p className="text-lg leading-relaxed text-gray-700 mb-8">
                  Ready to discover what thousands already know? The complete guide is waiting for you below...
                </p>
              </div>
            </div>

            {/* Second Countdown Section */}
            <div className="bg-gradient-to-r from-blog-accent/10 to-blog-success/10 rounded-2xl p-8 text-center mb-8 border border-blog-accent/20">
              <h3 className="text-xl font-semibold mb-4 text-blog-dark">Preparing your exclusive download link...</h3>
              
              <CountdownTimer
                duration={5}
                onComplete={handleStep2Complete}
                color="#28a745"
                label="Almost ready..."
              />
            </div>

            {/* Get Link Button */}
            <div className="text-center">
              {showGetLinkButton && (
                <Button
                  onClick={handleGetLink}
                  className="bg-blog-success hover:bg-green-600 text-white font-bold py-4 px-12 rounded-xl shadow-xl transform transition-all duration-300 hover:scale-105 animate-pulse-slow"
                  size="lg"
                >
                  🎁 Get Your Exclusive Access Now
                </Button>
              )}
            </div>
          </article>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-blog-border bg-white/50 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-blog-muted text-sm">
            <p>© 2025 Exclusive Access. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
