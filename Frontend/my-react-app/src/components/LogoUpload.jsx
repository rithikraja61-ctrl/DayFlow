import { useId, useRef } from 'react'

export default function LogoUpload({ label = 'Company logo', value, onChange, error }) {
  const inputId = useId()
  const fileRef = useRef(null)

  function onFile(e) {
    const file = e.target.files?.[0]
    if (!file) {
      onChange(null)
      return
    }
    if (!file.type.startsWith('image/')) {
      onChange(null, 'Please upload an image file (PNG, JPG, SVG)')
      return
    }
    const reader = new FileReader()
    reader.onload = () => onChange({ file, preview: reader.result })
    reader.readAsDataURL(file)
  }

  return (
    <div className="field logo-upload-field">
      <span>{label}</span>
      <div className="logo-upload-row">
        <button
          type="button"
          className="logo-upload-btn"
          onClick={() => fileRef.current?.click()}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 16V4m0 0 7 7m-7-7-7 7M4 20h16"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Upload logo
        </button>
        {value?.preview ? (
          <img src={value.preview} alt="Company logo preview" className="logo-upload-preview" />
        ) : (
          <span className="logo-upload-hint">PNG, JPG or SVG</span>
        )}
      </div>
      <input
        id={inputId}
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
        className="logo-upload-input"
        onChange={onFile}
      />
      {error ? <small className="error">{error}</small> : null}
    </div>
  )
}
