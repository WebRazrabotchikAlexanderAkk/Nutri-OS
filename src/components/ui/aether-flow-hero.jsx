import { useEffect, useRef } from 'react'
import { observeAnimationInteraction } from './animation-interaction'

// The reference's particle field, adapted to the existing NutriOS hero.
export default function AetherFlowHero() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const hero = canvas?.closest('section')
    const ctx = canvas?.getContext('2d')
    if (!hero || !ctx) return

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = { x: null, y: null }
    let width = 0
    let height = 0
    let particles = []
    let frameId = null
    let lastTime = null
    let inView = false
    let interactionPaused = false

    function draw(delta = 0) {
      ctx.clearRect(0, 0, width, height)

      for (const particle of particles) {
        if (delta) {
          particle.x += particle.vx * delta
          particle.y += particle.vy * delta

          if (pointer.x !== null && pointer.y !== null) {
            const dx = particle.x - pointer.x
            const dy = particle.y - pointer.y
            const distance = Math.hypot(dx, dy)
            // An exact pointer/particle overlap must never divide by zero.
            if (distance > 0 && distance < 160) {
              const force = (1 - distance / 160) * 2.5 * delta
              particle.x += (dx / distance) * force
              particle.y += (dy / distance) * force
            }
          }

          if (particle.x < particle.size || particle.x > width - particle.size) particle.vx *= -1
          if (particle.y < particle.size || particle.y > height - particle.size) particle.vy *= -1
          particle.x = Math.max(particle.size, Math.min(width - particle.size, particle.x))
          particle.y = Math.max(particle.size, Math.min(height - particle.size, particle.y))
        }
      }

      const connectionRadius = Math.min(155, width * 0.35)
      for (let a = 0; a < particles.length; a++) {
        const particle = particles[a]
        const highlighted = pointer.x !== null && pointer.y !== null
          && Math.hypot(particle.x - pointer.x, particle.y - pointer.y) < 160

        for (let b = a + 1; b < particles.length; b++) {
          const next = particles[b]
          const distance = Math.hypot(particle.x - next.x, particle.y - next.y)
          if (distance >= connectionRadius) continue

          const opacity = (1 - distance / connectionRadius) * (highlighted ? 0.45 : 0.24)
          ctx.strokeStyle = `rgba(66, 122, 87, ${opacity})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(next.x, next.y)
          ctx.stroke()
        }

        ctx.fillStyle = highlighted ? 'rgba(36, 90, 70, 0.8)' : 'rgba(87, 147, 107, 0.55)'
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function animate(time) {
      frameId = null
      const delta = lastTime === null ? 1 : Math.min((time - lastTime) / 16.67, 3)
      lastTime = time
      draw(delta)
      frameId = requestAnimationFrame(animate)
    }

    function syncAnimation() {
      if (frameId !== null) cancelAnimationFrame(frameId)
      frameId = null
      lastTime = null
      if (!interactionPaused && !motionPreference.matches && inView && !document.hidden) {
        frameId = requestAnimationFrame(animate)
      } else {
        draw()
      }
    }

    function resize() {
      width = hero.clientWidth
      height = hero.clientHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      const count = Math.min(width < 768 ? 45 : 100, Math.max(20, Math.round(width * height / 10000)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: 1 + Math.random() * 1.8,
      }))
      clearPointer()
      draw()
    }

    function movePointer(event) {
      if (event.pointerType === 'touch' || interactionPaused || motionPreference.matches) return
      const bounds = hero.getBoundingClientRect()
      pointer.x = event.clientX - bounds.left
      pointer.y = event.clientY - bounds.top
    }

    function clearPointer() {
      pointer.x = null
      pointer.y = null
    }

    const resizeObserver = new ResizeObserver(resize)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      syncAnimation()
    })

    resize()
    const stopObservingInteraction = observeAnimationInteraction(hero, paused => {
      interactionPaused = paused
      clearPointer()
      syncAnimation()
    })
    resizeObserver.observe(hero)
    intersectionObserver.observe(hero)
    hero.addEventListener('pointermove', movePointer, { passive: true })
    hero.addEventListener('pointerleave', clearPointer)
    window.addEventListener('blur', clearPointer)
    document.addEventListener('visibilitychange', syncAnimation)
    motionPreference.addEventListener('change', syncAnimation)

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      hero.removeEventListener('pointermove', movePointer)
      hero.removeEventListener('pointerleave', clearPointer)
      window.removeEventListener('blur', clearPointer)
      document.removeEventListener('visibilitychange', syncAnimation)
      motionPreference.removeEventListener('change', syncAnimation)
      stopObservingInteraction()
    }
  }, [])

  return <canvas id="hero-particles" ref={canvasRef} className="aether-flow-canvas" aria-hidden="true" />
}
