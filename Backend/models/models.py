from datetime import datetime, date
from sqlalchemy import String, DateTime, Date, Boolean, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.database import Base

class User(Base):
    __tablename__ = "users"

    id:         Mapped[int]       = mapped_column(primary_key=True)
    email:      Mapped[str]       = mapped_column(String(255), unique=True, index=True)
    username:   Mapped[str]       = mapped_column(String(100))
    avatar:     Mapped[str|None]  = mapped_column(String(500), nullable=True)
    google_sub: Mapped[str|None]  = mapped_column(String(100), nullable=True, unique=True)
    hashed_pw:  Mapped[str]       = mapped_column(String(255), default="")
    created_at: Mapped[datetime]  = mapped_column(DateTime, server_default=func.now())
    is_active:  Mapped[bool]      = mapped_column(Boolean, default=True)

    habits: Mapped[list["Habit"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class Habit(Base):
    __tablename__ = "habits"

    id:         Mapped[int]      = mapped_column(primary_key=True)
    user_id:    Mapped[int]      = mapped_column(ForeignKey("users.id"), index=True)
    name:       Mapped[str]      = mapped_column(String(100))
    icon:       Mapped[str]      = mapped_column(String(10),  default="🎯")
    color:      Mapped[str]      = mapped_column(String(20),  default="#fb923c")
    order:      Mapped[int]      = mapped_column(default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    is_active:  Mapped[bool]     = mapped_column(Boolean, default=True)

    user: Mapped["User"]            = relationship(back_populates="habits")
    logs: Mapped[list["HabitLog"]]  = relationship(back_populates="habit", cascade="all, delete-orphan")


class HabitLog(Base):
    __tablename__ = "habit_logs"

    id:       Mapped[int]  = mapped_column(primary_key=True)
    habit_id: Mapped[int]  = mapped_column(ForeignKey("habits.id"), index=True)
    log_date: Mapped[date] = mapped_column(Date, index=True)
    done:     Mapped[bool] = mapped_column(Boolean, default=True)

    habit: Mapped["Habit"] = relationship(back_populates="logs")