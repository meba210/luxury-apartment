import './LoadingSpinner.css'

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  return (
    <div className={`spinner-wrap spinner-wrap--${size}`}>
      <div className="spinner">
        <div className="spinner__ring" />
        <div className="spinner__dot" />
      </div>
      {text && <p className="spinner__text">{text}</p>}
    </div>
  )
}
