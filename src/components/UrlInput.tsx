import { useEffect, useRef, useState, type FormEvent } from 'react';
import { parseVideoId } from '../lib/parseVideoId';

interface Props {
  onSubmit: (value: string) => void;
}

const EXAMPLES = ['dQw4w9WgXcQ', 'jNQXAC9IVRw', '9bZkp7q19f0'];

export function UrlInput({ onSubmit }: Props) {
  const [value, setValue] = useState('');
  const [validation, setValidation] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (next: string) => {
    setValue(next);
    if (next.trim().length === 0) {
      setValidation('idle');
      return;
    }
    setValidation(parseVideoId(next) ? 'valid' : 'invalid');
  };

  const submit = (input: string) => {
    if (parseVideoId(input)) {
      onSubmit(input);
    } else {
      setValidation('invalid');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(value);
  };

  return (
    <section className="url-input">
      <form className="url-input__form" onSubmit={handleSubmit}>
        <div className={`url-input__field url-input__field--${validation}`}>
          <span className="url-input__icon" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 4h8v8H6z" />
              <path d="M2 6v6a2 2 0 0 0 2 2h6" strokeLinecap="round" />
              <path d="m9 7 2 1-2 1z" fill="currentColor" />
            </svg>
          </span>
          <input
            ref={inputRef}
            className="url-input__input"
            type="text"
            inputMode="url"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="paste a youtube url, a short link, or a raw 11-char id"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onPaste={(e) => {
              const pasted = e.clipboardData.getData('text');
              if (parseVideoId(pasted)) {
                e.preventDefault();
                setValue(pasted);
                setValidation('valid');
                submit(pasted);
              }
            }}
            aria-label="YouTube URL or video ID"
          />
          {value && (
            <button
              type="button"
              className="url-input__clear"
              onClick={() => {
                setValue('');
                setValidation('idle');
                inputRef.current?.focus();
              }}
              aria-label="Clear input"
            >
              ×
            </button>
          )}
          <button type="submit" className="url-input__submit" disabled={validation !== 'valid'}>
            extract
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="url-input__meta">
          <div className="url-input__validation">
            {validation === 'valid' && <span className="dot dot--ok" /> }
            {validation === 'invalid' && <span className="dot dot--err" /> }
            {validation === 'idle' && <span className="dot dot--idle" /> }
            <span className="url-input__validation-text">
              {validation === 'valid' && 'valid youtube id detected'}
              {validation === 'invalid' && 'does not look like a youtube url or id'}
              {validation === 'idle' && 'awaiting input'}
            </span>
          </div>
          <div className="url-input__examples">
            <span className="url-input__examples-label">try →</span>
            {EXAMPLES.map((id) => (
              <button
                key={id}
                type="button"
                className="url-input__example"
                onClick={() => {
                  setValue(id);
                  setValidation('valid');
                  submit(id);
                }}
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      </form>
    </section>
  );
}
