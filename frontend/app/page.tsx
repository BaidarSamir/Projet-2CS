"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Upload, Satellite, CheckCircle, XCircle, RotateCcw, Globe, MapPin, Layers, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PredictionResult {
  filename: string
  split: string
  true_class: string
  predicted_class: string
  correct: boolean
  confidence: number
  shot: number
  way: number
  iteration: number
}

export default function SatelliteClassifier() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [selectedShots, setSelectedShots] = useState<1 | 5>(5)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setError(null)
    setPrediction(null)

    // Create image preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const getPrediction = async () => {
    if (!selectedFile) return

    setLoading(true)
    setError(null)

    try {
      // Extract filename without extension for the API call
      const filename = selectedFile.name.replace(/\.[^/.]+$/, "")

      const response = await fetch(
        `http://localhost:8000/get_prediction?filename=${encodeURIComponent(filename)}&shots=${selectedShots}`,
      )

      if (!response.ok) {
        throw new Error("Classification data not found for this satellite image")
      }

      const result: PredictionResult = await response.json()
      setPrediction(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to classify satellite imagery")
    } finally {
      setLoading(false)
    }
  }

  const resetUpload = () => {
    setSelectedFile(null)
    setImagePreview(null)
    setPrediction(null)
    setError(null)
    // Keep selectedShots unchanged so user doesn't have to reselect
  }

  const confidencePercentage = prediction ? Math.round(prediction.confidence * 100) : 0

  const formatClassName = (className: string) => {
    return className.replace(/([A-Z])/g, " $1").trim()
  }

  const getClassColor = (className: string) => {
    const colors: { [key: string]: string } = {
      Dense: "bg-red-100 text-red-800 border-red-200",
      Medium: "bg-orange-100 text-orange-800 border-orange-200",
      Sparse: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Residential: "bg-blue-100 text-blue-800 border-blue-200",
      Commercial: "bg-purple-100 text-purple-800 border-purple-200",
      Industrial: "bg-gray-100 text-gray-800 border-gray-200",
      Forest: "bg-green-100 text-green-800 border-green-200",
      Water: "bg-cyan-100 text-cyan-800 border-cyan-200",
      Agricultural: "bg-lime-100 text-lime-800 border-lime-200",
    }

    for (const [key, color] of Object.entries(colors)) {
      if (className.includes(key)) return color
    }
    return "bg-slate-100 text-slate-800 border-slate-200"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Globe className="h-10 w-10 text-blue-600" />
              <Satellite className="h-6 w-6 text-green-600 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 via-green-600 to-teal-600 bg-clip-text text-transparent">
              SatelliteVision AI
            </h1>
          </div>
          <p className="text-gray-700 text-lg mb-2">Remote Sensing Imagery Classification</p>
          <p className="text-gray-600">Few-Shot Learning for Land Use & Land Cover Analysis</p>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Upload Section */}
          <Card className="border-2 border-dashed border-green-300 hover:border-blue-400 transition-colors bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <div
                className={`relative ${dragActive ? "bg-blue-50" : ""} rounded-lg transition-colors`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {!selectedFile ? (
                  <div className="text-center">
                    <div className="relative mx-auto w-16 h-16 mb-4">
                      <Satellite className="w-16 h-16 text-blue-500" />
                      <Upload className="w-6 h-6 text-green-600 absolute -bottom-1 -right-1 bg-white rounded-full p-1" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload Satellite Imagery</h3>
                    <p className="text-gray-600 mb-4">
                      Drag and drop your remote sensing image here, or click to browse
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                      Supports: Landsat, Sentinel, aerial imagery, and other Earth observation data
                    </p>

                    {/* Shot Selection */}
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-700 mb-3">Few-Shot Learning Configuration</p>
                      <div className="flex justify-center gap-4">
                        <Button
                          variant={selectedShots === 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedShots(1)}
                          className={selectedShots === 1 ? "bg-blue-600 hover:bg-blue-700" : ""}
                        >
                          1-Shot Learning
                        </Button>
                        <Button
                          variant={selectedShots === 5 ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedShots(5)}
                          className={selectedShots === 5 ? "bg-blue-600 hover:bg-blue-700" : ""}
                        >
                          5-Shot Learning
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {selectedShots === 1 ? "Single example per class" : "Five examples per class"}
                      </p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      onClick={triggerFileSelect}
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    >
                      <Satellite className="mr-2 h-4 w-4" />
                      Select Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-6 w-6 text-green-600" />
                        <span className="font-medium text-gray-700">{selectedFile.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                          {selectedShots}-Shot
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        {prediction && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={getPrediction}
                            disabled={loading}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Retry
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resetUpload}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Reset
                        </Button>
                      </div>
                    </div>

                    {/* Shot Selection for uploaded file */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Learning Mode:</span>
                      <div className="flex gap-2">
                        <Button
                          variant={selectedShots === 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedShots(1)}
                          className={selectedShots === 1 ? "bg-blue-600 hover:bg-blue-700" : ""}
                        >
                          1-Shot
                        </Button>
                        <Button
                          variant={selectedShots === 5 ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedShots(5)}
                          className={selectedShots === 5 ? "bg-blue-600 hover:bg-blue-700" : ""}
                        >
                          5-Shot
                        </Button>
                      </div>
                    </div>

                    {!prediction && (
                      <Button
                        onClick={getPrediction}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                      >
                        <Target className="mr-2 h-4 w-4" />
                        {loading ? "Analyzing Imagery..." : `Classify with ${selectedShots}-Shot Learning`}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Image Preview and Results */}
          {imagePreview && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Image Preview */}
              <Card className="lg:col-span-1 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-blue-600" />
                    Satellite Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Satellite imagery preview"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-black/70 text-white text-xs">Remote Sensing Data</Badge>
                    </div>
                  </div>
                  {selectedFile && (
                    <div className="mt-3 text-xs text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">File:</span> {selectedFile.name}
                      </p>
                      <p>
                        <span className="font-medium">Size:</span> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p>
                        <span className="font-medium">Type:</span> {selectedFile.type}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Results */}
              <Card className="lg:col-span-2 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Classification Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Satellite className="h-5 w-5 text-blue-600 animate-pulse" />
                        <span className="text-blue-700 font-medium">Processing satellite imagery...</span>
                      </div>
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <Alert className="border-red-200 bg-red-50">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">{error}</AlertDescription>
                    </Alert>
                  )}

                  {prediction && (
                    <div className="space-y-6">
                      {/* Classification Accuracy */}
                      <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
                        {prediction.correct ? (
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        ) : (
                          <XCircle className="h-8 w-8 text-red-600" />
                        )}
                        <div>
                          <Badge
                            variant={prediction.correct ? "default" : "destructive"}
                            className={`text-sm ${prediction.correct ? "bg-green-600" : "bg-red-600"}`}
                          >
                            {prediction.correct ? "Accurate Classification" : "Misclassification Detected"}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">Few-shot learning model performance</p>
                        </div>
                      </div>

                      {/* Land Cover Classes */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-lg border-2 ${getClassColor(prediction.true_class)}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="h-5 w-5" />
                            <p className="font-medium">Ground Truth</p>
                          </div>
                          <p className="text-xl font-bold">{formatClassName(prediction.true_class)}</p>
                          <p className="text-sm opacity-75 mt-1">Reference classification</p>
                        </div>

                        <div className={`p-4 rounded-lg border-2 ${getClassColor(prediction.predicted_class)}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-5 w-5" />
                            <p className="font-medium">AI Prediction</p>
                          </div>
                          <p className="text-xl font-bold">{formatClassName(prediction.predicted_class)}</p>
                          <p className="text-sm opacity-75 mt-1">Model classification</p>
                        </div>
                      </div>

                      {/* Confidence Score */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-gray-700">Classification Confidence</p>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">{confidencePercentage}%</span>
                            <Badge variant="outline" className="text-xs">
                              {confidencePercentage >= 90 ? "High" : confidencePercentage >= 70 ? "Medium" : "Low"}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={confidencePercentage} className="h-4" />
                        <p className="text-sm text-gray-600">Model certainty in land cover classification</p>
                      </div>

                      {/* Model Information */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700 font-medium">Dataset Split</p>
                          <p className="text-lg font-bold text-blue-900 capitalize">{prediction.split}</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-700 font-medium">Few-Shot</p>
                          <p className="text-lg font-bold text-green-900">{prediction.shot}-shot</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm text-purple-700 font-medium">N-Way</p>
                          <p className="text-lg font-bold text-purple-900">{prediction.way}-way</p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <p className="text-sm text-orange-700 font-medium">Iteration</p>
                          <p className="text-lg font-bold text-orange-900">#{prediction.iteration}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Button onClick={resetUpload} variant="outline" className="flex-1">
                          <Upload className="mr-2 h-4 w-4" />
                          Analyze New Image
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <MapPin className="mr-2 h-4 w-4" />
                          View on Map
                        </Button>
                      </div>
                    </div>
                  )}

                  {!loading && !error && !prediction && selectedFile && (
                    <div className="text-center text-gray-500 py-8">
                      <Satellite className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-lg font-medium">Ready for Classification</p>
                      <p>Click "Classify Land Cover" to analyze your satellite imagery</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
