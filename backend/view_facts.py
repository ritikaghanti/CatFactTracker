from db import get_all_facts

facts = get_all_facts()
for f in facts:
    print(f)
