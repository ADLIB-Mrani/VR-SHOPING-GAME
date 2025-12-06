#!/bin/bash
# Quick start script for VR Shopping Game

echo "🎮 VR Shopping Game - Quick Start"
echo "=================================="
echo ""

# Check if npm is installed
if command -v npm &> /dev/null; then
    echo "✓ npm found"
    echo "Starting with npm..."
    npm start
elif command -v python3 &> /dev/null; then
    echo "✓ Python 3 found"
    echo "Starting with Python 3..."
    echo "Open your browser at: http://localhost:8080"
    python3 -m http.server 8080
elif command -v python &> /dev/null; then
    echo "✓ Python found"
    # Check Python version and use appropriate module
    if python -c "import sys; exit(0 if sys.version_info.major == 3 else 1)" 2>/dev/null; then
        echo "Starting with Python 3..."
        echo "Open your browser at: http://localhost:8080"
        python -m http.server 8080
    else
        echo "Starting with Python 2..."
        echo "Open your browser at: http://localhost:8080"
        python -m SimpleHTTPServer 8080
    fi
elif command -v php &> /dev/null; then
    echo "✓ PHP found"
    echo "Starting with PHP..."
    echo "Open your browser at: http://localhost:8080"
    php -S localhost:8080
else
    echo "❌ No suitable server found!"
    echo ""
    echo "Please install one of the following:"
    echo "  - Node.js (npm)"
    echo "  - Python"
    echo "  - PHP"
    echo ""
    echo "Or simply open index.html in your browser."
    exit 1
fi
