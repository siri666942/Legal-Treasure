import os
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.db.session import get_db
from app.models.uploaded_file import UploadedFile as UploadedFileModel
from app.models.user import User
from app.schemas.files import UploadedFileOut

router = APIRouter()


@router.post("/upload", response_model=UploadedFileOut)
def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UploadedFileOut:
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)

    stored_name = f"{uuid4().hex}_{file.filename}"
    stored_path = upload_dir / stored_name

    size = 0
    with stored_path.open("wb") as f:
        while True:
            chunk = file.file.read(1024 * 1024)
            if not chunk:
                break
            f.write(chunk)
            size += len(chunk)

    record = UploadedFileModel(
        user_id=current_user.id,
        original_filename=file.filename,
        stored_filename=stored_name,
        content_type=file.content_type,
        size=size,
        path=str(stored_path.as_posix() if os.name != "nt" else stored_path),
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return UploadedFileOut(
        id=record.id,
        original_filename=record.original_filename,
        stored_filename=record.stored_filename,
        content_type=record.content_type,
        size=record.size,
        path=record.path,
        created_at=record.created_at,
    )


@router.get("", response_model=list[UploadedFileOut])
def list_my_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[UploadedFileOut]:
    rows = (
        db.query(UploadedFileModel)
        .filter(UploadedFileModel.user_id == current_user.id)
        .order_by(UploadedFileModel.id.desc())
        .all()
    )
    return [
        UploadedFileOut(
            id=r.id,
            original_filename=r.original_filename,
            stored_filename=r.stored_filename,
            content_type=r.content_type,
            size=r.size,
            path=r.path,
            created_at=r.created_at,
        )
        for r in rows
    ]

