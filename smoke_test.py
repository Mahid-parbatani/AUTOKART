from __future__ import annotations

from sqlalchemy.orm import Session

from blackbook.database import Base, engine, SessionLocal
from blackbook.crud import create_contact, list_contacts, exposed_tags


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        contact = create_contact(db, name="John Doe", email=None, phone="123-456", tags=["Friend", "VIP"]) 
        items, total = list_contacts(db, q="john", tags=["vip"], limit=10, offset=0)
        print(f"total={total}")
        for item in items:
            print(f"{item.id}:{item.name}:{exposed_tags(item)}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
