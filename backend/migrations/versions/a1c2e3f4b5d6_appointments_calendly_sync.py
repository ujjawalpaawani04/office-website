"""appointments: nullable client_phone + calendly_sync source

Revision ID: a1c2e3f4b5d6
Revises: b8c1c053a197
Create Date: 2026-08-03 14:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1c2e3f4b5d6'
down_revision = 'b8c1c053a197'
branch_labels = None
depends_on = None


def upgrade():
    # client_phone is only known when a visitor went through our own
    # pre-form before the Calendly embed - the background sync job
    # (calendly_sync_service.py) pulls in bookings made directly on
    # calendly.com too, and Calendly's API has no phone field for those.
    op.alter_column(
        "appointments", "client_phone",
        existing_type=sa.String(10), nullable=True,
    )
    op.alter_column(
        "appointments", "source",
        existing_type=sa.Enum("embed", "webhook", "admin", name="appointment_source"),
        type_=sa.Enum("embed", "webhook", "admin", "calendly_sync", name="appointment_source"),
        nullable=False,
    )


def downgrade():
    op.alter_column(
        "appointments", "source",
        existing_type=sa.Enum("embed", "webhook", "admin", "calendly_sync", name="appointment_source"),
        type_=sa.Enum("embed", "webhook", "admin", name="appointment_source"),
        nullable=False,
    )
    op.alter_column(
        "appointments", "client_phone",
        existing_type=sa.String(10), nullable=False,
    )
