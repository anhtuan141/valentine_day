import { useState, useEffect, useRef } from 'react'
import './App.css'

// Base URL for assets (works with gh-pages)
const BASE_URL = import.meta.env.BASE_URL

// YouTube Video ID
const YOUTUBE_VIDEO_ID = 'IobNcpiwpSc'

// Component Falling Heart
const FallingHeart = ({ style, delay }) => (
  <div
    className="falling-heart"
    style={{
      ...style,
      animationDelay: `${delay}s`,
    }}
  >
    ❤️
  </div>
)

// Component Falling Image
const FallingImage = ({ style, delay, src }) => (
  <img
    className="falling-image"
    src={src}
    alt="falling"
    style={{
      ...style,
      animationDelay: `${delay}s`,
    }}
  />
)

// Component Sparkle
const Sparkle = ({ style, delay }) => (
  <div
    className="sparkle"
    style={{
      ...style,
      animationDelay: `${delay}s`,
    }}
  >
    ✨
  </div>
)

// Second Page Component - Romantic Page
const SecondPage = ({ onBack, isPlaying, toggleMusic, playerReady }) => {
  const [showContent, setShowContent] = useState(false)
  const [heartBurst, setHeartBurst] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const handleHeartBurst = () => {
    const newHearts = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }))
    setHeartBurst(newHearts)
    setTimeout(() => setHeartBurst([]), 1500)
  }

  return (
    <div className="second-page">
      <div className="second-gradient"></div>

      {/* Heart burst effect */}
      {heartBurst.map((heart) => (
        <div
          key={heart.id}
          className="burst-heart"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
          }}
        >
          💕
        </div>
      ))}

      {/* Music Control on Second Page */}
      <button className="music-btn" onClick={toggleMusic} title={playerReady ? 'Bật/Tắt nhạc' : 'Đang tải...'}>
        {isPlaying ? '🔊' : '🔇'}
      </button>

      <div className={`second-content ${showContent ? 'show' : ''}`}>
        <div className="big-heart" onClick={handleHeartBurst}>
          💖
        </div>

        <h1 className="second-title">
          <span>Anh Yêu Em!</span>
        </h1>

        <div className="love-message">
          <p>
            "Em là lý do anh cười mỗi ngày,<br/>
            là người khiến trái tim anh đập nhanh hơn.<br/>
            Cảm ơn em đã đến bên anh! 💕"
          </p>
        </div>

        <div className="heart-row">
          <span>💗</span>
          <span>💖</span>
          <span>💝</span>
          <span>💘</span>
          <span>💕</span>
        </div>

        <div className="photo-collage">
          <img src={`${BASE_URL}images/img_3.png`} alt="Love 1" className="photo photo-1" />
          <img src={`${BASE_URL}images/img_4.png`} alt="Love 2" className="photo photo-2" />
          <img src={`${BASE_URL}images/img_2.png`} alt="Love 3" className="photo photo-3" />
        </div>

        <p className="forever-text">Forever & Always ❤️</p>

        <button className="back-btn" onClick={onBack}>
          Quay lại 💕
        </button>
      </div>
    </div>
  )
}

function App() {
  const [showContent, setShowContent] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hearts, setHearts] = useState([])
  const [sparkles, setSparkles] = useState([])
  const [playerReady, setPlayerReady] = useState(false)
  const playerRef = useRef(null)

  // Button running state
  const [buttonState, setButtonState] = useState('initial') // 'initial' | 'running' | 'tired'
  const [buttonPosition, setButtonPosition] = useState({ x: 50, y: 0 })
  const [showSecondPage, setShowSecondPage] = useState(false)

  // Load YouTube IFrame API
  useEffect(() => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
        },
        events: {
          onReady: () => setPlayerReady(true),
        },
      })
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [])

  // Generate random hearts and falling images
  useEffect(() => {
    const newHearts = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 0.5 + Math.random() * 1.5,
    }))
    setHearts(newHearts)

    const newFallingImages = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 5 + Math.random() * 5,
      size: 40 + Math.random() * 40,
    }))

    const newSparkles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
    }))
    setSparkles(newSparkles)
  }, [])

  // Show content with delay
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // Button running animation
  useEffect(() => {
    if (buttonState === 'running') {
      const startTime = Date.now()
      const duration = 5000

      const animate = () => {
        const elapsed = Date.now() - startTime
        if (elapsed >= duration) {
          setButtonState('tired')
          return
        }

        // Random position within bounds
        const newX = 20 + Math.random() * 60
        const newY = Math.random() * 30

        setButtonPosition({ x: newX, y: newY })

        // Random interval between moves
        const nextMove = 200 + Math.random() * 400
        setTimeout(animate, nextMove)
      }

      animate()
    }
  }, [buttonState])

  const toggleMusic = () => {
    if (!playerReady || !playerRef.current) {
      alert('🎵 Đang tải nhạc, vui lòng đợi một chút...')
      return
    }

    if (isPlaying) {
      playerRef.current.pauseVideo()
      setIsPlaying(false)
    } else {
      playerRef.current.playVideo()
      setIsPlaying(true)
    }
  }

  const handleLoveClick = () => {
    if (buttonState === 'initial') {
      setButtonState('running')
    } else if (buttonState === 'tired') {
      setShowSecondPage(true)
    }
  }

  const handleBackToFirst = () => {
    setShowSecondPage(false)
    setButtonState('initial')
    setButtonPosition({ x: 50, y: 0 })
  }

  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💕</text></svg>'
  }

  return (
    <>
      {/* Hidden YouTube Player - Always rendered to keep music playing */}
      <div id="youtube-player" className="youtube-player-hidden"></div>

      {/* Second Page Overlay */}
      {showSecondPage && (
        <SecondPage
          onBack={handleBackToFirst}
          isPlaying={isPlaying}
          toggleMusic={toggleMusic}
          playerReady={playerReady}
        />
      )}

      {/* First Page */}
      {!showSecondPage && (
        <div className="valentine-container">
          {/* Background gradient overlay */}
          <div className="gradient-overlay"></div>

          {/* Falling hearts */}
          {hearts.map((heart) => (
            <FallingHeart
              key={heart.id}
              delay={heart.delay}
              style={{
                left: `${heart.left}%`,
                fontSize: `${heart.size}rem`,
                animationDuration: `${heart.duration}s`,
              }}
            />
          ))}

          {/* Sparkles */}
          {sparkles.map((sparkle) => (
            <Sparkle
              key={sparkle.id}
              delay={sparkle.delay}
              style={{
                left: `${sparkle.left}%`,
                top: `${sparkle.top}%`,
              }}
            />
          ))}

          {/* Music Control */}
          <button className="music-btn" onClick={toggleMusic} title={playerReady ? 'Bật/Tắt nhạc' : 'Đang tải...'}>
            {isPlaying ? '🔊' : '🔇'}
          </button>

          {/* Main Content */}
          <div className={`content ${showContent ? 'show' : ''}`}>
            <div className="heart-container">
              <div className="pulsing-heart">❤️</div>
            </div>

            <h1 className="title">
              <span className="title-word">Happy</span>
              <span className="title-word highlight">Valentine's</span>
              <span className="title-word">Day!</span>
            </h1>

            <p className="subtitle">💕 For My Love 💕</p>

            <div className="image-gallery">
              <div className="image-card">
                <img
                  src={`${BASE_URL}images/img.png`}
                  alt="Valentine Memory 1"
                  onError={handleImageError}
                />
                <div className="image-overlay">
                  <span>Forever Yours 💝</span>
                </div>
              </div>
              <div className="image-card">
                <img
                  src={`${BASE_URL}images/img_1.png`}
                  alt="Valentine Memory 2"
                  onError={handleImageError}
                />
                <div className="image-overlay">
                  <span>Always & Forever 💖</span>
                </div>
              </div>
            </div>

            <div className="message-box">
              <p className="message">
                "Trong muôn vàn ngôi sao, em là ngôi sao sáng nhất trong đời anh.
                Chúc em một ngày Valentine thật hạnh phúc và tràn ngập tình yêu!"
              </p>
            </div>

            <div className="floating-hearts">
              <span className="float-heart h1">💗</span>
              <span className="float-heart h2">💖</span>
              <span className="float-heart h3">💝</span>
              <span className="float-heart h4">💘</span>
            </div>

            {/* Love Button with running effect */}
            <button
              className={`love-btn ${buttonState}`}
              onClick={handleLoveClick}
              style={{
                position: buttonState === 'running' || buttonState === 'tired' ? 'fixed' : 'relative',
                left: buttonState === 'running' ? `${buttonPosition.x}%` : buttonState === 'tired' ? '50%' : 'auto',
                top: buttonState === 'running' ? `${buttonPosition.y}%` : buttonState === 'tired' ? '50%' : 'auto',
                transform: buttonState === 'running' || buttonState === 'tired' ? 'translate(-50%, -50%)' : 'none',
              }}
            >
              {buttonState === 'initial' && 'Click for Love 💕'}
              {buttonState === 'running' && '🏃 Đừng bắt tôi! 💕'}
              {buttonState === 'tired' && 'Chạy mệt rồi! Hãy nhấn tôi đi 🥰'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default App
