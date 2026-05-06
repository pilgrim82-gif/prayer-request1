'use client'

import { useEffect } from 'react'

export default function HomePage() {
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("kakaotalk")) {
      window.location.href = `kakaotalk://web/openExternalApp/?url=${encodeURIComponent(window.location.href)}`;
    }
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      fontFamily: 'sans-serif' 
    }}>
      <h1 style={{ color: '#333' }}>기도 제목 사이트</h1>
      <p style={{ color: '#666' }}>시스템을 최적화 중입니다.</p>
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '8px' 
      }}>
        <p>카카오톡 외부 브라우저 전환 테스트 중...</p>
      </div>
    </div>
  )
}
