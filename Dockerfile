# Use official Python slim image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements first
COPY api/requirements.txt . 
# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy app files
COPY api/. . 

# Copy model files
COPY models/ ./models  

# Install system dependencies
RUN apt-get update && apt-get install -y libgl1 libglib2.0-0 && rm -rf /var/lib/apt/lists/*
# Expose port Cloud Run expects
ENV PORT=8080
# Command to run the app
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]
