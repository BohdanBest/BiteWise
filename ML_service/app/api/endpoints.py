from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from app.core.model_handler import recognize_food

router = APIRouter()

@router.post("/recognize")
async def recognize_image(file: UploadFile = File(...)):
    """
    Ендпоінт для завантаження зображення і розпізнавання їжі.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Файл має бути зображенням")
    
    try:
        # Читаємо файл в пам'ять
        contents = await file.read()
        
        # Передаємо зображення в ML-модель
        result = recognize_food(contents)
        result["filename"] = file.filename
        
        return JSONResponse(content=result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Помилка обробки файлу: {str(e)}")
