import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const Payment = () => {
    const { enrollmentId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('courseId');
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ cardNumber:'', expiryDate:'', cvv:'', cardHolderName:'' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;
        if (name === 'cardNumber') {
            value = value.replace(/\D/g,'').substring(0,16);
            let fmt = '';
            for (let i=0;i<value.length;i++) { if(i>0&&i%4===0) fmt+=' '; fmt+=value[i]; }
            value = fmt;
        } else if (name === 'cvv') {
            value = value.replace(/\D/g,'').substring(0,3);
        } else if (name === 'expiryDate') {
            value = value.replace(/\D/g,'').substring(0,4);
            if (value.length>=3) value = `${value.substring(0,2)}/${value.substring(2,4)}`;
        }
        setForm({ ...form, [name]: value });
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosClient.post('/payments/simulate', { enrollmentId: Number(enrollmentId), ...form });
            navigate(courseId ? `/course/${courseId}/dashboard` : '/');
        } catch {
            alert('Payment failed. Please try again.');
        } finally { setLoading(false); }
    };

    const displayNumber = form.cardNumber || '•••• •••• •••• ••••';
    const displayName = form.cardHolderName || 'YOUR NAME';
    const displayExpiry = form.expiryDate || 'MM/YY';

    return (
        <div className="payment-wrapper">
            <div className="payment-card animate-fade-in">

                {/* Header */}
                <div style={{ textAlign:'center', marginBottom:'1.75rem' }}>
                    <div style={{ width:48, height:48, borderRadius:12, background:'rgba(37,99,235,.15)', border:'1px solid rgba(37,99,235,.3)', display:'grid', placeItems:'center', margin:'0 auto .875rem' }}>
                        <svg width="22" height="22" fill="none" stroke="#60a5fa" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <h1 style={{ fontSize:'1.5rem', fontWeight:800, color:'var(--text)' }}>Secure Payment</h1>
                    <p style={{ color:'var(--text-3)', fontSize:'.875rem', marginTop:'.25rem' }}>Simulated · No real charges applied</p>
                </div>

                {/* Credit card preview */}
                <div className="credit-card-preview">
                    <div style={{ position:'relative', zIndex:1 }}>
                        {/* Top row */}
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
                            <div style={{ width:42, height:30, background:'rgba(251,191,36,.6)', borderRadius:6, position:'relative' }}>
                                <div style={{ position:'absolute', left:16, top:0, bottom:0, width:14, background:'rgba(251,191,36,.4)', borderRadius:6 }} />
                            </div>
                            <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
                                <circle cx="15" cy="12" r="12" fill="rgba(239,68,68,.7)" />
                                <circle cx="23" cy="12" r="12" fill="rgba(251,191,36,.6)" />
                            </svg>
                        </div>
                        {/* Number */}
                        <div style={{ fontFamily:'monospace', fontSize:'1.2rem', letterSpacing:'.18em', color:'rgba(255,255,255,.92)', marginBottom:'1.25rem' }}>
                            {displayNumber}
                        </div>
                        {/* Bottom row */}
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                            <div>
                                <div style={{ fontSize:'.625rem', color:'rgba(255,255,255,.5)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.2rem' }}>Card Holder</div>
                                <div style={{ fontSize:'.875rem', fontWeight:600, color:'rgba(255,255,255,.9)', textTransform:'uppercase' }}>{displayName}</div>
                            </div>
                            <div style={{ textAlign:'right' }}>
                                <div style={{ fontSize:'.625rem', color:'rgba(255,255,255,.5)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.2rem' }}>Expires</div>
                                <div style={{ fontSize:'.875rem', fontWeight:600, color:'rgba(255,255,255,.9)' }}>{displayExpiry}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>

                    <div>
                        <label style={{ fontSize:'.75rem', fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:'.35rem' }}>Card Number</label>
                        <input type="text" name="cardNumber" placeholder="1234 5678 9101 1121"
                            className="form-input" value={form.cardNumber} onChange={handleChange} required />
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                        <div>
                            <label style={{ fontSize:'.75rem', fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:'.35rem' }}>Expiry Date</label>
                            <input type="text" name="expiryDate" placeholder="MM/YY"
                                className="form-input" value={form.expiryDate} onChange={handleChange} required />
                        </div>
                        <div>
                            <label style={{ fontSize:'.75rem', fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:'.35rem' }}>CVV</label>
                            <input type="text" name="cvv" placeholder="•••"
                                className="form-input" value={form.cvv} onChange={handleChange} required />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize:'.75rem', fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:'.35rem' }}>Card Holder Name</label>
                        <input type="text" name="cardHolderName" placeholder="John Doe"
                            className="form-input" value={form.cardHolderName} onChange={handleChange} required />
                    </div>

                    {/* Security notice */}
                    <div style={{ display:'flex', alignItems:'center', gap:'.5rem', padding:'.75rem 1rem', background:'rgba(5,150,105,.08)', border:'1px solid rgba(5,150,105,.2)', borderRadius:8 }}>
                        <svg width="14" height="14" fill="none" stroke="#34d399" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span style={{ fontSize:'.8rem', color:'#34d399' }}>Simulated payment — your data is never stored</span>
                    </div>

                    <button type="submit" disabled={loading}
                        style={{ width:'100%', padding:'.875rem', borderRadius:10, border:'none', cursor:'pointer', background:'linear-gradient(135deg,#1d4ed8,#2563eb)', color:'#fff', fontWeight:700, fontSize:'.95rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem', boxShadow:'0 4px 20px rgba(37,99,235,.4)', opacity: loading ? .6 : 1 }}>
                        {loading
                            ? <><div className="spinner" /> Processing...</>
                            : <>
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Pay Now — Complete Enrollment
                            </>
                        }
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Payment;
