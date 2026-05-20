from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router

app = FastAPI(
    title="BiteWise ML Service",
    description="API для розпізнавання їжі по фотографії",
    version="1.0.0"
)

# Налаштування CORS (щоб мобільний додаток міг звертатися до API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "BiteWise ML Service is running!"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
