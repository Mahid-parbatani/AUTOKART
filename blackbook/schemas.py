from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class ContactBase(BaseModel):
    name: str = Field(..., min_length=1)
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    tags: List[str] = Field(default_factory=list)


class ContactCreate(ContactBase):
    pass


class ContactUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1)
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    tags: Optional[List[str]] = None


class ContactOut(ContactBase):
    id: int

    class Config:
        from_attributes = True
