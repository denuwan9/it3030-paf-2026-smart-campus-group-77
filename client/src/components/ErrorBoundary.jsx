import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("🪲 [ErrorBoundary] caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-8 font-sans">
          <div className="max-w-2xl w-full bg-white rounded-[40px] shadow-2xl border border-red-100 p-10">
            <div className="w-16 h-16 bg-red-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-red-200">
               <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
               </svg>
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-4">Something went wrong.</h1>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
              The application encountered an unexpected error. Please try refreshing the page or contact support if the issue persists.
            </p>
            
            <div className="bg-gray-900 rounded-2xl p-6 overflow-auto max-h-64 mb-8">
               <code className="text-red-400 text-xs font-mono block mb-2">
                 {this.state.error && this.state.error.toString()}
               </code>
               <pre className="text-gray-400 text-[10px] leading-tight">
                 {this.state.errorInfo && this.state.errorInfo.componentStack}
               </pre>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-indigo-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
