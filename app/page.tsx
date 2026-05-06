'use client'

import { useEffect, useState, useCallback } from 'react' // 오타 수정 완료
import useSWR, { mutate } from 'swr'
import { Header } from '@/components/header'
import { AnswerBanner } from '@/components/answer-banner'
import { UploadForm } from '@/components/upload-form'
import { PrayerList } from '@/components/prayer-list'
import { PrayerRequest } from '@/components/prayer-card'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface PrayerAnswer {
  id: string
  prayer_request_id: string
  message: string | null
  created_at: string
  prayer_requests?: {
    ocr_text: string
  }
}

export default function HomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1. 카카오톡 외부 브라우저 호출 로직 (컴포넌트 최상단 위치)
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("kakaotalk")) {
      window.location.href = `kakaotalk://web/openExternalApp/?url=${encodeURIComponent(window.location.href)}`;
    }
  }, []);

  // 2. 데이터 페칭 로직
  const { data: prayerRequests, mutate: mutatePrayers, isLoading: isPrayersLoading } = useSWR<PrayerRequest[]>(
    '/api/prayer-requests',
    fetcher,
    { refreshInterval: 10000 }
  )

  const { data: prayerAnswers, mutate: mutateAnswers } = useSWR<PrayerAnswer[]>(
    '/api/prayer-answers',
    fetcher,
    { refreshInterval: 10000 }
  )

  // 3. 핸들러 함수들
  const handleSubmit = useCallback(async (imageUrl: string, text: string, authorId: string) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/prayer-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memo_image_url: imageUrl,
          ocr_text: text,
          author_id: authorId,
        }),
      })

      if (res.ok) {
        await mutatePrayers()
      } else {
        throw new Error('Failed to submit prayer request')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('기도 제목 등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }, [mutatePrayers])

  const handlePrayerCountUpdate = useCallback((id: string, newCount: number) => {
    mutatePrayers(
      (current) =>
        current?.map((prayer) =>
          prayer.id === id ? { ...prayer, prayer_count: newCount } : prayer
        ),
      false
    )
  }, [mutatePrayers])

  const handlePrayerAnswered = useCallback((id: string) => {
    mutatePrayers(
      (current) =>
        current?.map((prayer) =>
          prayer.id === id ? { ...prayer, is_answered: true, answered_at: new Date().toISOString() } : prayer
        ),
      false
    )
    mutateAnswers()
  }, [mutatePrayers, mutateAnswers])

  const totalPrayers = prayerRequests?.length || 0
  const totalPrayerCount = prayerRequests?.reduce((sum, p) => sum + p.prayer_count, 0) || 0

  return (
    <div className="min-h-screen bg-background">
      <Header totalPrayers={totalPrayers} totalPrayerCount={totalPrayerCount} />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {prayerAnswers && prayerAnswers.length > 0 && (
          <section className="mb-8">
            <AnswerBanner answers={prayerAnswers} />
          </section>
        )}

        <section className="mb-10">
          <UploadForm onSubmit={handleSubmit} />
          {isSubmitting && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              기도 제목을 등록하고 있습니다...
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full" />
            기도 제목 목록
          </h2>
          <PrayerList 
            prayers={prayerRequests || []} 
            isLoading={isPrayersLoading}
            onPrayerCountUpdate={handlePrayerCountUpdate}
            onPrayerAnswered={handlePrayerAnswered}
          />
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border mt-12">
        <p>교회 연합 행사를 위한 기도 제목 공유</p>
        <p className="mt-1">함께 기도하며 하나님의 응답을 기대합니다</p>
      </footer>
    </div>
  )
}
