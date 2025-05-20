from datetime import timedelta
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.models import Auth, User, EmploymentStatus, MaritalStatus
from app.schemas.schemas import UserCreate, UserResponse, Token, UserProfileUpdate, UserLogin
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    # Check if username or email already exists
    existing_user = db.query(Auth).filter(
        (Auth.username == user_data.username) | 
        (Auth.email == user_data.email)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )

    # Create user profile
    new_user = User(
        account_number="TEMP-123",
        industry="Not Set",
        occupation="Not Set",
        organisation="Not Set",
        residence="Not Set",
        date_of_birth="2000-01-01",
        employment_status=EmploymentStatus.UNEMPLOYED,
        basic_salary=0.00,
        expected_monthly_income=0.00,
        permanent_address_line1="Not Set",
        city="Not Set",
        post_code="000000",
        nationality="Not Set",
        marital_status=MaritalStatus.SINGLE,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create auth record
    new_auth = Auth(
        user_id=new_user.id,
        username=user_data.username,
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        is_active=True
    )
    db.add(new_auth)
    db.commit()
    db.refresh(new_auth)

    return UserResponse(
        id=new_auth.id,
        username=new_auth.username,
        email=new_auth.email,
        is_active=new_auth.is_active
    )

@router.post("/login", response_model=Token)
async def login(
    user_data: UserLogin,
    db: Session = Depends(get_db)
):
    # Authenticate user
    user = db.query(Auth).filter(Auth.username == user_data.username).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "id": user.id},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: Auth = Depends(get_current_active_user)):
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        is_active=current_user.is_active
    )

@router.put("/profile", response_model=UserResponse)
async def update_user_profile(
    profile_data: UserProfileUpdate,
    current_user: UserResponse = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Get the user's auth record
    user_auth = db.query(Auth).filter(Auth.id == current_user.id).first()
    if not user_auth:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Get the user's profile
    user_profile = db.query(User).filter(User.id == user_auth.user_id).first()
    if not user_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )

    # Update profile fields
    for field, value in profile_data.dict(exclude_unset=True).items():
        setattr(user_profile, field, value)

    db.commit()
    db.refresh(user_profile)

    return current_user 