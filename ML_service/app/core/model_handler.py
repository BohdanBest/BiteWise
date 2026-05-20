import io
import torch
import json
import os
import cv2
import numpy as np
from torchvision import models, transforms
from PIL import Image

MODEL_WEIGHTS_PATH = "app/models/efficientnet_food101.pth"
CLASSES_JSON_PATH = "app/models/food101_classes.json"
WEIGHTS_JSON_PATH = "app/models/food_base_weights.json"

food_classes = None
if os.path.exists(CLASSES_JSON_PATH):
    with open(CLASSES_JSON_PATH, "r") as f:
        food_classes = json.load(f)

base_weights = {}
if os.path.exists(WEIGHTS_JSON_PATH):
    with open(WEIGHTS_JSON_PATH, "r") as f:
        base_weights = json.load(f)

model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)

is_custom_model = False
if os.path.exists(MODEL_WEIGHTS_PATH):
    num_features = model.classifier[1].in_features
    model.classifier[1] = torch.nn.Linear(num_features, 101)
    model.load_state_dict(torch.load(MODEL_WEIGHTS_PATH, map_location=torch.device('cpu')))
    is_custom_model = True
    print("Успішно завантажено власну модель Food-101!")
else:
    print("Власної моделі не знайдено. Використовується базова модель ImageNet.")

model.eval()

preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def estimate_weight(image_bytes: bytes, class_name: str) -> int:

    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    
    if img is None:
        return base_weights.get(class_name, 250)
        
    height, width = img.shape[:2]
    total_area = width * height
    
    mask = np.zeros((height, width), np.uint8)
    
    rect = (int(width * 0.05), int(height * 0.05), int(width * 0.9), int(height * 0.9))
    
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)
    
    try:
        cv2.grabCut(img, mask, rect, bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_RECT)
        
        mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')
        
        food_area = np.sum(mask2)
    except Exception as e:
        return base_weights.get(class_name, 250)
    
    area_ratio = food_area / total_area
    
    base_weight = base_weights.get(class_name, 250)
    
    typical_ratio = 0.5 
    estimated_weight = base_weight * (area_ratio / typical_ratio)
    
    estimated_weight = max(10, min(1500, estimated_weight))
    
    return int(estimated_weight)


def recognize_food(image_bytes: bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    input_tensor = preprocess(image)
    input_batch = input_tensor.unsqueeze(0) 

    with torch.no_grad():
        output = model(input_batch)
    
    probabilities = torch.nn.functional.softmax(output[0], dim=0)
    confidence, class_idx = torch.max(probabilities, dim=0)
    
    class_id = int(class_idx)
    
    result = {
        "class_id": class_id,
        "confidence": float(confidence),
    }
    
    if not is_custom_model or not food_classes:
        result["warning"] = "Використовується базова модель ImageNet (повертає номер класу з 1000)."
        result["model_used"] = "ImageNet Default"
        return result

    result["model_used"] = "Food-101 Custom"
    
    if confidence < 0.50:
        result["class_name"] = "unknown/not_food"
        result["warning"] = "Низька впевненість моделі. Можливо, це не їжа."
        result["estimated_weight_grams"] = 0
    else:
        class_name = food_classes[class_id]
        result["class_name"] = class_name
        result["estimated_weight_grams"] = estimate_weight(image_bytes, class_name)
        
    return result