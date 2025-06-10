# SatelliteVision AI - Few-Shot Remote Sensing Image Classification

## Project Overview

Welcome to **SatelliteVision AI**, a 2CS (Computer Science) final year project developed by a group of students from École Supérieure de Sidi Bel Abbès (ESI-SBA). This project focuses on **Few-Shot Remote Sensing Image Scene Classification (RSISC)** using Vision-Language Models (VLMs), addressing the challenge of classifying satellite imagery with minimal labeled data. Our work compares classical few-shot learning approaches with modern VLMs, providing a comprehensive study and a practical application for land use and land cover analysis.

The project is guided by our supervisor, **Chaib Souleyman**, and was completed by the team: **Baidar Samir**, **Ali Abbou Oussama**, **Djeziri Oussama**, and **Senhadji M. Said**. Submitted on **June 10, 2025**, this project not only serves as our academic milestone but also contributes valuable baselines and insights for future research in geospatial analysis.

### Objectives

- Evaluate and compare deep learning and vision-language models under few-shot conditions.
- Investigate the transferability of VLMs to remote sensing data.
- Develop a user-friendly interface for classifying satellite imagery with 1-shot or 5-shot learning configurations.
- Provide a foundation for future work in RSI-SC with limited annotations.

### Key Features

- **Few-Shot Learning**: Supports 1-shot and 5-shot learning modes for classifying remote sensing images.
- **Model Zoo**: Benchmarks models like AlexNet, CLIP (ViT-B/16, ViT-L/14@336px), BLIP-2, and Remote-CLIP.
- **Datasets**: Evaluated on NWPU-RESISC45, UC-Merced, AID-30, and MLRS-Net datasets.
- **User Interface**: A clean, interactive frontend for uploading images and viewing classification results.

## Interface Overview

The **SatelliteVision AI** interface is designed to provide an intuitive experience for users to upload satellite imagery and analyze land use/cover classifications. Below are the key components of the interface, as depicted in the provided screenshots:

### Upload Section

- **Drag and Drop or Browse**: Users can drag and drop remote sensing images or click to browse files.
- **Image Preview**: Once uploaded, the interface displays the image with details.
  ![Upload Interface](https://github.com/BaidarSamir/Projet-2CS/blob/main/upload-screenshot.png)

### Classification Results

- **Accuracy Indicator**: Displays whether the classification is accurate.
- **Ground Truth vs. AI Prediction**: Shows reference and predicted classes.
- **Confidence Level**: Indicates model certainty with a progress bar.
  ![Classification Results](https://github.com/BaidarSamir/Projet-2CS/blob/main/results-screenshot.png)

### Few-Shot Learning Configuration

- **Learning Mode Selection**: Users can toggle between **1-Shot Learning** (single example per class) and **5-Shot Learning** using dedicated buttons.
- **Select Image Button**: A prominent "Select Image" button initiates the classification process after configuration.

### Classification Results

- **Accuracy Indicator**: Displays whether the classification is accurate (e.g., ✅ Accurate Classification) based on few-shot learning performance.
- **Ground Truth vs. AI Prediction**: Shows the reference classification (e.g., Playground) alongside the model's prediction (e.g., Playground).
- **Confidence Level**: Indicates model certainty (e.g., 61% Low) with a progress bar.
- **Metadata**: Includes dataset split (e.g., Train), few-shot mode (e.g., 1-shot), N-way (e.g., 30-way), and iteration (#0).
- **Actions**: Options to "Analyze New Image" or "View on Map" for further exploration.

### Additional Features

- **Retry and Reset**: Buttons to retry the classification or reset the interface.
- **Responsive Design**: Optimized for desktop and mobile viewing, with a clean layout featuring the SatelliteVision AI logo.

## Installation

To run the frontend locally, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/BaidarSamir/Projet-2CS.git
   cd Projet-2CS
   ```

2. **Install Dependencies**:
   Ensure you have Node.js and npm installed. Then run:

   ```bash
   npm install
   ```

3. **Start the Development Server**:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

4. **Backend Integration**:
   - The frontend communicates with a FastAPI backend (e.g., `http://127.0.0.1:8000/get_prediction`). Ensure the backend is running as per the `main.py`.
   - Update the API endpoint in the frontend code if the backend URL differs.

## Usage

1. **Upload an Image**: Drag and drop a satellite image or use the browse option in the upload section.
2. **Configure Learning Mode**: Select either 1-Shot or 5-Shot learning based on your preference.
3. **Classify**: Click "Select Image" to process the image and display results.
4. **Review Results**: Check the classification accuracy, predicted class, confidence level, and metadata.
5. **Explore Further**: Use "Analyze New Image" or "View on Map" for additional actions.

## Project Structure

- `src/`: Contains the React components and styles.
- `public/`: Includes static assets like the logo and favicon.
- `README.md`: This file.
- `package.json`: Project dependencies and scripts.

## Contributions

This project is a collaborative effort by:

- **Baidar Samir**
- **Ali Abbou Oussama**
- **Djeziri Oussama**
- **Senhadji M. Said**

Supervised by **Chaib Souleyman**.

## Future Work

- **Prompt Learning**: Explore learnable prompts for domain adaptation.
- **Cross-Sensor Transfer**: Test generalization across different sensors.
- **Model Compression**: Develop lightweight VLMs for resource-constrained environments.
- **Multimodal Integration**: Incorporate multispectral and temporal data.
- **Geospatial Priors**: Leverage spatial metadata for improved accuracy.

## License

This project is open-source under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Datasets: NWPU-RESISC45, UC-Merced, AID-30, MLRS-Net.
- Frameworks: React, FastAPI, and various vision-language models (CLIP, BLIP-2, Remote-CLIP).
- References: See the full report for cited works.

For more details, refer to our complete report [rapport.pdf](rapport.pdf) or contact the team via the GitHub Issues page.
