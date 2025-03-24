import React, { useState, useEffect } from 'react'

interface VirtualKeyboardProps {
  inputRefs: React.RefObject<HTMLInputElement>[]
  onClose?: () => void
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ inputRefs, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentInput, setCurrentInput] = useState<HTMLInputElement | null>(null)

  const letters = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ]

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
  const specialChars = ['@', '.', '-', '_', '!', '#', '$', '&']

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement
      if (inputRefs.some((ref) => ref.current === target)) {
        setCurrentInput(target)
        setIsVisible(true)
      }
    }

    const handleBlur = (e: FocusEvent) => {
      // Small delay to allow for clicking keyboard buttons
      setTimeout(() => {
        const relatedTarget = e.relatedTarget as HTMLElement | null
        if (!relatedTarget?.closest('.virtual-keyboard')) {
          setIsVisible(false)
          setCurrentInput(null)
        }
      }, 100)
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        !target.closest('.virtual-keyboard') &&
        !inputRefs.some((ref) => ref.current === target)
      ) {
        setIsVisible(false)
        setCurrentInput(null)
      }
    }

    // Add click event listener to document
    document.addEventListener('mousedown', handleClickOutside)

    inputRefs.forEach((ref) => {
      if (ref.current) {
        ref.current.addEventListener('focus', handleFocus)
        ref.current.addEventListener('blur', handleBlur)
      }
    })

    return () => {
      // Remove click event listener
      document.removeEventListener('mousedown', handleClickOutside)

      inputRefs.forEach((ref) => {
        if (ref.current) {
          ref.current.removeEventListener('focus', handleFocus)
          ref.current.removeEventListener('blur', handleBlur)
        }
      })
    }
  }, [inputRefs])

  const handleKeyPress = (key: string) => {
    if (!currentInput) return

    const start = currentInput.selectionStart || 0
    const currentValue = currentInput.value

    const newValue = currentValue.concat(key)

    currentInput.value = newValue
    currentInput.setSelectionRange(start + 1, start + 1)

    // Trigger input event to ensure form validation works
    const event = new Event('input', { bubbles: true })
    currentInput.dispatchEvent(event)
  }

  const handleBackspace = () => {
    if (!currentInput) return

    currentInput.value = currentInput.value.slice(0, -1)
  }

  if (!isVisible) return null

  return (
    <div className="virtual-keyboard fixed bottom-0 left-0 right-0 bg-gray-100 p-4 shadow-lg">
      <div className="flex flex-col gap-2 max-w-7xl mx-auto">
        {/* Numbers row */}
        <div className="flex justify-between gap-1">
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="flex-1 p-3 bg-white text-black rounded shadow hover:bg-gray-200"
            >
              {num}
            </button>
          ))}
        </div>

        {/* Letters rows */}
        {letters.map((row, idx) => (
          <div key={idx} className="flex justify-between gap-1">
            {/* Add left spacing for keyboard layout staggering */}
            {idx === 1 && <div className="flex-[0.5]" />}
            {idx === 2 && <div className="flex-1" />}

            {row.map((letter) => (
              <button
                key={letter}
                onClick={() => handleKeyPress(letter)}
                className="flex-1 p-3 bg-white text-black rounded shadow hover:bg-gray-200"
              >
                {letter}
              </button>
            ))}

            {/* Add right spacing for keyboard layout staggering */}
            {idx === 1 && <div className="flex-[0.5]" />}
            {idx === 2 && <div className="flex-1" />}
          </div>
        ))}

        {/* Special characters and control buttons */}
        <div className="flex justify-between gap-1">
          {specialChars.map((char) => (
            <button
              key={char}
              onClick={() => handleKeyPress(char)}
              className="flex-1 p-3 bg-white text-black rounded shadow hover:bg-gray-200"
            >
              {char}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            className="flex-[1.5] p-3 bg-white text-black rounded shadow hover:bg-gray-200"
          >
            ⌫
          </button>
          <button
            onClick={() => {
              setIsVisible(false)
              onClose?.()
            }}
            className="flex-[1.5] p-3 bg-white text-black rounded shadow hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default VirtualKeyboard
