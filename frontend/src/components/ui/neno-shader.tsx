import React from 'react';

export function ShaderAnimation() {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', position: 'relative', opacity: 0.9 }}>

                {/* Bolha Azul */}
                <div style={{
                    position: 'absolute', top: '-10%', left: '20%', width: '60vw', height: '60vw',
                    background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(37,99,235,0) 70%)',
                    borderRadius: '50%', filter: 'blur(60px)',
                    animation: 'float1 8s ease-in-out infinite'
                }} />

                {/* Bolha Roxa */}
                <div style={{
                    position: 'absolute', top: '30%', right: '-10%', width: '50vw', height: '50vw',
                    background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, rgba(124,58,237,0) 70%)',
                    borderRadius: '50%', filter: 'blur(60px)',
                    animation: 'float2 10s ease-in-out infinite alternate'
                }} />

                {/* Bolha Ciano */}
                <div style={{
                    position: 'absolute', bottom: '-20%', left: '10%', width: '55vw', height: '55vw',
                    background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, rgba(6,182,212,0) 70%)',
                    borderRadius: '50%', filter: 'blur(60px)',
                    animation: 'float3 12s ease-in-out infinite alternate-reverse'
                }} />

            </div>

            <style>
                {`
          @keyframes float1 {
            0% { transform: translateY(0) scale(1); }
            50% { transform: translateY(20px) scale(1.05); }
            100% { transform: translateY(0) scale(1); }
          }
          @keyframes float2 {
            0% { transform: translateX(0) scale(1); }
            50% { transform: translateX(-30px) scale(1.1); }
            100% { transform: translateX(0) scale(1); }
          }
          @keyframes float3 {
            0% { transform: translateY(0) translateX(0) scale(1); }
            50% { transform: translateY(-20px) translateX(20px) scale(1.05); }
            100% { transform: translateY(0) translateX(0) scale(1); }
          }
        `}
            </style>
        </div>
    );
}