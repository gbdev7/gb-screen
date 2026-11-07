import React from 'react';

export function ShaderAnimation() {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#070a11'
        }}>
            {/* Contêiner do Shader de Neon estilo Gaming Vibe */}
            <div style={{
                position: 'relative',
                width: '600px',
                height: '600px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.85
            }}>
                {/* Anel Externo Neon */}
                <div style={{
                    position: 'absolute',
                    width: '520px',
                    height: '460px',
                    borderRadius: '42% 58% 70% 30% / 45% 45% 55% 55%',
                    border: '3px solid #60a5fa',
                    boxShadow: '0 0 25px #3b82f6, inset 0 0 25px #3b82f6',
                    animation: 'rotateNeon 12s linear infinite'
                }} />

                {/* Anel Intermediário 1 */}
                <div style={{
                    position: 'absolute',
                    width: '400px',
                    height: '350px',
                    borderRadius: '50% 50% 40% 60% / 55% 45% 55% 45%',
                    border: '3px solid #3b82f6',
                    boxShadow: '0 0 20px #2563eb, inset 0 0 20px #2563eb',
                    animation: 'rotateNeon 9s linear infinite reverse'
                }} />

                {/* Anel Intermediário 2 */}
                <div style={{
                    position: 'absolute',
                    width: '280px',
                    height: '240px',
                    borderRadius: '60% 40% 50% 50% / 40% 60% 40% 60%',
                    border: '3px solid #00d8ff',
                    boxShadow: '0 0 18px #00d8ff, inset 0 0 18px #00d8ff',
                    animation: 'rotateNeon 7s linear infinite'
                }} />

                {/* Centro Brilhante */}
                <div style={{
                    position: 'absolute',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    border: '4px solid #38bdf8',
                    boxShadow: '0 0 35px #0284c7, inset 0 0 20px #38bdf8',
                    animation: 'pulseGlow 3s ease-in-out infinite alternate'
                }} />
            </div>

            <style>{`
        @keyframes rotateNeon {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.03); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes pulseGlow {
          0% { transform: scale(0.95); opacity: 0.7; }
          100% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
        </div>
    );
}