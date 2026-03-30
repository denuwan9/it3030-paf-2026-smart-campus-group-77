import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Nexar Error Boundary caught an error:', error, errorInfo);
  }

  handleRestart = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-lumina-bg-base text-center">
          <div className="w-24 h-24 bg-lumina-status-error/10 rounded-[2.5rem] flex items-center justify-center mb-8 border border-lumina-status-error/20 shadow-lumina-sm rotate-3 animate-pulse">
            <svg 
              className="w-10 h-10 text-lumina-status-error" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-black text-lumina-text-header mb-4 tracking-tight">System Interruption</h1>
          <p className="text-lumina-text-body mb-10 max-w-md leading-relaxed">
            The Nexar engine encountered an unexpected runtime exception. 
            Your session is safe, but we need to reset the current module to recover stability.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="px-8 py-3 bg-lumina-brand-primary text-white font-bold rounded-2xl shadow-lumina-md hover:translate-y-[-2px] transition-all active:scale-95"
            >
              Attempt Recovery
            </button>
            <button 
              onClick={this.handleRestart}
              className="px-8 py-3 bg-lumina-bg-surface border border-slate-200 text-lumina-text-header font-bold rounded-2xl shadow-lumina-sm hover:bg-slate-50 transition-all active:scale-95"
            >
              Back to Dashboard
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 p-6 bg-lumina-bg-overlay rounded-3xl border border-slate-200 max-w-2xl w-full text-left overflow-auto">
              <p className="text-xs font-mono text-lumina-status-error font-bold mb-2 uppercase tracking-widest">Stack Trace</p>
              <pre className="text-xs font-mono text-lumina-text-body/70 whitespace-pre-wrap">
                {this.state.error?.stack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
