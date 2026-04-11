import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const Payment = () => {
    const { enrollmentId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('courseId');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolderName: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Call simulated payment endpoint
            await axiosClient.post('/payments/simulate', {
                enrollmentId: Number(enrollmentId),
                ...formData
            });
            
            alert('✅ Payment Successful! Redirecting to your course.');
            if (courseId) {
                navigate(`/course/${courseId}/dashboard`);
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Payment failed', err);
            alert('❌ Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 flex items-center justify-center">
            <div className="max-w-md w-full animate-fade-in">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600/20 rounded-2xl mb-6 border border-blue-500/30">
                        <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white mb-2">Secure Payment</h1>
                    <p className="text-white/60">Simulated Payment Processing</p>
                </div>

                <div className="card-glass p-8 space-y-6">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-2xl mb-8 relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-10">
                                <div className="w-12 h-10 bg-yellow-400/80 rounded-lg"></div>
                                <svg className="w-12 h-8 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                </svg>
                            </div>
                            <div className="text-2xl font-mono text-white tracking-widest mb-6">
                                {formData.cardNumber || '•••• •••• •••• ••••'}
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-[10px] text-white/60 uppercase tracking-tighter">Card Holder</div>
                                    <div className="text-sm font-semibold text-white uppercase">{formData.cardHolderName || 'YOUR NAME'}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-white/60 uppercase tracking-tighter">Expires</div>
                                    <div className="text-sm font-semibold text-white">{formData.expiryDate || 'MM/YY'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full -ml-12 -mb-12 blur-xl"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-white/70 ml-1">Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                placeholder="1234 5678 9101 1121"
                                className="form-input"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-white/70 ml-1">Expiry Date</label>
                                <input
                                    type="text"
                                    name="expiryDate"
                                    placeholder="MM/YY"
                                    className="form-input"
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-white/70 ml-1">CVV</label>
                                <input
                                    type="text"
                                    name="cvv"
                                    placeholder="•••"
                                    className="form-input"
                                    value={formData.cvv}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-white/70 ml-1">Card Holder Name</label>
                            <input
                                type="text"
                                name="cardHolderName"
                                placeholder="FullName"
                                className="form-input"
                                value={formData.cardHolderName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 mt-4 flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="spinner w-5 h-5"></div>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span>🔒 Pay Now</span>
                                </>
                            )}
                        </button>
                    </form>
                    
                    <p className="text-center text-white/40 text-xs mt-4">
                        Your payment information is simulated and never saved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Payment;
