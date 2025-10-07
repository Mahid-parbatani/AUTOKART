from __future__ import annotations

import argparse
import json
import sys
from typing import Any, Dict, List, Optional

from .db import Contact, DatabaseManager, Note, Tag, default_database_path


def _print_contacts(contacts: List[Contact]) -> None:
    if not contacts:
        print("No contacts found.")
        return
    widths = {
        "id": 4,
        "name": 20,
        "email": 24,
        "phone": 16,
        "company": 20,
    }
    header = f"{ 'ID'.ljust(widths['id']) }  { 'NAME'.ljust(widths['name']) }  { 'EMAIL'.ljust(widths['email']) }  { 'PHONE'.ljust(widths['phone']) }  { 'COMPANY'.ljust(widths['company']) }"
    print(header)
    print("-" * len(header))
    for c in contacts:
        print(
            f"{str(c.id).ljust(widths['id'])}  "
            f"{(c.name or '').ljust(widths['name'])}  "
            f"{(c.email or '').ljust(widths['email'])}  "
            f"{(c.phone or '').ljust(widths['phone'])}  "
            f"{(c.company or '').ljust(widths['company'])}"
        )


def _print_notes(notes: List[Note]) -> None:
    if not notes:
        print("No notes found.")
        return
    print("ID   CREATED_AT           CONTENT")
    print("-" * 80)
    for n in notes:
        created = (n.created_at or "").ljust(20)
        print(f"{str(n.id).ljust(4)} {created} {n.content}")


def _print_tags(tags: List[str]) -> None:
    if not tags:
        print("No tags.")
        return
    print(", ".join(tags))


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="blackbook", description="Blackbook - a simple CLI address book")
    parser.add_argument("--db", dest="db", default=default_database_path(), help="Path to SQLite DB (default: ./blackbook.db or $BLACKBOOK_DB)")

    subparsers = parser.add_subparsers(dest="command", required=True)

    # init
    p_init = subparsers.add_parser("init", help="Initialize the database schema")

    # contacts
    p_contacts = subparsers.add_parser("contacts", help="Manage contacts")
    contacts_sub = p_contacts.add_subparsers(dest="contacts_cmd", required=True)

    p_c_add = contacts_sub.add_parser("add", help="Add a new contact")
    p_c_add.add_argument("--name", required=True)
    p_c_add.add_argument("--email")
    p_c_add.add_argument("--phone")
    p_c_add.add_argument("--company")

    p_c_ls = contacts_sub.add_parser("ls", help="List contacts")
    p_c_ls.add_argument("--q", help="Search query (matches name, email, phone, company)")

    p_c_get = contacts_sub.add_parser("get", help="Get a contact by id")
    p_c_get.add_argument("--id", type=int, required=True)

    p_c_upd = contacts_sub.add_parser("update", help="Update a contact")
    p_c_upd.add_argument("--id", type=int, required=True)
    p_c_upd.add_argument("--name")
    p_c_upd.add_argument("--email")
    p_c_upd.add_argument("--phone")
    p_c_upd.add_argument("--company")

    p_c_rm = contacts_sub.add_parser("rm", help="Remove a contact")
    p_c_rm.add_argument("--id", type=int, required=True)

    # notes
    p_notes_root = subparsers.add_parser("notes", help="Manage notes for contacts")
    notes_sub = p_notes_root.add_subparsers(dest="notes_cmd", required=True)

    p_n_add = notes_sub.add_parser("add", help="Add a note to a contact")
    p_n_add.add_argument("--contact-id", type=int, required=True)
    p_n_add.add_argument("--content", required=True)

    p_n_ls = notes_sub.add_parser("ls", help="List notes for a contact")
    p_n_ls.add_argument("--contact-id", type=int, required=True)

    p_n_rm = notes_sub.add_parser("rm", help="Remove a note by id")
    p_n_rm.add_argument("--note-id", type=int, required=True)

    # tags
    p_tags_root = subparsers.add_parser("tags", help="Manage tags")
    tags_sub = p_tags_root.add_subparsers(dest="tags_cmd", required=True)

    p_t_add = tags_sub.add_parser("add", help="Create a tag")
    p_t_add.add_argument("--name", required=True)

    p_t_ls = tags_sub.add_parser("ls", help="List tags (optionally for a contact)")
    p_t_ls.add_argument("--contact-id", type=int)

    p_t_tag = tags_sub.add_parser("tag", help="Tag a contact")
    p_t_tag.add_argument("--contact-id", type=int, required=True)
    p_t_tag.add_argument("--tag", required=True)

    p_t_untag = tags_sub.add_parser("untag", help="Remove tag from contact")
    p_t_untag.add_argument("--contact-id", type=int, required=True)
    p_t_untag.add_argument("--tag", required=True)

    return parser


def main(argv: Optional[List[str]] = None) -> None:
    parser = build_parser()
    args = parser.parse_args(argv)

    db = DatabaseManager(args.db)

    if args.command == "init":
        db.initialize_schema()
        print(f"Initialized database at {args.db}")
        return

    # Ensure schema exists for other operations
    db.initialize_schema()

    if args.command == "contacts":
        if args.contacts_cmd == "add":
            new_id = db.create_contact(args.name, args.email, args.phone, args.company)
            print(new_id)
            return
        if args.contacts_cmd == "ls":
            contacts = db.list_contacts(args.q)
            _print_contacts(contacts)
            return
        if args.contacts_cmd == "get":
            contact = db.get_contact(args.id)
            if not contact:
                print("Contact not found", file=sys.stderr)
                sys.exit(1)
            _print_contacts([contact])
            tags = db.list_tags_for_contact(contact.id)
            if tags:
                print(f"Tags: {', '.join(tags)}")
            notes = db.list_notes_for_contact(contact.id)
            if notes:
                print("Notes:")
                _print_notes(notes)
            return
        if args.contacts_cmd == "update":
            changed = db.update_contact(args.id, args.name, args.email, args.phone, args.company)
            if not changed:
                print("No changes applied or contact not found", file=sys.stderr)
                sys.exit(1)
            print("Updated")
            return
        if args.contacts_cmd == "rm":
            deleted = db.delete_contact(args.id)
            if not deleted:
                print("Contact not found", file=sys.stderr)
                sys.exit(1)
            print("Deleted")
            return

    if args.command == "notes":
        if args.notes_cmd == "add":
            note_id = db.add_note(args.contact_id, args.content)
            print(note_id)
            return
        if args.notes_cmd == "ls":
            notes = db.list_notes_for_contact(args.contact_id)
            _print_notes(notes)
            return
        if args.notes_cmd == "rm":
            deleted = db.delete_note(args.note_id)
            if not deleted:
                print("Note not found", file=sys.stderr)
                sys.exit(1)
            print("Deleted")
            return

    if args.command == "tags":
        if args.tags_cmd == "add":
            tag_id = db.ensure_tag(args.name)
            print(tag_id)
            return
        if args.tags_cmd == "ls":
            if args.contact_id:
                names = db.list_tags_for_contact(args.contact_id)
                _print_tags(names)
            else:
                tags = db.list_all_tags()
                if not tags:
                    print("No tags found.")
                else:
                    print(", ".join(t.name for t in tags))
            return
        if args.tags_cmd == "tag":
            db.tag_contact_by_name(args.contact_id, args.tag)
            print("Tagged")
            return
        if args.tags_cmd == "untag":
            removed = db.untag_contact_by_name(args.contact_id, args.tag)
            if not removed:
                print("Tag or association not found", file=sys.stderr)
                sys.exit(1)
            print("Untagged")
            return

    # Fallback
    parser.print_help()
