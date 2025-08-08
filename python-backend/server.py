# python-backend/server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import io

app = Flask(__name__)
CORS(app)

# Load the model and processor
# Vercel's build process will download these when deploying
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large")

@app.route('/caption', methods=['POST'])
def generate_caption():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']
    try:
        raw_image = Image.open(io.BytesIO(image_file.read())).convert('RGB')
        inputs = processor(raw_image, return_tensors="pt")
        out = model.generate(**inputs)
        caption = processor.decode(out[0], skip_special_tokens=True)
        return jsonify({'description': caption})

    except Exception as e:
        return jsonify({'error': str(e)}), 500