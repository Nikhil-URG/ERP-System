from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession # Import AsyncSession
from sqlalchemy import select, desc # Import select and desc

from app import models, schemas
from app.db import get_db
from app.dependencies import get_current_active_user

router = APIRouter()

@router.get("/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_active_user)):
    return current_user


@router.get("/attendance/last10", response_model=List[schemas.Attendance])
async def read_last_10_attendance(
    db: AsyncSession = Depends(get_db), # Change Session to AsyncSession
    current_user: models.User = Depends(get_current_active_user),
):
    result = await db.execute(
        select(models.Attendance)
        .filter(models.Attendance.user_id == current_user.id)
        .order_by(desc(models.Attendance.check_in)) # Use desc() from sqlalchemy
        .limit(10)
    )
    return result.scalars().all()


@router.post("/attendance/check-in", response_model=schemas.Attendance)
async def check_in(
    db: AsyncSession = Depends(get_db), # Change Session to AsyncSession
    current_user: models.User = Depends(get_current_active_user),
):
    # Check for active check-in
    result = await db.execute(
        select(models.Attendance)
        .filter(
            models.Attendance.user_id == current_user.id,
            models.Attendance.check_out.is_(None),
        )
    )
    active_check_in = result.scalar_one_or_none()

    if active_check_in:
        raise HTTPException(status_code=400, detail="User already checked in")

    new_attendance = models.Attendance(user_id=current_user.id, check_in=datetime.utcnow())
    db.add(new_attendance)
    await db.commit() # Await commit
    await db.refresh(new_attendance) # Await refresh
    return new_attendance


@router.post("/attendance/check-out", response_model=schemas.Attendance)
async def check_out(
    db: AsyncSession = Depends(get_db), # Change Session to AsyncSession
    current_user: models.User = Depends(get_current_active_user),
):
    result = await db.execute(
        select(models.Attendance)
        .filter(
            models.Attendance.user_id == current_user.id,
            models.Attendance.check_out.is_(None),
        )
    )
    active_check_in = result.scalar_one_or_none()

    if not active_check_in:
        raise HTTPException(status_code=400, detail="User not checked in")

    active_check_in.check_out = datetime.utcnow()
    duration = active_check_in.check_out - active_check_in.check_in
    active_check_in.total_hours = duration.total_seconds() / 3600
    await db.commit() # Await commit
    await db.refresh(active_check_in) # Await refresh
    return active_check_in