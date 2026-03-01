from fastapi import FastAPI, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove, new_session
from services.ocr_reader import router as ocr_router

app = FastAPI()
app.include_router(ocr_router)

# Model session'ını başlangıçta None yapıyoruz
bg_session = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    # Render bu rotayı gördüğü an "Live" diyecek!
    return {"status": "ok", "message": "Multi-Tool API is Online!"}


@app.post("/api/remove-bg")
async def remove_background_endpoint(file: UploadFile = File(...)):
    global bg_session
    # Model sadece biri fotoğraf gönderdiğinde yüklenecek
    if bg_session is None:
        bg_session = new_session("u2net")

    file_bytes = await file.read()
    # Modeli zaten Dockerfile ile gömdüğümüz için diskten okuması çok hızlı olacak
    output = remove(file_bytes, session=bg_session)
    return Response(content=output, media_type="image/png")