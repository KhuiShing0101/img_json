# 🖼️ Image to JSON Converter

A powerful web application that converts images to structured JSON data using **Canvas API** (free, client-side) and **Gemini AI** (optional, requires API key).

## ✨ Features

### Canvas API (100% Free)
- **Basic Metadata**: Extract dimensions, file format, size, and aspect ratio
- **Color Palette**: Find 5-10 dominant colors with hex codes and RGB values
- **Base64 Encoding**: Convert images to base64 data URLs
- **Image Statistics**: Calculate brightness, contrast, and color distribution

### Gemini AI (Optional - Requires API Key)
- **OCR Text Extraction**: Extract all readable text from images
- **Object Detection**: Identify objects, people, and items with confidence scores
- **UI Element Analysis**: Detect buttons, forms, and layouts in design mockups
- **Design Analysis**: Analyze color harmony, typography, and composition

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Usage

1. **Upload an Image**: Drag & drop or click to browse
2. **Select Features**: Choose which data to extract using checkboxes
3. **Add API Key** (optional): For AI features, get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey)
4. **Process**: Click "Process Image" to generate JSON
5. **Export**: Copy to clipboard or download as `.json` file

## 🛠️ Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **APIs**:
  - Canvas API (built-in browser API)
  - Google Gemini AI API (optional)

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── ImageUploader.tsx      # Drag-and-drop upload
│   ├── ProcessingOptions.tsx  # Feature toggles
│   ├── ImagePreview.tsx       # Image display
│   ├── JsonOutput.tsx         # Results viewer
│   └── LoadingSpinner.tsx     # Loading indicator
├── services/
│   ├── canvasService.ts       # Canvas API logic
│   └── geminiService.ts       # Gemini AI integration
├── types/
│   └── index.ts               # TypeScript interfaces
├── lib/
│   └── utils.ts               # Utilities
├── App.tsx                    # Main application
└── main.tsx                   # Entry point
```

## 🎨 Key Features

### Client-Side Only
- All Canvas processing happens in your browser
- No server needed
- Images never leave your device (unless using Gemini AI)

### Flexible Processing
- Enable/disable features with checkboxes
- Mix Canvas and AI features
- Fast Canvas processing, optional AI enhancement

### Color Extraction Algorithm
Uses median cut color quantization to find dominant colors:
- Samples pixels efficiently
- Groups similar colors
- Returns sorted palette by prominence

## 🔑 Getting a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy and paste into the app
5. Free tier: 15 requests per minute

## 📝 Example JSON Output

```json
{
  "timestamp": "2025-12-18T14:30:00.000Z",
  "canvas": {
    "metadata": {
      "fileName": "example.jpg",
      "fileSize": 245678,
      "fileType": "image/jpeg",
      "dimensions": { "width": 1920, "height": 1080 },
      "aspectRatio": "1.78:1"
    },
    "colors": {
      "dominantColors": [
        { "hex": "#3b82f6", "rgb": { "r": 59, "g": 130, "b": 246 }, "percentage": 35.2 },
        { "hex": "#1e293b", "rgb": { "r": 30, "g": 41, "b": 59 }, "percentage": 28.4 }
      ]
    }
  },
  "ai": {
    "description": "A modern web interface with...",
    "objects": [
      { "label": "button", "confidence": 0.98 }
    ]
  }
}
```

## 🚀 Deployment

Deploy to any static hosting service:

```bash
npm run build
# Upload the 'dist' folder to:
# - Vercel
# - Netlify
# - GitHub Pages
# - Cloudflare Pages
```

## 💡 Use Cases

- **Design Analysis**: Extract colors and UI elements from mockups
- **Data Extraction**: Pull metadata and text from images
- **API Integration**: Convert images to JSON for APIs
- **Accessibility**: Extract text for screen readers
- **Documentation**: Analyze screenshots and diagrams

## 📄 License

MIT License - Feel free to use this project however you like!

## 🤝 Contributing

Contributions welcome! Feel free to open issues or submit PRs.

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
