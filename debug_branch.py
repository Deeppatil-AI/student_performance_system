import os
from mongoengine import connect
from models import Branch, User
from dotenv import load_dotenv

load_dotenv()
connect(host=os.getenv('MONGO_URI'))

def check_db():
    print("ALL BRANCHES:")
    for b in Branch.objects():
        print(f"ID: {b.id}, Name: {b.name}, Year: {b.year}")
    
    user = User.objects(username='Deep').first()
    if user:
        print(f"\nUser Deep profile:")
        print(f"Username: {user.username}")
        print(f"Branch: {user.branch}")
    else:
        print("\nUser Deep not found.")

if __name__ == "__main__":
    check_db()
