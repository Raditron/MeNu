import { useEffect, useRef, useState } from 'react'
import type { IngredientTagValue } from '@menu/domain/types/tagValue'
import type { IngredientSelectFieldProps } from './interfaces/IngredientSelectField.interface'
import styles from './styles/IngredientSelectField.module.css'
import formFieldStyles from '../../../../shared/styles/formField.module.css'

export function IngredientSelectField({ label, options, selection, onChange }: IngredientSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [hasTyped, setHasTyped] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  function openDropdown() {
    setQuery(selection.tagValue?.title ?? '')
    setHasTyped(false)
    setIsOpen(true)
  }

  function closeDropdown() {
    setIsOpen(false)
    setQuery('')
    setHasTyped(false)
  }

  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const filteredOptions = hasTyped
    ? options.filter((option) => option.title.toLowerCase().includes(query.toLowerCase()))
    : options

  function selectOption(tagValue: IngredientTagValue) {
    onChange({ ...selection, tagValue })
    closeDropdown()
  }

  const displayValue = isOpen ? query : selection.tagValue?.title ?? ''

  return (
    <div className={formFieldStyles.formField}>
      <label htmlFor={`${label}-select`}>{label}</label>
      <div className={styles.ingredientSelectRow}>
        <div className={styles.combobox} ref={containerRef}>
          <input
            id={`${label}-select`}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            autoComplete="off"
            placeholder={`Select ${label.toLowerCase()}`}
            style={{ paddingRight: 32 }}
            value={displayValue}
            onFocus={openDropdown}
            onChange={(event) => {
              setQuery(event.target.value)
              setHasTyped(true)
              setIsOpen(true)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.currentTarget.blur()
                closeDropdown()
              }
            }}
          />
          <button
            type="button"
            className={styles.comboboxToggle}
            aria-label={`Toggle ${label.toLowerCase()} options`}
            onClick={() => (isOpen ? closeDropdown() : openDropdown())}
          >
            ⌄
          </button>
          {isOpen && (
            <ul className={styles.comboboxList}>
              {filteredOptions.length === 0 ? (
                <li className={styles.comboboxEmpty}>No matches</li>
              ) : (
                filteredOptions.map((option) => (
                  <li key={option.title}>
                    <button
                      type="button"
                      className={`${styles.comboboxOption}${
                        selection.tagValue?.title === option.title ? ` ${styles.selected}` : ''
                      }`}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectOption(option)}
                    >
                      {option.title}
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        <input
          type="number"
          min={0}
          placeholder="grams"
          value={selection.grams || ''}
          onChange={(event) => onChange({ ...selection, grams: Number(event.target.value) })}
        />
      </div>
    </div>
  )
}
