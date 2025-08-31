import fastapi
from fastapi import UploadFile, File    
import uvicorn
import numpy as np
import tensorflow as tf
from PIL import Image
import io
import os

app = fastapi.FastAPI() 

MODEL = tf.keras.models.load_model('models/1.keras')
class_names = ['Early Blight', 'Late Blight', 'Healthy']

@app.get('/')
def index():
    return {'message': 'Hello, World serevr is up and running'} 


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
    image_batch = np.expand_dims(image,0)
    predictions =MODEL.predict(image_batch)
    predicted_class = class_names[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])
    return {
        'class': predicted_class,
        'confidence': float(confidence)
    }


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))  # Cloud Run sets PORT
    uvicorn.run(app, host='0.0.0.0', port=port)