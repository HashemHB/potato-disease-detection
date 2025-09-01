import fastapi
from fastapi import UploadFile, File, Response, Request, HTTPException
import uvicorn
import numpy as np
import tensorflow as tf
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware
import io
import os
import json

app = fastapi.FastAPI()

# Comprehensive CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://potato-disease-detectionweb.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)

# Middleware to add CORS headers to all responses
@app.middleware("http")
async def add_cors_middleware(request: Request, call_next):
    if request.method == "OPTIONS":
        # Handle preflight requests
        response = Response(
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": "https://potato-disease-detectionweb.vercel.app",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, Origin",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Max-Age": "600",
            }
        )
        return response
    
    response = await call_next(request)
    
    # Add CORS headers to all responses
    response.headers["Access-Control-Allow-Origin"] = "https://potato-disease-detectionweb.vercel.app"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Expose-Headers"] = "*"
    
    return response

# Explicit OPTIONS handler
@app.options("/{rest_of_path:path}")
async def options_handler(rest_of_path: str = None):
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "https://potato-disease-detectionweb.vercel.app",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, Origin",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Max-Age": "600",
        }
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
    try:
        data = await file.read()
        image = read_file_as_image(data)
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        image_batch = np.expand_dims(image, 0)
        predictions = MODEL.predict(image_batch)
        predicted_class = class_names[np.argmax(predictions[0])]
        confidence = np.max(predictions[0])
        
        return {
            'class': predicted_class,
            'confidence': float(confidence)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host='0.0.0.0', port=port)