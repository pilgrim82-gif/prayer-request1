'use client'

import { useEffect } from 'react'

export default function HomePage() {
  // 카카오톡 외부 브라우저 호출 로직
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
      fontFamily: 'sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#333' }}>기도 제목 사이트</h1>
      <p style={{ color: '#666' }}>시스템 연결 테스트 중입니다.</p>
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '8px' 
      }}>
        <p>카카오톡 외부 브라우저 전환 기능이 포함되었습니다.</p>
      </div>
    </div>
  )
}
