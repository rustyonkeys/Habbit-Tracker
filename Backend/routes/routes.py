from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from pydantic import BaseModel, EmailStr
import httpx
import os

from db.database import get_db
from models.models import User, Habit, HabitLog
from auth import (
    hash_password, verify_password,
    create_access_token, get_current_user
)

router = APIRouter()

# ── Schemas (inline for simplicity) ──────────────────────────────────────────

class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class HabitCreate(BaseModel):
    name: str
    icon: str  = "🎯"
    color: str = "#fb923c"
    order: int = 0

class HabitUpdate(BaseModel):
    name:  str | None = None
    icon:  str | None = None
    color: str | None = None
    order: int | None = None

class LogToggle(BaseModel):
    habit_id: int
    log_date: date

class GoogleToken(BaseModel):
    token: str

# ── Auth Routes ───────────────────────────────────────────────────────────────

@router.post("/auth/register", tags=["auth"])
async def register(body: UserRegister, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(
        select(User).where(User.email == body.email)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(400, "Email already registered")

    user = User(
        email=body.email,
        username=body.username,
        hashed_pw=hash_password(body.password),
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)
    return {
        "access_token": create_access_token(user.id),
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "username": user.username},
    }

@router.post("/auth/login", tags=["auth"])
async def login(body: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.hashed_pw):
        raise HTTPException(401, "Invalid credentials")
    return {
        "access_token": create_access_token(user.id),
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "username": user.username, "avatar": user.avatar},
    }

@router.post("/auth/google", tags=["auth"])
async def google_auth(body: GoogleToken, db: AsyncSession = Depends(get_db)):
    # Verify with Google
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {body.token}"},
        )
    if resp.status_code != 200:
        raise HTTPException(401, "Invalid Google token")

    g = resp.json()
    if not g.get("email_verified"):
        raise HTTPException(400, "Google email not verified")

    # Upsert user
    result = await db.execute(select(User).where(User.email == g["email"]))
    user = result.scalar_one_or_none()

    if user:
        user.username   = g.get("name", user.username)
        user.avatar     = g.get("picture")
        user.google_sub = g.get("sub")
    else:
        user = User(
            email=g["email"],
            username=g.get("name", g["email"].split("@")[0]),
            avatar=g.get("picture"),
            google_sub=g.get("sub"),
            hashed_pw="",
        )
        db.add(user)

    await db.flush()
    await db.refresh(user)
    return {
        "access_token": create_access_token(user.id),
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "username": user.username, "avatar": user.avatar},
    }

@router.get("/auth/me", tags=["auth"])
async def me(user: User = Depends(get_current_user)):
    return {"id": user.id, "email": user.email, "username": user.username, "avatar": user.avatar}

# ── Habit Routes ──────────────────────────────────────────────────────────────

@router.get("/habits", tags=["habits"])
async def list_habits(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Habit)
        .where(Habit.user_id == user.id, Habit.is_active == True)
        .order_by(Habit.order, Habit.id)
    )
    habits = result.scalars().all()
    return [{"id": h.id, "name": h.name, "icon": h.icon, "color": h.color, "order": h.order} for h in habits]

@router.post("/habits", tags=["habits"], status_code=201)
async def create_habit(
    body: HabitCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    habit = Habit(**body.model_dump(), user_id=user.id)
    db.add(habit)
    await db.flush()
    await db.refresh(habit)
    return {"id": habit.id, "name": habit.name, "icon": habit.icon, "color": habit.color, "order": habit.order}

@router.patch("/habits/{habit_id}", tags=["habits"])
async def update_habit(
    habit_id: int,
    body: HabitUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    habit = await _get_habit(db, habit_id, user.id)
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(habit, field, value)
    await db.flush()
    await db.refresh(habit)
    return {"id": habit.id, "name": habit.name, "icon": habit.icon, "color": habit.color}

@router.delete("/habits/{habit_id}", tags=["habits"], status_code=204)
async def delete_habit(
    habit_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    habit = await _get_habit(db, habit_id, user.id)
    habit.is_active = False

# ── Log Routes ────────────────────────────────────────────────────────────────

@router.post("/logs/toggle", tags=["logs"])
async def toggle_log(
    body: LogToggle,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    # Verify habit belongs to user
    habit = await db.get(Habit, body.habit_id)
    if not habit or habit.user_id != user.id:
        raise HTTPException(404, "Habit not found")

    result = await db.execute(
        select(HabitLog).where(
            and_(HabitLog.habit_id == body.habit_id, HabitLog.log_date == body.log_date)
        )
    )
    log = result.scalar_one_or_none()

    if log:
        await db.delete(log)
        return {"habit_id": body.habit_id, "log_date": str(body.log_date), "done": False}
    else:
        log = HabitLog(habit_id=body.habit_id, log_date=body.log_date, done=True)
        db.add(log)
        await db.flush()
        return {"habit_id": body.habit_id, "log_date": str(body.log_date), "done": True}

@router.get("/logs/range", tags=["logs"])
async def logs_range(
    start: date,
    end: date,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    habit_result = await db.execute(
        select(Habit.id).where(Habit.user_id == user.id, Habit.is_active == True)
    )
    habit_ids = [row[0] for row in habit_result.all()]
    if not habit_ids:
        return []

    log_result = await db.execute(
        select(HabitLog).where(
            and_(
                HabitLog.habit_id.in_(habit_ids),
                HabitLog.log_date >= start,
                HabitLog.log_date <= end,
            )
        )
    )
    all_logs = log_result.scalars().all()

    # Build day map
    day_map: dict[date, dict[int, bool]] = {}
    current = start
    while current <= end:
        day_map[current] = {}
        current += timedelta(days=1)

    for log in all_logs:
        day_map[log.log_date][log.habit_id] = log.done

    return [{"date": str(d), "logs": logs} for d, logs in sorted(day_map.items())]

@router.get("/logs/today", tags=["logs"])
async def logs_today(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    today = date.today()
    result = await logs_range(today, today, db, user)
    return result[0] if result else {"date": str(today), "logs": {}}

# ── Helpers ───────────────────────────────────────────────────────────────────

async def _get_habit(db: AsyncSession, habit_id: int, user_id: int) -> Habit:
    result = await db.execute(
        select(Habit).where(
            Habit.id == habit_id,
            Habit.user_id == user_id,
            Habit.is_active == True,
        )
    )
    habit = result.scalar_one_or_none()
    if not habit:
        raise HTTPException(404, "Habit not found")
    return habit