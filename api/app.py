import fastapi
from fastapi import UploadFile, File, Response, Request
import uvicorn
import numpy as np
import tensorflow as tf
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware
import io
import os

app = fastapi.FastAPI() 

# Add CORS middleware (this is still important for preflight OPTIONS requests)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://potato-disease-detectionweb.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Additional middleware to ensure CORS headers on all responses
@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    response = await call_next(request)
    
    # Add CORS headers to all responses
    response.headers["Access-Control-Allow-Origin"] = "https://potato-disease-detectionweb.vercel.app"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Expose-Headers"] = "*"
    
    return response

# Explicit OPTIONS handler for /predict (optional but recommended)
@app.options("/predict")
async def predict_options():
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "https://potato-disease-detectionweb.vercel.app",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        },
    )

MODEL = tf.keras.models.load_model('models/1.keras')
class_names = ['Early Blight', 'Late Blight', 'Healthy']

@app.get('/')
def index():
    return {'message': 'Hello, World server is up and running'} 

def read_file_as_image(data) -> np.ndarray:
    try:
        image = Image.open(io.BytesIO(data))
        return np.array(image)
    except Exception as e:
        print("Error reading image:", e)
        return None

@app.post('/predict')
async def predict(file: UploadFile = File(...)):
    data = await file.read()
    image = read_file_as_image(data)
    if image is None:
        return {"error": "Invalid image file"}
    
    image_batch = np.expand_dims(image, 0)
    predictions = MODEL.predict(image_batch)
    predicted_class = class_names[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])
    
    return {
        'class': predicted_class,
        'confidence': float(confidence)
    }

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))  # Cloud Run sets PORT
    uvicorn.run(app, host='0.0.0.0', port=port)