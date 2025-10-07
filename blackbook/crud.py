from __future__ import annotations

import json
from typing import Iterable, List, Optional, Sequence, Tuple

from sqlalchemy import Select, or_, select, func
from sqlalchemy.orm import Session

from .models import Contact


def _normalize_tags(tags: Iterable[str]) -> List[str]:
    normalized = [t.strip().lower() for t in tags if t and t.strip()]
    # ensure uniqueness while preserving order
    seen = set()
    unique = []
    for tag in normalized:
        if tag not in seen:
            seen.add(tag)
            unique.append(tag)
    return unique


def _serialize_tags(tags: Iterable[str]) -> str:
    return json.dumps(_normalize_tags(tags), separators=(",", ":"))


def _deserialize_tags(tags_json: str) -> List[str]:
    try:
        raw = json.loads(tags_json or "[]")
        if isinstance(raw, list):
            return _normalize_tags([str(x) for x in raw])
    except Exception:
        pass
    return []


def list_contacts(db: Session, *, q: Optional[str] = None, tags: Optional[Sequence[str]] = None, limit: int = 100, offset: int = 0) -> Tuple[List[Contact], int]:
    stmt: Select = select(Contact)

    if q:
        like = f"%{q}%"
        stmt = stmt.where(
            or_(
                Contact.name.ilike(like),
                Contact.email.ilike(like),
                Contact.phone.ilike(like),
            )
        )

    if tags:
        # simple filter: require all provided tags to be present in tags_json
        for tag in _normalize_tags(tags):
            stmt = stmt.where(Contact.tags_json.ilike(f"%\"{tag}\"%"))

    # Count total BEFORE pagination using a subquery, compatible with SQLAlchemy 2.x
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total: int = int(db.execute(count_stmt).scalar_one())

    stmt = stmt.order_by(Contact.name.asc()).offset(offset).limit(limit)
    results = list(db.execute(stmt).scalars())
    return results, total if isinstance(total, int) else len(results)


def get_contact(db: Session, contact_id: int) -> Optional[Contact]:
    return db.get(Contact, contact_id)


def create_contact(db: Session, *, name: str, email: Optional[str], phone: Optional[str], tags: Iterable[str]) -> Contact:
    contact = Contact(
        name=name,
        email=email,
        phone=phone,
        tags_json=_serialize_tags(tags),
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


def update_contact(db: Session, contact: Contact, *, name: Optional[str], email: Optional[str], phone: Optional[str], tags: Optional[Iterable[str]]) -> Contact:
    if name is not None:
        contact.name = name
    if email is not None:
        contact.email = email
    if phone is not None:
        contact.phone = phone
    if tags is not None:
        contact.tags_json = _serialize_tags(tags)
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


def delete_contact(db: Session, contact: Contact) -> None:
    db.delete(contact)
    db.commit()


def tags_from_string(raw: Optional[str]) -> List[str]:
    if not raw:
        return []
    bits = [b.strip() for b in raw.replace(";", ",").split(",")]
    return _normalize_tags(bits)


def exposed_tags(contact: Contact) -> List[str]:
    return _deserialize_tags(contact.tags_json)
