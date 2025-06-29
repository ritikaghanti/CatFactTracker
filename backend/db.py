import sqlite3

def init_db():
    conn = sqlite3.connect("cat_facts.db")
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS cat_facts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fact TEXT UNIQUE,
            created_at DATE DEFAULT (DATE('now'))
        )
    """)
    conn.commit()
    conn.close()

def insert_fact(fact):
    conn = sqlite3.connect("cat_facts.db")
    c = conn.cursor()
    try:
        c.execute("INSERT INTO cat_facts (fact) VALUES (?)", (fact,))
        conn.commit()
        # print(f"Inserted: {fact}")
    except sqlite3.IntegrityError:
        conn.close()
        raise ValueError("Fact already exists.")
    conn.close()

def get_all_facts():
    conn = sqlite3.connect("cat_facts.db")
    c = conn.cursor()
    c.execute("SELECT * FROM cat_facts")
    rows = c.fetchall()
    conn.close()
    return rows

def get_random_fact():
    conn = sqlite3.connect("cat_facts.db")
    c = conn.cursor()
    c.execute("SELECT fact FROM cat_facts ORDER BY RANDOM() LIMIT 1")
    row = c.fetchone()
    conn.close()
    return row[0] if row else None

def clear_db():
    conn = sqlite3.connect("cat_facts.db")
    c = conn.cursor()
    c.execute("DELETE FROM cat_facts")
    conn.commit()
    conn.close()
