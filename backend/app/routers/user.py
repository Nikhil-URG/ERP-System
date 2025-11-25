from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.db import get_db
from app.dependencies import get_current_active_user

router = APIRouter()


@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_active_user)):
    return current_user


@router.get("/attendance/last10", response_model=List[schemas.Attendance])
def read_last_10_attendance(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    return (
        db.query(models.Attendance)
        .filter(models.Attendance.user_id == current_user.id)
        .order_by(models.Attendance.check_in.desc())
        .limit(10)
        .all()
    )


@router.post("/attendance/check-in", response_model=schemas.Attendance)
def check_in(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    # Check for active check-in
    active_check_in = (
        db.query(models.Attendance)
        .filter(
            models.Attendance.user_id == current_user.id,
            models.Attendance.check_out.is_(None),
        )
        .first()
    )
    if active_check_in:
        raise HTTPException(status_code=400, detail="User already checked in")

    new_attendance = models.Attendance(user_id=current_user.id, check_in=datetime.utcnow())
    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)
    return new_attendance


@router.post("/attendance/check-out", response_model=schemas.Attendance)
def check_out(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    active_check_in = (
        db.query(models.Attendance)
        .filter(
            models.Attendance.user_id == current_user.id,
            models.Attendance.check_out.is_(None),
        )
        .first()
    )
    if not active_check_in:
        raise HTTPException(status_code=400, detail="User not checked in")

    active_check_in.check_out = datetime.utcnow()
    duration = active_check_in.check_out - active_check_in.check_in
    active_check_in.total_hours = duration.total_seconds() / 3600
    db.commit()
    db.refresh(active_check_in)
    return active_check_in
