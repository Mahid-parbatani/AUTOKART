from __future__ import annotations

from sqlalchemy import Column, Integer, String, Text

from .database import Base


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    email = Column(String(255), nullable=True, index=True)
    phone = Column(String(64), nullable=True, index=True)
    # Stored as JSON string (e.g., ["friend", "vip"]) for portability
    tags_json = Column(Text, nullable=False, default="[]")
