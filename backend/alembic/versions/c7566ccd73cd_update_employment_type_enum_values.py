"""Update employment type enum values

Revision ID: c7566ccd73cd
Revises: 69998234d0f0
Create Date: 2025-09-23 23:17:03.718089

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c7566ccd73cd'
down_revision: Union[str, Sequence[str], None] = '69998234d0f0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Update the employment type enum to include missing values
    op.execute("ALTER TYPE employmenttype ADD VALUE IF NOT EXISTS 'SALARIED'")
    op.execute("ALTER TYPE employmenttype ADD VALUE IF NOT EXISTS 'SELF_EMPLOYED'")
    op.execute("ALTER TYPE employmenttype ADD VALUE IF NOT EXISTS 'STUDENT'")
    op.execute("ALTER TYPE employmenttype ADD VALUE IF NOT EXISTS 'RETIRED'")


def downgrade() -> None:
    """Downgrade schema."""
    # Note: PostgreSQL doesn't support removing enum values directly
    # This would require recreating the enum type
    pass
