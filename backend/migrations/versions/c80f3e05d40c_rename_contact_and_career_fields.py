"""rename contact and career fields

Revision ID: c80f3e05d40c
Revises: 121d214ed04f
Create Date: 2026-07-21 13:34:50.438969

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c80f3e05d40c'
down_revision = '121d214ed04f'
branch_labels = None
depends_on = None


def upgrade():
    # Renames preserve existing data (no drop/add), matching the field
    # names the frontend and email templates now use: phone/service on
    # enquiries, phone/message (+ new experience) on job_applications.
    op.alter_column(
        "enquiries", "mobile", new_column_name="phone",
        existing_type=sa.String(10), existing_nullable=False,
    )
    op.alter_column(
        "enquiries", "subject", new_column_name="service",
        existing_type=sa.String(200), existing_nullable=True,
    )

    op.alter_column(
        "job_applications", "mobile", new_column_name="phone",
        existing_type=sa.String(10), existing_nullable=False,
    )
    op.alter_column(
        "job_applications", "cover_letter", new_column_name="message",
        existing_type=sa.Text(), existing_nullable=True,
    )
    op.add_column("job_applications", sa.Column("experience", sa.String(60), nullable=True))


def downgrade():
    op.drop_column("job_applications", "experience")
    op.alter_column(
        "job_applications", "message", new_column_name="cover_letter",
        existing_type=sa.Text(), existing_nullable=True,
    )
    op.alter_column(
        "job_applications", "phone", new_column_name="mobile",
        existing_type=sa.String(10), existing_nullable=False,
    )

    op.alter_column(
        "enquiries", "service", new_column_name="subject",
        existing_type=sa.String(200), existing_nullable=True,
    )
    op.alter_column(
        "enquiries", "phone", new_column_name="mobile",
        existing_type=sa.String(10), existing_nullable=False,
    )
