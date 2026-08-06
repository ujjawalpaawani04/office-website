"""merge calendly_sync and appointment_mode branches

Revision ID: d4c8d8289ce9
Revises: a1c2e3f4b5d6, c1e2a69eabee
Create Date: 2026-08-06 12:21:42.672434

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd4c8d8289ce9'
down_revision = ('a1c2e3f4b5d6', 'c1e2a69eabee')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
