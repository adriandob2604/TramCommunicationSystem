from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String
from engine import engine
class Base(DeclarativeBase):
    pass

class Account(Base):
    __tablename__ = "Account"
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(30))
    password: Mapped[str] = mapped_column(String(64))
    name: Mapped[str] = mapped_column(String(30))
    surname: Mapped[str] = mapped_column(String(30))
    email: Mapped[str] = mapped_column((String(30)))
    phone_number: Mapped[str] = mapped_column((String(9)))

class BlacklistedToken(Base):
    __tablename__ = "BlacklistedToken"
    id: Mapped[int] = mapped_column(primary_key=True)
    token: Mapped[str] = mapped_column(String(64))

Base.metadata.create_all(engine)