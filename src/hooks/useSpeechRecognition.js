import { useState, useEffect, useRef } from 'react'

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    setIsSupported(true)

    const recognition = new SpeechRecognition()
    recognition.lang = 'pt-BR'
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onresult = (e) => {
      const result = Array.from(e.results)
        .map(r => r[0].transcript)
        .join('')
      setTranscript(result)
    }

    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)

    recognitionRef.current = recognition
  }, [])

  const startListening = () => {
    if (!recognitionRef.current) return
    setTranscript('')
    setIsListening(true)
    recognitionRef.current.start()
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }

  return { transcript, isListening, isSupported, startListening, stopListening }
}
