import { Zap, Target, FileText, Shield, TrendingUp, Clock } from "lucide-react"

const benefits = [
  {
    icon: Zap,
    title: "Instant Analysis",
    description: "Get comprehensive repository insights in seconds, not hours. No setup required."
  },
  {
    icon: Target,
    title: "Precision Accuracy",
    description: "Advanced AI models trained on millions of repositories for reliable analysis."
  },
  {
    icon: FileText,
    title: "Clear Documentation",
    description: "Auto-generated docs that explain architecture, setup, and usage in plain language."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your code never leaves the analysis pipeline. Enterprise-grade security standards."
  },
  {
    icon: TrendingUp,
    title: "Actionable Insights",
    description: "Not just data - practical recommendations for understanding and improvement."
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Analyze repositories anytime. No rate limits, no waiting, instant results."
  }
]

export function Benefits() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-sm text-indigo-400 font-medium">Benefits</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6 text-balance">
            The Key Benefits for
            <br />Your Development
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Discover how RepoRead accelerates your workflow and improves code understanding
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-3xl overflow-hidden">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            
            return (
              <div 
                key={benefit.title}
                className="group relative bg-background p-8 hover:bg-white/[0.02] transition-colors"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-indigo-500/10 transition-colors">
                    <Icon className="w-5 h-5 text-white/60 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-3">{benefit.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
