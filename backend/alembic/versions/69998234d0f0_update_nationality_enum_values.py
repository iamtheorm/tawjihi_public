"""Update nationality enum values

Revision ID: 69998234d0f0
Revises: 1df1e3491c5d
Create Date: 2025-09-23 23:10:19.199819

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '69998234d0f0'
down_revision: Union[str, Sequence[str], None] = '1df1e3491c5d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create new enum type with correct values
    op.execute("CREATE TYPE nationality_new AS ENUM ('OMANI', 'NON_OMANI')")

    # Update the column to use the new enum type
    op.execute("ALTER TABLE customers ALTER COLUMN nationality TYPE nationality_new USING nationality::text::nationality_new")

    # Drop the old enum type
    op.execute("DROP TYPE nationality")

    # Rename the new enum type to the original name
    op.execute("ALTER TYPE nationality_new RENAME TO nationality")


def downgrade() -> None:
    """Downgrade schema."""
    # Create old enum type with original values
    op.execute("CREATE TYPE nationality_old AS ENUM ('BD', 'EG', 'IN', 'OM', 'OTHER', 'PH', 'PK', 'UK', 'US')")

    # Update the column to use the old enum type
    op.execute("ALTER TABLE customers ALTER COLUMN nationality TYPE nationality_old USING nationality::text::nationality_old")

    # Drop the new enum type
    op.execute("DROP TYPE nationality")

    # Rename the old enum type to the original name
    op.execute("ALTER TYPE nationality_old RENAME TO nationality")
