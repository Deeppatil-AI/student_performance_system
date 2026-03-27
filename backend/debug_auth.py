import os
from mongoengine import connect
from models import User
from werkzeug.security import check_password_hash
from dotenv import load_dotenv

load_dotenv()
connect(host=os.getenv('MONGO_URI'))

def debug_user():
    user = User.objects(username='Rahul').first()
    if not user:
        print("User Rahul NOT FOUND")
        return
    
    print(f"User found: {user.username}")
    print(f"Hash: {user.password}")
    
    match = check_password_hash(user.password, 'password123')
    print(f"Password 'password123' match: {match}")

if __name__ == "__main__":
    debug_user()
