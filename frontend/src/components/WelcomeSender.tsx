import React, { FC, useState, FormEvent } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/styles.css'; // Importa los estilos

export const WelcomeSender: FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const isValid = (mail: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid(email)) {
      toast.error('Ingresa un email válido.');
      return;
    }
    
    setLoading(true);

    const subject = '¡Hola!';
    const content = `
      <div style="font-family:sans-serif; text-align:center; padding:1rem;">
        <h1 style="color:#4A90E2;">¡Hola!</h1>
        <p>Gracias por contactarnos. Nos alegra tenerte aquí.</p>
        <p>Estás oficialmente suscrito a nuestras novedades 💌</p>
      </div>
    `;

    try {
      const res = await fetch('/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject, content }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success('Correo de bienvenida enviado.');
        setEmail('');
      } else {
        throw new Error(data.error || 'Error inesperado');
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Falló el envío. Checa la consola.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="welcome-card">
        <div className="card-header">
          <div className="icon-container">
            <svg viewBox="0 0 24 24" className="mail-icon">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
          <h1 className="title">Déjanos tu correo</h1>
          <p className="subtitle">
            Recibe nuestras últimas novedades y actualizaciones
          </p>
        </div>

        <form onSubmit={handleSubmit} className="welcome-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              className="email-input"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`submit-btn ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <div className="loading-content">
                <div className="spinner"></div>
                <span>Enviando...</span>
              </div>
            ) : (
              <span>Enviar bienvenida</span>
            )}
          </button>
        </form>

        <div className="security-note">
          <svg viewBox="0 0 24 24" className="shield-icon">
            <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10.5V11.5C15.4,11.5 16,12.4 16,13V16C16,16.6 15.6,17 15,17H9C8.4,17 8,16.6 8,16V13C8,12.4 8.4,11.5 9,11.5V10.5C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,8.7 10.2,10.5V11.5H13.8V10.5C13.8,8.7 12.8,8.2 12,8.2Z"/>
          </svg>
          <span>Tu email está seguro con nosotros</span>
        </div>
      </div>

      <ToastContainer 
        position="bottom-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};