from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image # pyright: ignore[reportMissingImports]
from transformers import BlipProcessor, BlipForConditionalGeneration # type: ignore
import io

app = Flask(__name__)
CORS(app)  # This allows your Next.js app to make requests to this server

# Load the model and processor
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large")

@app.route('/caption', methods=['POST'])
def generate_caption():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']
    try:
        raw_image = Image.open(io.BytesIO(image_file.read())).convert('RGB')

        # Pre-process the image
        inputs = processor(raw_image, return_tensors="pt")

        # Generate the caption
        out = model.generate(**inputs)
        caption = processor.decode(out[0], skip_special_tokens=True)

        return jsonify({'description': caption})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)