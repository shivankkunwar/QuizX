 'use client'

 import { useEffect, useMemo, useState } from 'react'
 import { AnimatePresence, motion } from 'framer-motion'

 function cn(...classes: Array<string | false | null | undefined>) {
 	return classes.filter(Boolean).join(' ')
 }

 export type RotatingTextProps = {
 	texts: string[]
 	intervalMs?: number
 	className?: string
 	staggerSecondsPerChar?: number
 	wordWrapperClassName?: string
 	charClassName?: string
 }

 /**
  * Animated rotating text for the hero. Splits the current text into words and characters
  * and reveals characters with a gentle upward slide and stagger.
  */
 export default function RotatingText({
 	texts,
 	intervalMs = 2000,
 	className,
 	staggerSecondsPerChar = 0.025,
 	wordWrapperClassName,
 	charClassName,
 }: RotatingTextProps) {
 	const [index, setIndex] = useState(0)

 	useEffect(() => {
 		if (!texts?.length || texts.length === 1) return
 		const id = setInterval(() => {
 			setIndex((prev) => (prev + 1) % texts.length)
 		}, intervalMs)
 		return () => clearInterval(id)
 	}, [texts, intervalMs])

 	const elements = useMemo(() => {
 		const current = texts[index] ?? ''
 		const words = current.split(' ')
 		return words.map((word, wordIdx) => ({
 			characters: Array.from(word),
 			needsSpace: wordIdx !== words.length - 1,
 		}))
 	}, [texts, index])

 	return (
 		<span
 			className={cn(
 				// Transparent chip, no border
 				'inline-flex flex-wrap items-center bg-transparent rounded-lg px-2 md:px-3 py-0.5 md:py-1',
 				className,
 			)}
 			aria-live="polite"
 			aria-atomic="true"
 		>
 			<span className="sr-only">{texts[index]}</span>
 			<AnimatePresence mode="wait" initial={false}>
 				<motion.span
 					key={index}
 					className="flex flex-wrap"
 					aria-hidden="true"
 				>
 					{elements.map((word, wordIndex, arr) => {
 						const charsBefore = arr
 							.slice(0, wordIndex)
 							.reduce((sum, w) => sum + w.characters.length, 0)
 						return (
 							<span
 								key={wordIndex}
 								className={cn('inline-flex', wordWrapperClassName)}
 							>
 								{word.characters.map((char, charIndex) => (
 									<motion.span
 										key={charIndex}
 										initial={{ y: '30%', opacity: 0 }}
 										animate={{ y: 0, opacity: 1 }}
 										exit={{ y: '-30%', opacity: 0 }}
 										transition={{
 											type: 'tween',
 											ease: 'easeOut',
 											duration: 0.35,
 											delay: (charsBefore + charIndex) * staggerSecondsPerChar,
 										}}
 										className={cn('inline-block', charClassName)}
 									>
 										{char}
 									</motion.span>
 								))}
 								{word.needsSpace && <span className="whitespace-pre"> </span>}
 							</span>
 						)
 					})}
 				</motion.span>
 			</AnimatePresence>
 		</span>
 	)
 }


