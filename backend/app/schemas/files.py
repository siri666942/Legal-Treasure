from datetime import datetime

from pydantic import BaseModel


class UploadedFileOut(BaseModel):
    id: int
    original_filename: str
    stored_filename: str
    content_type: str | None
    size: int
    path: str
    created_at: datetime

