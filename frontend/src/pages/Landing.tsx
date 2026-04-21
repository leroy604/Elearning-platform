import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
      
      {/* ─── Hero Section ─── */}
      <section style={{ 
        position: 'relative', 
        padding: '6rem 1.25rem 4rem', 
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Animated Background Glows */}
        <div style={{ 
          position: 'absolute', top: '-10%', left: '20%', width: '400px', height: '400px', 
          background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', 
          borderRadius: '50%', filter: 'blur(60px)', zIndex: -1 
        }} />
        <div style={{ 
          position: 'absolute', bottom: '10%', right: '20%', width: '350px', height: '350px', 
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', 
          borderRadius: '50%', filter: 'blur(50px)', zIndex: -1 
        }} />

        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
            fontWeight: 800, 
            lineHeight: 1.1, 
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            background: 'linear-gradient(to bottom, #fff 40%, rgba(255,255,255,0.7) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Master the Future of <br />
            <span style={{ 
              background: 'linear-gradient(90deg, #60a5fa, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Digital Technology</span>
          </h1>
          
          <p style={{ 
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', 
            color: 'var(--text-2)', 
            maxWidth: 650, 
            margin: '0 auto 2.5rem', 
            lineHeight: 1.7 
          }}>
            Join 10,000+ students mastering real-world skills through expert-led courses, 
            interactive lessons, and industry-recognized certifications.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.25rem', fontSize: '1rem', borderRadius: 12 }}>
              Get Started for Free
            </Link>
            <Link to="/login" className="btn btn-ghost" style={{ padding: '1rem 2.25rem', fontSize: '1rem', borderRadius: 12 }}>
              Sign In to Resume
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <section style={{ maxWidth: 1000, margin: '0 auto 5rem', padding: '0 1.25rem' }}>
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {[
            { label: 'Active Courses', value: '10+', sub: 'Comprehensive Library' },
            { label: 'Expert Instructors', value: '5+', sub: 'Industry Professionals' },
            { label: 'Exam success', value: '98%', sub: 'Certification rate' },
            { label: 'Learning hours', value: '120+', sub: 'Pure content' }
          ].map((s, i) => (
            <div key={i} className="stat-card animate-slide-up" style={{ animationDelay: `${i * 0.1}s`, padding: '1.75rem' }}>
              <div className="stat-number" style={{ fontSize: '2.5rem' }}>{s.value}</div>
              <div style={{ color: 'var(--text)', fontWeight: 700, marginTop: '.5rem' }}>{s.label}</div>
              <div className="stat-label" style={{ marginTop: '.25rem', opacity: 0.7 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.25rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-blue" style={{ marginBottom: '1rem', padding: '.4rem 1rem' }}>Key Features</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Everything you need to succeed</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[
            { 
              title: 'Practical Curriculum', 
              desc: 'Learn by doing with projects that replicate real-world scenarios and industry demands.',
              icon: <svg width="24" height="24" fill="none" stroke="#60a5fa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            },
            { 
              title: 'Certification Exams', 
              desc: 'Validate your knowledge with challenging exams designed to test your mastery of the subject.',
              icon: <svg width="24" height="24" fill="none" stroke="#60a5fa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            },
            { 
              title: 'Expert Support', 
              desc: 'Get feedback from top instructors and a community of learners dedicated to your growth.',
              icon: <svg width="24" height="24" fill="none" stroke="#60a5fa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
            }
          ].map((f, i) => (
            <div key={i} className="card-glass" style={{ padding: '2rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', display: 'grid', placeItems: 'center', marginBottom: '1.5rem' }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '.75rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.6, fontSize: '.95rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Footer-like CTA ─── */}
      <section style={{ maxWidth: 900, margin: '6rem auto 2rem', padding: '0 1.25rem' }}>
        <div className="card-glass" style={{ 
          background: 'linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(99,102,241,0.05) 100%)',
          textAlign: 'center',
          padding: '4rem 2rem',
          border: '1px solid rgba(148,163,184,0.15)'
        }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to start your journey?</h2>
          <p style={{ color: 'var(--text-2)', marginBottom: '2rem', fontSize: '1.1rem' }}>
            Get instant access to all courses and certifications. No credit card required to explore.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ padding: '1.1rem 3rem', fontSize: '1.1rem', borderRadius: 12 }}>
            Join LearnHub Now
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Landing;
