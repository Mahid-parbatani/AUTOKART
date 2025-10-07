from __future__ import annotations

import os
import sqlite3
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Generator, Iterable, List, Optional, Tuple


def _utc_timestamp() -> str:
    return datetime.utcnow().isoformat(timespec="seconds") + "Z"


@dataclass(frozen=True)
class Contact:
    id: int
    name: str
    email: Optional[str]
    phone: Optional[str]
    company: Optional[str]
    created_at: str
    updated_at: str


@dataclass(frozen=True)
class Note:
    id: int
    contact_id: int
    content: str
    created_at: str


@dataclass(frozen=True)
class Tag:
    id: int
    name: str


class DatabaseManager:
    """Encapsulates all SQLite interactions and schema management."""

    def __init__(self, database_path: str) -> None:
        self.database_path = database_path
        parent_dir = Path(database_path).expanduser().resolve().parent
        parent_dir.mkdir(parents=True, exist_ok=True)

    @contextmanager
    def _connect(self) -> Generator[sqlite3.Connection, None, None]:
        connection = sqlite3.connect(self.database_path)
        connection.row_factory = sqlite3.Row
        # Ensure FK constraints are enforced
        connection.execute("PRAGMA foreign_keys = ON;")
        try:
            yield connection
            connection.commit()
        finally:
            connection.close()

    def initialize_schema(self) -> None:
        with self._connect() as connection:
            cursor = connection.cursor()
            cursor.executescript(
                """
                CREATE TABLE IF NOT EXISTS contacts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT,
                    phone TEXT,
                    company TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS notes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    contact_id INTEGER NOT NULL,
                    content TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS tags (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL UNIQUE
                );

                CREATE TABLE IF NOT EXISTS contact_tags (
                    contact_id INTEGER NOT NULL,
                    tag_id INTEGER NOT NULL,
                    PRIMARY KEY (contact_id, tag_id),
                    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
                    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
                );

                CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts(name);
                CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
                CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone);
                CREATE INDEX IF NOT EXISTS idx_notes_contact_id ON notes(contact_id);
                CREATE INDEX IF NOT EXISTS idx_contact_tags_contact_id ON contact_tags(contact_id);
                CREATE INDEX IF NOT EXISTS idx_contact_tags_tag_id ON contact_tags(tag_id);
                """
            )

    # Contacts
    def create_contact(
        self,
        name: str,
        email: Optional[str] = None,
        phone: Optional[str] = None,
        company: Optional[str] = None,
    ) -> int:
        now = _utc_timestamp()
        with self._connect() as connection:
            cursor = connection.execute(
                """
                INSERT INTO contacts (name, email, phone, company, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (name, email, phone, company, now, now),
            )
            return int(cursor.lastrowid)

    def list_contacts(self, query: Optional[str] = None) -> List[Contact]:
        sql = "SELECT * FROM contacts"
        params: Tuple = tuple()
        if query:
            sql += " WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ?"
            like = f"%{query}%"
            params = (like, like, like, like)
        sql += " ORDER BY name COLLATE NOCASE ASC, id ASC"
        with self._connect() as connection:
            cursor = connection.execute(sql, params)
            rows = cursor.fetchall()
            return [
                Contact(
                    id=row["id"],
                    name=row["name"],
                    email=row["email"],
                    phone=row["phone"],
                    company=row["company"],
                    created_at=row["created_at"],
                    updated_at=row["updated_at"],
                )
                for row in rows
            ]

    def get_contact(self, contact_id: int) -> Optional[Contact]:
        with self._connect() as connection:
            cursor = connection.execute("SELECT * FROM contacts WHERE id = ?", (contact_id,))
            row = cursor.fetchone()
            if not row:
                return None
            return Contact(
                id=row["id"],
                name=row["name"],
                email=row["email"],
                phone=row["phone"],
                company=row["company"],
                created_at=row["created_at"],
                updated_at=row["updated_at"],
            )

    def update_contact(
        self,
        contact_id: int,
        name: Optional[str] = None,
        email: Optional[str] = None,
        phone: Optional[str] = None,
        company: Optional[str] = None,
    ) -> bool:
        fields = []
        values: List[object] = []
        if name is not None:
            fields.append("name = ?")
            values.append(name)
        if email is not None:
            fields.append("email = ?")
            values.append(email)
        if phone is not None:
            fields.append("phone = ?")
            values.append(phone)
        if company is not None:
            fields.append("company = ?")
            values.append(company)
        if not fields:
            return False
        fields.append("updated_at = ?")
        values.append(_utc_timestamp())
        values.append(contact_id)
        sql = f"UPDATE contacts SET {' ,'.join(fields)} WHERE id = ?"
        with self._connect() as connection:
            cursor = connection.execute(sql, tuple(values))
            return cursor.rowcount > 0

    def delete_contact(self, contact_id: int) -> bool:
        with self._connect() as connection:
            cursor = connection.execute("DELETE FROM contacts WHERE id = ?", (contact_id,))
            return cursor.rowcount > 0

    # Notes
    def add_note(self, contact_id: int, content: str) -> int:
        now = _utc_timestamp()
        with self._connect() as connection:
            cursor = connection.execute(
                "INSERT INTO notes (contact_id, content, created_at) VALUES (?, ?, ?)",
                (contact_id, content, now),
            )
            return int(cursor.lastrowid)

    def list_notes_for_contact(self, contact_id: int) -> List[Note]:
        with self._connect() as connection:
            cursor = connection.execute(
                "SELECT * FROM notes WHERE contact_id = ? ORDER BY id ASC",
                (contact_id,),
            )
            rows = cursor.fetchall()
            return [
                Note(
                    id=row["id"],
                    contact_id=row["contact_id"],
                    content=row["content"],
                    created_at=row["created_at"],
                )
                for row in rows
            ]

    def delete_note(self, note_id: int) -> bool:
        with self._connect() as connection:
            cursor = connection.execute("DELETE FROM notes WHERE id = ?", (note_id,))
            return cursor.rowcount > 0

    # Tags
    def ensure_tag(self, name: str) -> int:
        with self._connect() as connection:
            cursor = connection.execute("SELECT id FROM tags WHERE name = ?", (name,))
            row = cursor.fetchone()
            if row:
                return int(row["id"])
            cursor = connection.execute("INSERT INTO tags (name) VALUES (?)", (name,))
            return int(cursor.lastrowid)

    def list_all_tags(self) -> List[Tag]:
        with self._connect() as connection:
            cursor = connection.execute("SELECT * FROM tags ORDER BY name COLLATE NOCASE ASC")
            return [Tag(id=row["id"], name=row["name"]) for row in cursor.fetchall()]

    def list_tags_for_contact(self, contact_id: int) -> List[str]:
        with self._connect() as connection:
            cursor = connection.execute(
                """
                SELECT t.name FROM tags t
                JOIN contact_tags ct ON ct.tag_id = t.id
                WHERE ct.contact_id = ?
                ORDER BY t.name COLLATE NOCASE ASC
                """,
                (contact_id,),
            )
            return [row["name"] for row in cursor.fetchall()]

    def tag_contact_by_name(self, contact_id: int, tag_name: str) -> None:
        tag_id = self.ensure_tag(tag_name)
        with self._connect() as connection:
            connection.execute(
                "INSERT OR IGNORE INTO contact_tags (contact_id, tag_id) VALUES (?, ?)",
                (contact_id, tag_id),
            )

    def untag_contact_by_name(self, contact_id: int, tag_name: str) -> bool:
        with self._connect() as connection:
            cursor = connection.execute("SELECT id FROM tags WHERE name = ?", (tag_name,))
            row = cursor.fetchone()
            if not row:
                return False
            tag_id = int(row["id"])
            cursor = connection.execute(
                "DELETE FROM contact_tags WHERE contact_id = ? AND tag_id = ?",
                (contact_id, tag_id),
            )
            return cursor.rowcount > 0


def default_database_path() -> str:
    # Prefer env var, fall back to ./blackbook.db in CWD
    env = os.getenv("BLACKBOOK_DB")
    if env:
        return str(Path(env).expanduser())
    return str(Path.cwd() / "blackbook.db")
