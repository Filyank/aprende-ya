import bcrypt
from typing import Optional
from sqlmodel import SQLModel, Field

from app.user import UserRead, UserCreate


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str
    password_hash: str

    def to_read_model(self) -> UserRead:
        return UserRead(id=self.id, email=self.email)

    @classmethod
    def from_create_model(cls, user: UserCreate):
        password_hash = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt())
        return User(email=user.email, password_hash=password_hash)
