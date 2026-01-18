/**
 * 오디오 파일 업로더 컴포넌트
 */

import { useCallback } from 'react'
import { Upload, FileAudio, X } from 'lucide-react'

export function AudioUploader({ file, onFileSelect, onClear, disabled = false }) {
  const handleChange = useCallback((e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onFileSelect(selectedFile)
    }
  }, [onFileSelect])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && droppedFile.type.startsWith('audio/')) {
      onFileSelect(droppedFile)
    }
  }, [onFileSelect])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
  }, [])

  return (
    <div className="relative">
      <label
        className={`block cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${
          file
            ? 'border-cyber-500/50 bg-cyber-500/5'
            : 'border-dark-600 hover:border-cyber-500/50 hover:bg-dark-700/30'
        }`}>
          <input
            type="file"
            accept="audio/*"
            onChange={handleChange}
            className="hidden"
            disabled={disabled}
          />

          {file ? (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-cyber-500/20 rounded-2xl flex items-center justify-center mb-4 border border-cyber-500/30 glow-cyber">
                <FileAudio className="w-10 h-10 text-cyber-400" />
              </div>
              <p className="text-lg font-semibold text-white mb-1">{file.name}</p>
              <p className="text-sm text-gray-500 font-mono">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 bg-dark-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-dark-600">
                <Upload className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-lg text-gray-300 mb-2">
                음성 파일을 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-sm text-gray-500 font-mono">
                MP3, WAV, M4A, OGG 지원 (최대 10MB)
              </p>
            </>
          )}
        </div>
      </label>

      {/* Clear Button */}
      {file && onClear && (
        <button
          onClick={(e) => {
            e.preventDefault()
            onClear()
          }}
          className="absolute top-4 right-4 p-2 bg-dark-700 hover:bg-dark-600 rounded-full text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default AudioUploader
