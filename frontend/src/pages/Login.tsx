import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Role = 'STUDENT' | 'INSTRUCTOR';

const Login = () => {
    const { login, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState<Role>('STUDENT');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        const token = localStorage.getItem('token');
        if (token) navigate(localStorage.getItem('role') === 'INSTRUCTOR' ? '/instructor-dashboard' : '/');
    }, [navigate, authLoading]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await login({ identifier, password });
            const serverRole = localStorage.getItem('role');
            navigate(serverRole === 'INSTRUCTOR' ? '/instructor-dashboard' : '/');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Login failed.');
        } finally { setLoading(false); }
    };

    const isInstructor = role === 'INSTRUCTOR';
    const accentBorder = isInstructor ? 'rgba(99,102,241,.55)' : 'rgba(37,99,235,.55)';
    const submitBg = isInstructor ? 'linear-gradient(135deg,#4f46e5,#6366f1)' : 'linear-gradient(135deg,#1d4ed8,#2563eb)';
    const submitShadow = isInstructor ? '0 4px 20px rgba(99,102,241,.35)' : '0 4px 20px rgba(37,99,235,.35)';

    return (
        <div className="auth-bg">
            <div className="auth-glow-1" />
            <div className="auth-glow-2" />

            <div className="auth-card animate-fade-in">
                {/* Brand */}
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <div className="auth-logo" style={{ marginBottom: '.75rem' }}>
                        <svg width="26" height="26" fill="none" stroke="#60a5fa" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                    </div>
                    <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text)' }}>Welcome back</h1>
                    <p style={{ color: 'var(--text-3)', fontSize: '.875rem', marginTop: '.3rem' }}>Sign in to your account</p>
                </div>

                <div className="auth-glass" style={{ borderColor: accentBorder }}>
                    {/* Role selector */}
                    <p style={{ fontSize: '.7rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.625rem' }}>
                        I am signing in as
                    </p>
                    <div className="auth-role-grid" style={{ marginBottom: '1.25rem' }}>
                        {(['STUDENT', 'INSTRUCTOR'] as Role[]).map(r => {
                            const active = role === r;
                            const cls = active ? (r === 'INSTRUCTOR' ? 'active-indigo' : 'active-blue') : '';
                            return (
                                <button key={r} type="button" className={`auth-role-btn ${cls}`} onClick={() => setRole(r)}>
                                    {active && <span className="auth-role-dot" style={{ background: r === 'INSTRUCTOR' ? '#818cf8' : '#60a5fa' }} />}
                                    {r === 'STUDENT'
                                        ? <svg width="22" height="22" fill="none" stroke={active ? '#60a5fa' : 'var(--text-3)'} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        : <svg width="22" height="22" fill="none" stroke={active ? '#818cf8' : 'var(--text-3)'} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    }
                                    <span style={{ fontSize: '.85rem', fontWeight: 600, color: active ? (r === 'INSTRUCTOR' ? '#a5b4fc' : '#93c5fd') : 'var(--text-2)' }}>
                                        {r === 'STUDENT' ? 'Student' : 'Instructor'}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="auth-divider">
                        <div className="auth-divider-line" />
                        <span className="auth-divider-text">credentials</span>
                        <div className="auth-divider-line" />
                    </div>

                    {error && (
                        <div className="auth-err" style={{ marginBottom: '1rem' }}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '.875rem' }}>
                        <div>
                            <label style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: '.35rem' }}>
                                {isInstructor ? 'Instructor Email' : 'Email or Username'}
                            </label>
                            <div style={{ position: 'relative' }}>
                                <span className="auth-input-icon" style={{ top: '50%', transform: 'translateY(-50%)', position: 'absolute', left: '.875rem' }}>
                                    <svg width="15" height="15" fill="none" stroke="var(--text-3)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </span>
                                <input
                                    type="text" value={identifier} onChange={e => setIdentifier(e.target.value)}
                                    placeholder={isInstructor ? 'instructor@school.com' : 'you@example.com'}
                                    className={`auth-input ${isInstructor ? 'focus-indigo' : ''}`}
                                    style={{ paddingLeft: '2.5rem' }}
                                    required disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.35rem' }}>
                                <label style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--text-2)' }}>Password</label>
                                <button type="button" style={{ fontSize: '.75rem', fontWeight: 600, color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer' }}>Forgot?</button>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '.875rem', top: '50%', transform: 'translateY(-50%)' }}>
                                    <svg width="15" height="15" fill="none" stroke="var(--text-3)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </span>
                                <input
                                    type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`auth-input ${isInstructor ? 'focus-indigo' : ''}`}
                                    style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                                    required disabled={loading}
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)}
                                    style={{ position: 'absolute', right: '.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', padding: 0 }}>
                                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {showPw
                                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.046m4.577-4.577A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21m-4.225-4.225L3 3" />
                                            : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                                        }
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="auth-submit"
                            style={{ background: submitBg, boxShadow: submitShadow, marginTop: '.25rem' }}>
                            {loading
                                ? <><div className="spinner" /> Signing in...</>
                                : <><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg> Sign in as {isInstructor ? 'Instructor' : 'Student'}</>
                            }
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-3)', fontSize: '.875rem' }}>
                            No account?{' '}
                            <Link to="/register" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;