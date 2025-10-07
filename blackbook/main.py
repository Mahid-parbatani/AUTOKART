from __future__ import annotations

from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .crud import (
    create_contact,
    delete_contact,
    exposed_tags,
    get_contact,
    list_contacts,
    tags_from_string,
    update_contact,
)
from .models import Contact
from .schemas import ContactCreate, ContactOut, ContactUpdate

app = FastAPI(title="Blackbook API", version="0.1.0")


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/healthz")
def healthz() -> dict:
    return {"ok": True}


@app.get("/contacts", response_model=List[ContactOut])
def api_list_contacts(
    q: Optional[str] = Query(default=None, description="Search query for name/email/phone"),
    tags: Optional[str] = Query(default=None, description="Comma-separated tags; all must match"),
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
) -> List[ContactOut]:
    tag_list = tags_from_string(tags)
    items, _total = list_contacts(db, q=q, tags=tag_list, limit=limit, offset=offset)
    # expose tags field
    return [ContactOut(id=item.id, name=item.name, email=item.email, phone=item.phone, tags=exposed_tags(item)) for item in items]


@app.post("/contacts", response_model=ContactOut, status_code=201)
def api_create_contact(payload: ContactCreate, db: Session = Depends(get_db)) -> ContactOut:
    item = create_contact(
        db,
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        tags=payload.tags,
    )
    return ContactOut(id=item.id, name=item.name, email=item.email, phone=item.phone, tags=exposed_tags(item))


@app.get("/contacts/{contact_id}", response_model=ContactOut)
def api_get_contact(contact_id: int, db: Session = Depends(get_db)) -> ContactOut:
    item = get_contact(db, contact_id)
    if not item:
        raise HTTPException(status_code=404, detail="Contact not found")
    return ContactOut(id=item.id, name=item.name, email=item.email, phone=item.phone, tags=exposed_tags(item))


@app.patch("/contacts/{contact_id}", response_model=ContactOut)
def api_update_contact(contact_id: int, payload: ContactUpdate, db: Session = Depends(get_db)) -> ContactOut:
    item = get_contact(db, contact_id)
    if not item:
        raise HTTPException(status_code=404, detail="Contact not found")
    updated = update_contact(
        db,
        item,
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        tags=payload.tags,
    )
    return ContactOut(id=updated.id, name=updated.name, email=updated.email, phone=updated.phone, tags=exposed_tags(updated))


@app.delete("/contacts/{contact_id}", status_code=204)
def api_delete_contact(contact_id: int, db: Session = Depends(get_db)) -> None:
    item = get_contact(db, contact_id)
    if not item:
        raise HTTPException(status_code=404, detail="Contact not found")
    delete_contact(db, item)
    return None


# To run: uvicorn blackbook.main:app --reload --host 0.0.0.0 --port 8000
