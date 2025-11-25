from fastapi import Depends, HTTPException, status

from app import models
from app.security import get_current_user


def get_current_active_user(current_user: models.User = Depends(get_current_user)):
    return current_user


def get_current_active_admin_user(current_user: models.User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )
    return current_user
